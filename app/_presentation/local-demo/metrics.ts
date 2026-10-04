import type { LocalInferenceMetrics, OllamaStreamChunk } from "./types";

export function nanosecondsToMilliseconds(nanoseconds?: number) {
  return typeof nanoseconds === "number" && Number.isFinite(nanoseconds)
    ? nanoseconds / 1_000_000
    : undefined;
}

export function collectOllamaMetrics(
  chunk: OllamaStreamChunk,
  ttftMs: number | undefined,
  startedAt: number,
  finishedAt: number,
): LocalInferenceMetrics {
  const evaluationSeconds =
    typeof chunk.eval_duration === "number" && chunk.eval_duration > 0
      ? chunk.eval_duration / 1_000_000_000
      : undefined;
  const tokensPerSecond =
    evaluationSeconds && typeof chunk.eval_count === "number"
      ? chunk.eval_count / evaluationSeconds
      : undefined;

  return {
    model: chunk.model ?? "Local model",
    ttftMs,
    totalDurationMs: nanosecondsToMilliseconds(chunk.total_duration),
    loadDurationMs: nanosecondsToMilliseconds(chunk.load_duration),
    promptTokens: chunk.prompt_eval_count,
    generatedTokens: chunk.eval_count,
    tokensPerSecond,
    startedAt,
    finishedAt,
  };
}
