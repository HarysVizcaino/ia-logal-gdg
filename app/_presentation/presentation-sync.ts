import type { PresentationAction, PresentationState } from "./types";

export const presentationChannelName = "ia-local-presentation";

export interface PresentationSnapshot {
  readonly currentSceneIndex: number;
  readonly isProgressVisible: boolean;
  readonly startedAt: number;
  readonly view: PresentationState["view"];
}

export type PresentationSyncMessage =
  | {
      readonly type: "PRESENTATION_STATE";
      readonly snapshot: PresentationSnapshot;
    }
  | {
      readonly type: "PRESENTATION_ACTION";
      readonly action: PresentationAction;
    }
  | { readonly type: "RESET_TIMER" }
  | { readonly type: "REQUEST_PRESENTATION_STATE" };
