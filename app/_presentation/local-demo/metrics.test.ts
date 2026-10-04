import { describe, expect, it } from "vitest";

import { collectOllamaMetrics, nanosecondsToMilliseconds } from "./metrics";

describe("local inference metrics", () => {
  it("converts Ollama nanoseconds to milliseconds", () => {
    expect(nanosecondsToMilliseconds(3_200_000_000)).toBe(3200);
    expect(nanosecondsToMilliseconds(undefined)).toBeUndefined();
  });

  it("calculates tokens per second from the final Ollama chunk", () => {
    const metrics = collectOllamaMetrics(
      {
        model: "configured-model",
        eval_count: 24,
        eval_duration: 2_000_000_000,
        total_duration: 3_000_000_000,
        load_duration: 500_000_000,
        prompt_eval_count: 48,
      },
      240,
      1000,
      4000,
    );

    expect(metrics.tokensPerSecond).toBe(12);
    expect(metrics.totalDurationMs).toBe(3000);
    expect(metrics.loadDurationMs).toBe(500);
    expect(metrics.promptTokens).toBe(48);
    expect(metrics.generatedTokens).toBe(24);
  });
});
