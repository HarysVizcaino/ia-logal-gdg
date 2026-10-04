"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";

import { OverviewScreen } from "./components/overview-screen";
import { PresentationControls } from "./components/presentation-controls";
import { ProgressIndicator } from "./components/progress-indicator";
import { useFullscreen } from "./hooks/use-fullscreen";
import { usePresentationHostSync } from "./hooks/use-presentation-host-sync";
import { usePresentationKeyboard } from "./hooks/use-presentation-keyboard";
import {
  createPresentationReducer,
  initialPresentationState,
} from "./presentation-reducer";
import { sceneCount, scenes } from "./scene-registry";

const presentationReducer = createPresentationReducer(sceneCount);

export function PresentationShell() {
  const [state, dispatch] = useReducer(
    presentationReducer,
    initialPresentationState,
  );
  const viewportRef = useRef<HTMLDivElement>(null);
  const [startedAt, setStartedAt] = useState(0);
  const stateRef = useRef(state);
  const shouldReduceMotion = useReducedMotion();
  const { isFullscreen, toggleFullscreen } = useFullscreen(viewportRef);
  const activeScene = scenes[state.currentSceneIndex];
  const ActiveScene = activeScene.component;
  const openPresenterView = useCallback(() => {
    const presenterWindow = window.open(
      "/presenter",
      "ia-local-presenter",
      "popup=yes,width=1440,height=900",
    );
    presenterWindow?.focus();
  }, []);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const handlePresentationAction = useCallback((action: Parameters<typeof dispatch>[0]) => {
    const currentIndex = stateRef.current.currentSceneIndex;
    const startsTalk =
      currentIndex === 0 &&
      (action.type === "NEXT_SCENE" ||
        (action.type === "GO_TO_SCENE" && action.index > 0));
    const returnsToHold =
      action.type === "RESET_PRESENTATION" ||
      (action.type === "PREVIOUS_SCENE" && currentIndex === 1) ||
      (action.type === "GO_TO_SCENE" && action.index <= 0);

    if (startsTalk) setStartedAt(Date.now());
    if (returnsToHold) setStartedAt(0);
    dispatch(action);
  }, []);

  usePresentationHostSync({ dispatch: handlePresentationAction, setStartedAt, startedAt, state });
  usePresentationKeyboard({
    dispatch: handlePresentationAction,
    isFullscreen,
    openPresenterView,
    toggleFullscreen,
  });

  return (
    <div className="presentation-viewport" ref={viewportRef}>
      <div
        className="presentation-stage"
        data-scene-id={activeScene.id}
        data-view={state.view}
      >
        <div className="presentation-ambient" aria-hidden="true" />

        <header className="presentation-chrome presentation-chrome-top">
          <span>IA @DEVFEST</span>
          <span className="presentation-chrome-rule" />
          <span>SANTO DOMINGO · 2026</span>
        </header>

        <main
          className="presentation-scene-frame"
          aria-live="polite"
          aria-roledescription="diapositiva"
          aria-hidden={state.view === "overview"}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              className="presentation-scene-layer"
              key={activeScene.id}
              initial={
                shouldReduceMotion ? false : { opacity: 0, x: "1.5cqw" }
              }
              animate={{ opacity: 1, x: 0 }}
              exit={
                shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: "-1cqw" }
              }
              transition={{
                duration: shouldReduceMotion ? 0 : 0.32,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <ActiveScene />
            </motion.div>
          </AnimatePresence>
        </main>

        <PresentationControls
          canGoBack={state.currentSceneIndex > 0}
          canGoForward={state.currentSceneIndex < sceneCount - 1}
          isFullscreen={isFullscreen}
          isProgressVisible={state.isProgressVisible}
          onPrevious={() => handlePresentationAction({ type: "PREVIOUS_SCENE" })}
          onNext={() => handlePresentationAction({ type: "NEXT_SCENE" })}
          onToggleOverview={() => handlePresentationAction({ type: "TOGGLE_OVERVIEW" })}
          onToggleProgress={() => handlePresentationAction({ type: "TOGGLE_PROGRESS" })}
          onToggleFullscreen={() => void toggleFullscreen()}
          onOpenPresenterView={openPresenterView}
        />

        <AnimatePresence>
          {state.isProgressVisible && state.view === "stage" && state.currentSceneIndex > 0 ? (
            <motion.div
              className="presentation-progress-layer"
              initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
            >
              <ProgressIndicator
                current={state.currentSceneIndex}
                total={sceneCount - 1}
              />
            </motion.div>
          ) : null}
        </AnimatePresence>

        <footer className="presentation-chrome presentation-chrome-bottom">
          <span>← → NAVEGAR · ESC MAPA · P PRESENTADOR · F PANTALLA COMPLETA</span>
          <span>{activeScene.shortTitle}</span>
        </footer>

        <AnimatePresence>
          {state.view === "overview" ? (
            <OverviewScreen
              currentSceneIndex={state.currentSceneIndex}
                onClose={() => handlePresentationAction({ type: "CLOSE_OVERVIEW" })}
                onSelectScene={(index) =>
                  handlePresentationAction({ type: "GO_TO_SCENE", index })
              }
            />
          ) : null}
        </AnimatePresence>

      </div>
    </div>
  );
}
