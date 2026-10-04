import { describe, expect, it } from "vitest";

import {
  createPresentationReducer,
  initialPresentationState,
} from "./presentation-reducer";

describe("presentationReducer", () => {
  const reducer = createPresentationReducer(3);

  it("navigates forward and backward without leaving the scene range", () => {
    let state = initialPresentationState;

    state = reducer(state, { type: "PREVIOUS_SCENE" });
    expect(state.currentSceneIndex).toBe(0);

    state = reducer(state, { type: "NEXT_SCENE" });
    state = reducer(state, { type: "NEXT_SCENE" });
    state = reducer(state, { type: "NEXT_SCENE" });
    expect(state.currentSceneIndex).toBe(2);

    state = reducer(state, { type: "PREVIOUS_SCENE" });
    expect(state.currentSceneIndex).toBe(1);
  });

  it("clamps direct navigation and returns to the stage", () => {
    const overviewState = reducer(initialPresentationState, {
      type: "OPEN_OVERVIEW",
    });
    const firstScene = reducer(overviewState, {
      type: "GO_TO_SCENE",
      index: -20,
    });
    const lastScene = reducer(firstScene, {
      type: "GO_TO_SCENE",
      index: Number.MAX_SAFE_INTEGER,
    });

    expect(firstScene).toMatchObject({ currentSceneIndex: 0, view: "stage" });
    expect(lastScene).toMatchObject({ currentSceneIndex: 2, view: "stage" });
  });

  it("toggles overview and progress independently", () => {
    let state = reducer(initialPresentationState, { type: "TOGGLE_OVERVIEW" });
    expect(state.view).toBe("overview");

    state = reducer(state, { type: "TOGGLE_PROGRESS" });
    expect(state.isProgressVisible).toBe(false);

    state = reducer(state, { type: "RESET_PRESENTATION" });
    expect(state).toEqual(initialPresentationState);
  });

  it("handles an invalid scene count safely", () => {
    const invalidReducer = createPresentationReducer(Number.NaN);
    const state = invalidReducer(initialPresentationState, {
      type: "NEXT_SCENE",
    });

    expect(state.currentSceneIndex).toBe(0);
  });
});
