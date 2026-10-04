import type { LocalDemoCategory } from "@/app/_presentation/local-demo/types";

export const dynamic = "force-dynamic";

const OLLAMA_BASE_URL =
  process.env.OLLAMA_BASE_URL?.replace(/\/$/, "") ?? "http://127.0.0.1:11434";

const modelConfiguration: Record<LocalDemoCategory, string> = {
  slm: process.env.SLM_MODEL?.trim() ?? "",
  llm: process.env.LLM_MODEL?.trim() ?? "",
};

interface OllamaModelRecord {
  readonly name?: string;
  readonly model?: string;
}

interface OllamaModelsResponse {
  readonly models?: readonly OllamaModelRecord[];
}

interface LocalChatMessage {
  readonly role: "system" | "user" | "assistant";
  readonly content: string;
}

interface LocalChatRequest {
  readonly category?: LocalDemoCategory;
  readonly action?: "chat" | "warmup";
  readonly messages?: readonly LocalChatMessage[];
}

function isCategory(value: unknown): value is LocalDemoCategory {
  return value === "slm" || value === "llm";
}

function modelName(record: OllamaModelRecord) {
  return record.name ?? record.model ?? "";
}

async function ollamaFetch(path: string, init?: RequestInit) {
  return fetch(`${OLLAMA_BASE_URL}${path}`, {
    ...init,
    cache: "no-store",
    signal: AbortSignal.timeout(init?.method === "POST" ? 10 * 60_000 : 2_500),
  });
}

export async function GET() {
  try {
    const [tagsResponse, runningResponse] = await Promise.all([
      ollamaFetch("/api/tags"),
      ollamaFetch("/api/ps").catch(() => null),
    ]);

    if (!tagsResponse.ok) {
      throw new Error("OLLAMA_UNAVAILABLE");
    }

    const tags = (await tagsResponse.json()) as OllamaModelsResponse;
    const running = runningResponse?.ok
      ? ((await runningResponse.json()) as OllamaModelsResponse)
      : { models: [] };
    const installedNames = new Set((tags.models ?? []).map(modelName));
    const loadedNames = new Set((running.models ?? []).map(modelName));
    const models = Object.fromEntries(
      (Object.entries(modelConfiguration) as [LocalDemoCategory, string][]).map(
        ([category, model]) => [
          category,
          {
            category,
            label: category === "slm" ? "Small Local Model" : "Large Local Model",
            model,
            configured: Boolean(model),
            installed: Boolean(model) && installedNames.has(model),
            loaded: Boolean(model) && loadedNames.has(model),
          },
        ],
      ),
    );

    return Response.json({
      status: "ready",
      ollama: true,
      architecture: process.arch,
      models,
    });
  } catch {
    return Response.json(
      {
        status: "unavailable",
        ollama: false,
        architecture: process.arch,
        models: {
          slm: {
            category: "slm",
            label: "Small Local Model",
            model: modelConfiguration.slm,
            configured: Boolean(modelConfiguration.slm),
            installed: false,
            loaded: false,
          },
          llm: {
            category: "llm",
            label: "Large Local Model",
            model: modelConfiguration.llm,
            configured: Boolean(modelConfiguration.llm),
            installed: false,
            loaded: false,
          },
        },
        error: "OLLAMA UNAVAILABLE",
      },
      { status: 503 },
    );
  }
}

export async function POST(request: Request) {
  let body: LocalChatRequest;

  try {
    body = (await request.json()) as LocalChatRequest;
  } catch {
    return Response.json({ error: "INVALID REQUEST" }, { status: 400 });
  }

  if (!isCategory(body.category)) {
    return Response.json({ error: "INVALID MODEL CATEGORY" }, { status: 400 });
  }

  const model = modelConfiguration[body.category];

  if (!model) {
    return Response.json(
      { error: `${body.category.toUpperCase()} MODEL NOT CONFIGURED` },
      { status: 409 },
    );
  }

  try {
    if (body.action === "warmup") {
      const warmupResponse = await ollamaFetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model, prompt: "", stream: false, keep_alive: "10m" }),
      });

      if (!warmupResponse.ok) {
        return Response.json({ error: "MODEL LOAD FAILED" }, { status: 502 });
      }

      const result = (await warmupResponse.json()) as Record<string, unknown>;
      return Response.json({ ok: true, model, load_duration: result.load_duration });
    }

    const messages = body.messages;
    const validMessages =
      Array.isArray(messages) &&
      messages.length > 0 &&
      messages.length <= 20 &&
      messages.every(
        (message) =>
          ["system", "user", "assistant"].includes(message.role) &&
          typeof message.content === "string" &&
          message.content.length > 0 &&
          message.content.length <= 8_000,
      );

    if (!validMessages) {
      return Response.json({ error: "INVALID MESSAGES" }, { status: 400 });
    }

    const upstream = await ollamaFetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model, messages, stream: true, keep_alive: "10m" }),
    });

    if (!upstream.ok || !upstream.body) {
      return Response.json(
        { error: upstream.status === 404 ? "MODEL NOT INSTALLED" : "INFERENCE FAILED" },
        { status: 502 },
      );
    }

    return new Response(upstream.body, {
      status: 200,
      headers: {
        "Content-Type": "application/x-ndjson; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return Response.json({ error: "OLLAMA UNAVAILABLE" }, { status: 503 });
  }
}
