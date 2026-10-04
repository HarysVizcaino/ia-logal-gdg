export const dynamic = "force-dynamic";

const provider = process.env.FRONTIER_PROVIDER?.trim() ?? "";
const configuredModel = process.env.FRONTIER_MODEL?.trim() ?? "";
const providerLabel = process.env.FRONTIER_LABEL?.trim() || "Frontier model";
const apiKey = process.env.FRONTIER_API_KEY?.trim() ||
  (provider.toLowerCase() === "openai" ? process.env.OPENAI_API_KEY?.trim() : "") ||
  "";
const defaultBaseUrl = provider.toLowerCase() === "openai" ? "https://api.openai.com/v1" : "";
const baseUrl = (process.env.FRONTIER_BASE_URL?.trim() || defaultBaseUrl).replace(/\/$/, "");
const inputCostPerMillion = Number(process.env.FRONTIER_INPUT_COST_PER_1M);
const outputCostPerMillion = Number(process.env.FRONTIER_OUTPUT_COST_PER_1M);

interface CloudMessage {
  readonly role: "system" | "user" | "assistant";
  readonly content: string;
}

interface CloudChatRequest {
  readonly messages?: readonly CloudMessage[];
  readonly model?: string;
  readonly stream?: boolean;
}

interface CompatibleChunk {
  readonly model?: string;
  readonly choices?: readonly {
    readonly delta?: { readonly content?: string };
  }[];
  readonly usage?: {
    readonly prompt_tokens?: number;
    readonly completion_tokens?: number;
  };
}

function publicConfig() {
  return { provider, model: configuredModel, label: providerLabel };
}

function jsonLine(value: unknown) {
  return `${JSON.stringify(value)}\n`;
}

function estimateCost(promptTokens?: number, generatedTokens?: number) {
  if (
    promptTokens === undefined ||
    generatedTokens === undefined ||
    !Number.isFinite(inputCostPerMillion) ||
    !Number.isFinite(outputCostPerMillion) ||
    inputCostPerMillion < 0 ||
    outputCostPerMillion < 0
  ) {
    return undefined;
  }

  return (promptTokens * inputCostPerMillion + generatedTokens * outputCostPerMillion) / 1_000_000;
}

async function providerFetch(path: string, init?: RequestInit) {
  if (!baseUrl) throw new Error("PROVIDER_NOT_CONFIGURED");
  return fetch(`${baseUrl}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      ...init?.headers,
    },
    signal: AbortSignal.timeout(init?.method === "POST" ? 5 * 60_000 : 5_000),
  });
}

export async function GET() {
  const credentials = Boolean(apiKey);
  const modelConfigured = Boolean(configuredModel);
  const base = {
    credentials,
    modelConfigured,
    config: publicConfig(),
  };

  if (!provider || !baseUrl || !credentials || !modelConfigured) {
    return Response.json({
      ...base,
      status: "unavailable",
      internet: false,
      providerReady: false,
      error: "CLOUD NOT CONFIGURED",
    });
  }

  try {
    const response = await providerFetch("/models");
    if (!response.ok) {
      return Response.json({
        ...base,
        status: "unavailable",
        internet: true,
        providerReady: false,
        error: response.status === 401 || response.status === 403
          ? "CLOUD CREDENTIALS REJECTED"
          : "CLOUD PROVIDER UNAVAILABLE",
      });
    }

    return Response.json({
      ...base,
      status: "ready",
      internet: true,
      providerReady: true,
    });
  } catch {
    return Response.json({
      ...base,
      status: "unavailable",
      internet: false,
      providerReady: false,
      error: "CLOUD UNAVAILABLE",
    });
  }
}

export async function POST(request: Request) {
  if (!provider || !baseUrl || !apiKey || !configuredModel) {
    return Response.json({ error: "CLOUD NOT CONFIGURED" }, { status: 409 });
  }

  let body: CloudChatRequest;
  try {
    body = (await request.json()) as CloudChatRequest;
  } catch {
    return Response.json({ error: "INVALID REQUEST" }, { status: 400 });
  }

  const validMessages =
    Array.isArray(body.messages) &&
    body.messages.length > 0 &&
    body.messages.length <= 20 &&
    body.messages.every(
      (message) =>
        ["system", "user", "assistant"].includes(message.role) &&
        typeof message.content === "string" &&
        message.content.length > 0 &&
        message.content.length <= 8_000,
    );

  if (!validMessages || body.stream === false) {
    return Response.json({ error: "INVALID REQUEST" }, { status: 400 });
  }

  if (body.model && body.model !== configuredModel) {
    return Response.json({ error: "MODEL NOT ALLOWED" }, { status: 400 });
  }

  let upstream: Response;
  try {
    upstream = await providerFetch("/chat/completions", {
      method: "POST",
      body: JSON.stringify({
        model: configuredModel,
        messages: body.messages,
        stream: true,
        stream_options: { include_usage: true },
      }),
    });
  } catch {
    return Response.json({ error: "CLOUD UNAVAILABLE" }, { status: 503 });
  }

  if (!upstream.ok || !upstream.body) {
    return Response.json(
      { error: upstream.status === 401 || upstream.status === 403 ? "CLOUD CREDENTIALS REJECTED" : "CLOUD INFERENCE FAILED" },
      { status: 502 },
    );
  }

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const reader = upstream.body!.getReader();
      let buffer = "";
      let resolvedModel = configuredModel;

      try {
        while (true) {
          const { done, value } = await reader.read();
          buffer += decoder.decode(value, { stream: !done });
          buffer = buffer.replace(/\r\n/g, "\n");
          const events = buffer.split("\n\n");
          buffer = events.pop() ?? "";
          if (done && buffer.trim()) events.push(buffer);

          for (const event of events) {
            for (const rawLine of event.split("\n")) {
              const line = rawLine.trim();
              if (!line.startsWith("data:")) continue;
              const data = line.slice(5).trim();
              if (!data || data === "[DONE]") continue;
              const chunk = JSON.parse(data) as CompatibleChunk;
              resolvedModel = chunk.model || resolvedModel;
              const content = chunk.choices?.[0]?.delta?.content;
              if (content) controller.enqueue(encoder.encode(jsonLine({ type: "content", content })));
              if (chunk.usage) {
                const promptTokens = chunk.usage.prompt_tokens;
                const generatedTokens = chunk.usage.completion_tokens;
                controller.enqueue(encoder.encode(jsonLine({
                  type: "usage",
                  provider,
                  model: resolvedModel,
                  promptTokens,
                  generatedTokens,
                  estimatedCost: estimateCost(promptTokens, generatedTokens),
                })));
              }
            }
          }

          if (done) break;
        }

        controller.enqueue(encoder.encode(jsonLine({ type: "done", provider, model: resolvedModel })));
        controller.close();
      } catch {
        controller.error(new Error("CLOUD STREAM FAILED"));
      }
    },
    cancel() {
      void upstream.body?.cancel();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
