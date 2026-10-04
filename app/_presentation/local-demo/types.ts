export type LocalDemoMode = "live" | "demo";
export type LocalDemoCategory = "slm" | "llm";
export type LocalDemoRunStatus =
  | "idle"
  | "loading-model"
  | "generating"
  | "complete"
  | "error";

export interface LocalInferenceMetrics {
  readonly model: string;
  readonly ttftMs?: number;
  readonly totalDurationMs?: number;
  readonly loadDurationMs?: number;
  readonly promptTokens?: number;
  readonly generatedTokens?: number;
  readonly tokensPerSecond?: number;
  readonly startedAt?: number;
  readonly finishedAt?: number;
}

export interface LocalModelStatus {
  readonly category: LocalDemoCategory;
  readonly label: string;
  readonly model: string;
  readonly configured: boolean;
  readonly installed: boolean;
  readonly loaded: boolean;
}

export interface LocalDemoPreflight {
  readonly status: "checking" | "ready" | "unavailable";
  readonly ollama: boolean;
  readonly architecture?: string;
  readonly models: Record<LocalDemoCategory, LocalModelStatus>;
  readonly error?: string;
}

export interface LocalDemoRun {
  readonly category: LocalDemoCategory;
  readonly presetId: string;
  readonly task: string;
  readonly status: LocalDemoRunStatus;
  readonly output: string;
  readonly metrics?: LocalInferenceMetrics;
  readonly error?: string;
}

export interface LocalDemoState {
  readonly mode: LocalDemoMode;
  readonly preflight: LocalDemoPreflight;
  readonly runs: Partial<Record<LocalDemoCategory, LocalDemoRun>>;
}

export interface OllamaStreamChunk {
  readonly message?: { readonly content?: string };
  readonly done?: boolean;
  readonly model?: string;
  readonly total_duration?: number;
  readonly load_duration?: number;
  readonly prompt_eval_count?: number;
  readonly prompt_eval_duration?: number;
  readonly eval_count?: number;
  readonly eval_duration?: number;
}
