import type {
  PresentationAction,
  PresentationState,
} from "./types";

export const initialPresentationState: PresentationState = {
  currentSceneIndex: 0,
  view: "stage",
  isProgressVisible: true,
};

function clampSceneIndex(index: number, lastSceneIndex: number) {
  if (!Number.isFinite(index)) {
    return 0;
  }

  return Math.min(Math.max(Math.trunc(index), 0), lastSceneIndex);
}

export function createPresentationReducer(sceneCount: number) {
  const normalizedSceneCount = Number.isFinite(sceneCount)
    ? Math.max(0, Math.trunc(sceneCount))
    : 0;
  const lastSceneIndex = Math.max(0, normalizedSceneCount - 1);

  return function presentationReducer(
    state: PresentationState,
    action: PresentationAction,
  ): PresentationState {
    switch (action.type) {
      case "NEXT_SCENE":
        return {
          ...state,
          currentSceneIndex: Math.min(
            state.currentSceneIndex + 1,
            lastSceneIndex,
          ),
          view: "stage",
        };

      case "PREVIOUS_SCENE":
        return {
          ...state,
          currentSceneIndex: Math.max(state.currentSceneIndex - 1, 0),
          view: "stage",
        };

      case "GO_TO_SCENE":
        return {
          ...state,
          currentSceneIndex: clampSceneIndex(action.index, lastSceneIndex),
          view: "stage",
        };

      case "OPEN_OVERVIEW":
        return { ...state, view: "overview" };

      case "CLOSE_OVERVIEW":
        return { ...state, view: "stage" };

      case "TOGGLE_OVERVIEW":
        return {
          ...state,
          view: state.view === "overview" ? "stage" : "overview",
        };

      case "TOGGLE_PROGRESS":
        return { ...state, isProgressVisible: !state.isProgressVisible };

      case "RESET_PRESENTATION":
        return initialPresentationState;

      default:
        return state;
    }
  };
}
