import { useEffect, type Dispatch } from "react";

import type { PresentationAction } from "../types";

interface UsePresentationKeyboardOptions {
  readonly dispatch: Dispatch<PresentationAction>;
  readonly isFullscreen: boolean;
  readonly openPresenterView: () => void;
  readonly toggleFullscreen: () => Promise<void>;
}

function isInteractiveTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  return Boolean(
    target.closest(
      'input, textarea, select, button, a, [contenteditable="true"], [role="button"]',
    ),
  );
}

function isTextEntryTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  return Boolean(
    target.closest('input, textarea, select, [contenteditable="true"]'),
  );
}

export function usePresentationKeyboard({
  dispatch,
  isFullscreen,
  openPresenterView,
  toggleFullscreen,
}: UsePresentationKeyboardOptions) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (
        event.repeat ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey
      ) {
        return;
      }

      const key = event.key.toLowerCase();

      if (
        key === "escape" &&
        !isFullscreen &&
        !isTextEntryTarget(event.target)
      ) {
        event.preventDefault();
        dispatch({ type: "TOGGLE_OVERVIEW" });
        return;
      }

      if (isInteractiveTarget(event.target)) {
        return;
      }

      if (key === "arrowright" || key === "pagedown" || key === " " || key === "enter") {
        event.preventDefault();
        dispatch({ type: "NEXT_SCENE" });
        return;
      }

      if (key === "arrowleft" || key === "pageup") {
        event.preventDefault();
        dispatch({ type: "PREVIOUS_SCENE" });
        return;
      }

      if (key === "home") {
        event.preventDefault();
        dispatch({ type: "GO_TO_SCENE", index: 0 });
        return;
      }

      if (key === "end") {
        event.preventDefault();
        dispatch({ type: "GO_TO_SCENE", index: Number.MAX_SAFE_INTEGER });
        return;
      }

      if (key === "f") {
        event.preventDefault();
        void toggleFullscreen();
        return;
      }

      if (key === "p") {
        event.preventDefault();
        openPresenterView();
        return;
      }

      if (key === "v") {
        event.preventDefault();
        dispatch({ type: "TOGGLE_PROGRESS" });
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [dispatch, isFullscreen, openPresenterView, toggleFullscreen]);
}
