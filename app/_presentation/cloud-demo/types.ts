export type CloudDemoMode = "live" | "demo";
export type CloudRunStatus = "idle" | "connecting" | "generating" | "complete" | "error";

export interface FrontierConfig {
  readonly provider: string;
  readonly model: string;
  readonly label: string;
}

export interface CloudPreflight {
  readonly status: "checking" | "ready" | "unavailable";
  readonly internet: boolean;
  readonly providerReady: boolean;
  readonly credentials: boolean;
  readonly modelConfigured: boolean;
  readonly config: FrontierConfig;
  readonly error?: string;
}

export interface CloudInferenceMetrics {
  readonly model: string;
  readonly provider: string;
  readonly ttftMs?: number;
  readonly totalDurationMs?: number;
  readonly promptTokens?: number;
  readonly generatedTokens?: number;
  readonly estimatedCost?: number;
}

export interface CloudDemoRun {
  readonly status: CloudRunStatus;
  readonly output: string;
  readonly metrics?: CloudInferenceMetrics;
  readonly error?: string;
}

export interface CloudDemoState {
  readonly mode: CloudDemoMode;
  readonly preflight: CloudPreflight;
  readonly run?: CloudDemoRun;
}

export type CloudStreamChunk =
  | { readonly type: "content"; readonly content: string }
  | {
      readonly type: "usage";
      readonly model: string;
      readonly provider: string;
      readonly promptTokens?: number;
      readonly generatedTokens?: number;
      readonly estimatedCost?: number;
    }
  | { readonly type: "done"; readonly model: string; readonly provider: string };
