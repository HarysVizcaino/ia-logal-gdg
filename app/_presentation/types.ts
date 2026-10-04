import type { ComponentType } from "react";

export const sceneIds = [
  "00-opening-hold-screen",
  "01-speaker-introduction",
  "01-where-ai-lives",
  "02-local-ai-definition",
  "03-model-axes",
  "05-right-model-for-task",
  "06-local-cloud-hybrid",
  "07-what-happens-during-inference",
  "08-tokens",
  "09-parameters",
  "09-model-work-modes",
  "10-model-memory",
  "10-context-memory",
  "11-ram-vram",
  "12-apple-unified-memory",
  "13-quantization",
  "14-what-model-fits",
  "15-model-runtime-application",
  "16-open-weight-models",
  "17-model-lifecycle",
  "17-llamacpp-ollama",
  "18-local-ai-terminal",
  "19-local-model-api",
  "20-local-ai-lab",
  "21-slm-classification-demo",
  "22-slm-live-metrics",
  "24-llm-analysis-demo",
  "25-slm-vs-llm-results",
  "26-need-more-capability",
  "27-what-makes-frontier",
  "28-frontier-cloud-demo",
  "30-which-would-you-use",
  "31-local-privacy-security",
  "33-why-ai-home-lab",
  "34-your-ai-infrastructure",
  "34-home-lab-operations",
  "35-infinite-tokens",
  "36-when-local-makes-sense",
  "37-final-ai-architecture",
  "38-three-questions",
  "39-closing-message",
  "40-thank-you-questions",
] as const;

export type SceneId = (typeof sceneIds)[number];

export type SceneComponent = ComponentType;

export interface SceneNotes {
  readonly objective: string;
  readonly script: readonly string[];
  readonly keyMessage: string;
  readonly avoid: readonly string[];
  readonly transition: string;
}

export interface SceneDefinition {
  readonly id: SceneId;
  readonly section: string;
  readonly title: string;
  readonly shortTitle: string;
  readonly summary: string;
  readonly durationSeconds: number;
  readonly mode?: "demo" | "live";
  readonly notes: SceneNotes;
  readonly component: SceneComponent;
}

export type PresentationView = "stage" | "overview";

export interface PresentationState {
  readonly currentSceneIndex: number;
  readonly view: PresentationView;
  readonly isProgressVisible: boolean;
}

export type PresentationAction =
  | { readonly type: "NEXT_SCENE" }
  | { readonly type: "PREVIOUS_SCENE" }
  | { readonly type: "GO_TO_SCENE"; readonly index: number }
  | { readonly type: "OPEN_OVERVIEW" }
  | { readonly type: "CLOSE_OVERVIEW" }
  | { readonly type: "TOGGLE_OVERVIEW" }
  | { readonly type: "TOGGLE_PROGRESS" }
  | { readonly type: "RESET_PRESENTATION" };
