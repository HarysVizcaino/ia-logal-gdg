export const dynamic = "force-dynamic";

const provider = process.env.FRONTIER_PROVIDER?.trim() ?? "";
const providerId = provider.toLowerCase();
const configuredModel = process.env.FRONTIER_MODEL?.trim() ?? "";
const providerLabel = process.env.FRONTIER_LABEL?.trim() || "Frontier model";
const providerDefaults = {
  openai: { baseUrl: "https://api.openai.com/v1", apiKey: process.env.OPENAI_API_KEY?.trim() },
  deepseek: { baseUrl: "https://api.deepseek.com", apiKey: process.env.DEEPSEEK_API_KEY?.trim() },
};
const defaults = providerDefaults[providerId as keyof typeof providerDefaults];
const apiKey = process.env.FRONTIER_API_KEY?.trim() ||
  defaults?.apiKey ||
  "";
const baseUrl = (process.env.FRONTIER_BASE_URL?.trim() || defaults?.baseUrl || "").replace(/\/$/, "");
const inputCostPerMillion = optionalPrice(process.env.FRONTIER_INPUT_COST_PER_1M);
const outputCostPerMillion = optionalPrice(process.env.FRONTIER_OUTPUT_COST_PER_1M);

function optionalPrice(value?: string) {
  return value?.trim() ? Number(value) : Number.NaN;
}

// Use safe messages instead of exposing provider response bodies or credentials.
async function providerError(response: Response) {
  const payload = await response.json().catch(() => null);
  const code = payload?.error?.code;
  const type = payload?.error?.type;
  if (response.status === 401 || response.status === 403) return "CLOUD CREDENTIALS REJECTED";
  if (response.status === 402 || code === "credit_balance_exhausted" || code === "insufficient_quota" || type === "insufficient_quota") return "CLOUD BALANCE EXHAUSTED · Recarga el saldo de la API del proveedor";
  if (response.status === 429) return "CLOUD RATE LIMIT · Espera unos segundos y vuelve a intentar";
  if (response.status === 404 || code === "model_not_found") return "CLOUD MODEL UNAVAILABLE · Revisa el modelo configurado";
  if (response.status === 400 || response.status === 422) return "CLOUD REQUEST REJECTED · Revisa los parámetros del modelo";
  return "CLOUD PROVIDER UNAVAILABLE · Vuelve a intentar más tarde";
}

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
        error: await providerError(response),
      });
    }

    const models = await response.json() as { data?: { id?: string }[] };
    if (!models.data?.some((model) => model.id === configuredModel)) {
      return Response.json({
        ...base,
        status: "unavailable",
        internet: true,
        providerReady: false,
        error: "CLOUD MODEL UNAVAILABLE · Revisa el modelo configurado",
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
      { error: upstream.ok ? "CLOUD INFERENCE FAILED" : await providerError(upstream) },
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
