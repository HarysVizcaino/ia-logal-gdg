import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const fetchMock = vi.fn();

beforeEach(() => {
  vi.resetModules();
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
  vi.stubEnv("FRONTIER_PROVIDER", "deepseek");
  vi.stubEnv("FRONTIER_MODEL", "deepseek-v4-pro");
  vi.stubEnv("FRONTIER_LABEL", "DeepSeek V4 Pro");
  vi.stubEnv("FRONTIER_BASE_URL", "");
  vi.stubEnv("FRONTIER_API_KEY", "");
  vi.stubEnv("DEEPSEEK_API_KEY", "test-deepseek-key");
  vi.stubEnv("OPENAI_API_KEY", "test-openai-key");
  vi.stubEnv("FRONTIER_INPUT_COST_PER_1M", "");
  vi.stubEnv("FRONTIER_OUTPUT_COST_PER_1M", "");
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

function request() {
  return new Request("http://localhost/api/ai/cloud", {
    method: "POST",
    body: JSON.stringify({ messages: [{ role: "user", content: "Responde OK" }], stream: true }),
  });
}

describe("cloud provider integration", () => {
  it("uses the DeepSeek endpoint and key and checks the configured model", async () => {
    fetchMock.mockResolvedValue(Response.json({ data: [{ id: "deepseek-v4-pro" }] }));
    const { GET } = await import("./route");
    const result = await (await GET()).json();
    expect(result.status).toBe("ready");
    expect(result.config.provider).toBe("deepseek");
    expect(fetchMock).toHaveBeenCalledWith("https://api.deepseek.com/models", expect.objectContaining({
      headers: expect.objectContaining({ Authorization: "Bearer test-deepseek-key" }),
    }));
    expect(JSON.stringify(result)).not.toContain("test-deepseek-key");
  });

  it("does not reuse the OpenAI key when the DeepSeek key is missing", async () => {
    vi.stubEnv("DEEPSEEK_API_KEY", "");
    const { GET, POST } = await import("./route");
    expect(await (await GET()).json()).toMatchObject({ status: "unavailable", credentials: false });
    expect((await POST(request())).status).toBe(409);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("does not claim ready when the provider does not offer the selected model", async () => {
    fetchMock.mockResolvedValue(Response.json({ data: [{ id: "another-model" }] }));
    const { GET } = await import("./route");
    expect(await (await GET()).json()).toMatchObject({ status: "unavailable", providerReady: false, error: expect.stringContaining("MODEL UNAVAILABLE") });
  });

  it.each([
    [401, {}, "CREDENTIALS REJECTED"],
    [402, {}, "BALANCE EXHAUSTED"],
    [429, { code: "credit_balance_exhausted", type: "insufficient_quota" }, "BALANCE EXHAUSTED"],
    [429, { code: "rate_limit_exceeded" }, "RATE LIMIT"],
    [404, { code: "model_not_found" }, "MODEL UNAVAILABLE"],
    [422, {}, "REQUEST REJECTED"],
    [503, {}, "PROVIDER UNAVAILABLE"],
  ])("explains provider error %s without exposing raw provider messages", async (status, error, expected) => {
    fetchMock.mockResolvedValue(Response.json({ error: { ...error, message: "private provider diagnostics" } }, { status }));
    const { POST } = await import("./route");
    const response = await POST(request());
    expect(response.status).toBe(502);
    const body = await response.json();
    expect(body.error).toContain(expected);
    expect(JSON.stringify(body)).not.toContain("private provider diagnostics");
  });

  it("streams the final answer and usage, tolerating reasoning chunks and split SSE events", async () => {
    const event = (value: unknown) => `data: ${JSON.stringify(value)}\r\n\r\n`;
    const sse = ": keep-alive\r\n\r\n" +
      event({ model: "deepseek-v4-pro", choices: [{ delta: { reasoning_content: "analysis" } }], usage: null }) +
      event({ choices: [{ delta: { content: "Sí" } }] }) +
      event({ choices: [], usage: { prompt_tokens: 20, completion_tokens: 12 } }) +
      "data: [DONE]\r\n\r\n";
    const bytes = new TextEncoder().encode(sse);
    fetchMock.mockResolvedValue(new Response(new ReadableStream({ start(controller) {
      for (let i = 0; i < bytes.length; i += 7) controller.enqueue(bytes.slice(i, i + 7));
      controller.close();
    } })));
    const { POST } = await import("./route");
    const response = await POST(request());
    const chunks = (await response.text()).trim().split("\n").map(line => JSON.parse(line));
    expect(chunks).toEqual([
      { type: "content", content: "Sí" },
      { type: "usage", provider: "deepseek", model: "deepseek-v4-pro", promptTokens: 20, generatedTokens: 12 },
      { type: "done", provider: "deepseek", model: "deepseek-v4-pro" },
    ]);
    expect(fetchMock).toHaveBeenCalledWith("https://api.deepseek.com/chat/completions", expect.objectContaining({ method: "POST" }));
    const sent = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(sent).toMatchObject({ model: "deepseek-v4-pro", stream: true, stream_options: { include_usage: true } });
  });

  it("retains explicit endpoint and generic credential support", async () => {
    vi.stubEnv("FRONTIER_PROVIDER", "custom");
    vi.stubEnv("FRONTIER_BASE_URL", "https://provider.example/v1/");
    vi.stubEnv("FRONTIER_API_KEY", "test-custom-key");
    fetchMock.mockResolvedValue(Response.json({ data: [{ id: "deepseek-v4-pro" }] }));
    const { GET } = await import("./route");
    await GET();
    expect(fetchMock).toHaveBeenCalledWith("https://provider.example/v1/models", expect.objectContaining({
      headers: expect.objectContaining({ Authorization: "Bearer test-custom-key" }),
    }));
  });
});
