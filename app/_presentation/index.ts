export {
  createPresentationReducer,
  initialPresentationState,
} from "./presentation-reducer";
export { PresentationShell } from "./presentation-shell";
export { getSceneById, sceneCount, scenes } from "./scene-registry";
export type {
  PresentationAction,
  PresentationState,
  PresentationView,
  SceneDefinition,
  SceneId,
} from "./types";
