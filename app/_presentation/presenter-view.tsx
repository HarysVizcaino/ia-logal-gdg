"use client";

import {
  ArrowLeft,
  ArrowRight,
  Expand,
  MonitorUp,
  RotateCcw,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { useFullscreen } from "./hooks/use-fullscreen";
import { usePresentationTimer } from "./hooks/use-presentation-timer";
import { usePresenterSync } from "./hooks/use-presenter-sync";
import { LocalDemoPresenterPanel } from "./local-demo/local-demo-presenter-panel";
import { CloudDemoPresenterPanel } from "./cloud-demo/cloud-demo-presenter-panel";
import { presentationConfig } from "./presentation-config";
import {
  sceneCount,
  scenes,
  SECTION_TARGET_SECONDS,
} from "./scene-registry";
import type { SceneDefinition } from "./types";

const timingLabels = {
  ahead: "Adelantado",
  "on-time": "A tiempo",
  behind: "Atrasado",
} as const;

function isEditableTarget(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    Boolean(target.closest('input, textarea, select, [contenteditable="true"]'))
  );
}

export function PresenterView() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [fallbackStartedAt] = useState(() => Date.now());
  const { isFullscreen, toggleFullscreen } = useFullscreen(viewportRef);
  const { isConnected, resetTimer, sendAction, snapshot } = usePresenterSync();
  const currentSceneIndex = snapshot?.currentSceneIndex ?? 0;
  const isTalkStarted = Boolean(snapshot?.startedAt) && currentSceneIndex > 0;
  const currentScene: SceneDefinition =
    scenes[currentSceneIndex] ?? scenes[0];
  const nextScene = scenes[currentSceneIndex + 1];
  const CurrentScene = currentScene.component;
  const sectionStartSceneIndex = scenes.findIndex(
    (scene) => scene.section === currentScene.section,
  );
  const currentSectionTarget =
    SECTION_TARGET_SECONDS[currentScene.section];
  const plannedPresentationSeconds = presentationConfig.talkTargetMinutes * 60;
  const timer = usePresentationTimer({
    isActive: isTalkStarted,
    currentSceneIndex,
    startedAt: snapshot?.startedAt || fallbackStartedAt,
    totalScenes: sceneCount,
    targetSeconds: plannedPresentationSeconds,
    talkTargetMinutes: presentationConfig.talkTargetMinutes,
    sceneDurationsSeconds: scenes.map((scene) => scene.durationSeconds),
    sectionKey: currentScene.section,
    sectionStartSceneIndex,
    sectionTargetSeconds: currentSectionTarget,
  });
  const finalTimeAlert =
    timer.talkRemainingSeconds > 0 && timer.talkRemainingSeconds <= 2 * 60
      ? "2 MIN REMAINING"
      : timer.talkRemainingSeconds > 0 && timer.talkRemainingSeconds <= 5 * 60
        ? "5 MIN REMAINING"
        : null;

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (
        event.repeat ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey ||
        isEditableTarget(event.target)
      ) {
        return;
      }

      const key = event.key.toLowerCase();

      if (key === "arrowright" || key === "pagedown" || key === " " || key === "enter") {
        event.preventDefault();
        sendAction({ type: "NEXT_SCENE" });
      } else if (key === "arrowleft" || key === "pageup") {
        event.preventDefault();
        sendAction({ type: "PREVIOUS_SCENE" });
      } else if (key === "home") {
        event.preventDefault();
        sendAction({ type: "GO_TO_SCENE", index: 0 });
      } else if (key === "end") {
        event.preventDefault();
        sendAction({ type: "GO_TO_SCENE", index: sceneCount - 1 });
      } else if (key === "r") {
        event.preventDefault();
        resetTimer();
      } else if (key === "f") {
        event.preventDefault();
        void toggleFullscreen();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [resetTimer, sendAction, toggleFullscreen]);

  return (
    <div className="presenter-private-viewport" ref={viewportRef}>
      <header className="presenter-private-header">
        <div className="presenter-private-brand">
          <span className="presenter-private-mark">IA</span>
          <div>
            <strong>Presenter Console</strong>
            <span>Vista privada · segunda pantalla</span>
          </div>
        </div>

        <div className="presenter-private-status">
          <span data-connected={isConnected}>
            <i />
            {isConnected ? (isTalkStarted ? "Charla iniciada" : "Waiting for start") : "Esperando presentación"}
          </span>
          <button
            type="button"
            onClick={() => void toggleFullscreen()}
            aria-label={isFullscreen ? "Salir de fullscreen" : "Usar fullscreen"}
            title="Fullscreen (F)"
          >
            <Expand aria-hidden="true" />
          </button>
        </div>
      </header>

      <main className="presenter-private-layout">
        <section className="presenter-private-primary">
          <div className="presenter-private-section-heading">
            <span>Vista de la audiencia</span>
            <strong>
              {currentSceneIndex === 0 ? "HOLD" : `${String(currentSceneIndex).padStart(2, "0")} / ${String(sceneCount - 1).padStart(2, "0")}`}
            </strong>
          </div>

          <div className="presenter-private-preview" aria-label="Escena actual">
            <CurrentScene />
          </div>

          <div className="presenter-private-notes">
            <div className="presenter-private-section-heading">
              <span>Speaker notes</span>
              <strong>
                {currentScene.mode === "demo" ? <i>Demo data</i> : null}
                {isTalkStarted ? `Objetivo slide ${timer.slideTarget}` : "Timer not started"}
              </strong>
            </div>
            <ol>
              {currentScene.notes.script.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ol>
          </div>
        </section>

        <aside className="presenter-private-sidebar">
          <section className="presenter-private-timer">
            <div>
              <span>Slide</span>
              <strong>{isTalkStarted ? timer.slideElapsed : "--:--"}</strong>
              <small>{isTalkStarted ? `/ ${timer.slideTarget}` : "NOT STARTED"}</small>
            </div>
            <div>
              <span>Sección {isTalkStarted ? `${timer.sectionElapsed} / ${timer.sectionTarget}` : "WAITING"}</span>
              <strong data-timing={timer.timing}>
                {timingLabels[timer.timing]}
              </strong>
            </div>
            <button
              type="button"
              disabled={!isTalkStarted}
              onClick={resetTimer}
              aria-label="Reiniciar temporizador"
              title="Reiniciar (R)"
            >
              <RotateCcw aria-hidden="true" />
            </button>
            {finalTimeAlert ? <strong className="presenter-time-alert" data-urgent={timer.talkRemainingSeconds <= 2 * 60}>{finalTimeAlert}</strong> : null}
          </section>

          <section className="presenter-private-brief">
            <div>
              <span>Sección</span>
              <strong>{currentScene.section}</strong>
            </div>
            <div>
              <span>Objetivo</span>
              <p>{currentScene.notes.objective}</p>
            </div>
            <div className="presenter-private-key-message">
              <span>Mensaje clave</span>
              <p>{currentScene.notes.keyMessage}</p>
            </div>
            {currentScene.id === "01-speaker-introduction" && !presentationConfig.speaker.image ? (
              <p className="presenter-asset-warning">Speaker photo missing · usando placeholder elegante</p>
            ) : null}
          </section>

          <section className="presenter-private-guidance">
            <div>
              <span>Evitar</span>
              <ul>
                {currentScene.notes.avoid.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
            <div>
              <span>Siguiente transición</span>
              <p>{currentScene.notes.transition}</p>
            </div>
          </section>

          {currentScene.section === "Demo SLM + LLM local" ? (
            <LocalDemoPresenterPanel />
          ) : null}

          {currentScene.section === "Frontier + Local vs Cloud" ? (
            <CloudDemoPresenterPanel />
          ) : null}

          <section className="presenter-private-next">
            <span>Próxima slide</span>
            {nextScene ? (
              <>
                <strong>{nextScene.title}</strong>
                <p>{nextScene.summary}</p>
              </>
            ) : (
              <strong>Fin de la presentación</strong>
            )}
          </section>

          <nav className="presenter-private-navigation" aria-label="Navegación de escenas">
            <button
              type="button"
              disabled={currentSceneIndex === 0 || !isConnected}
              onClick={() => sendAction({ type: "PREVIOUS_SCENE" })}
            >
              <ArrowLeft aria-hidden="true" />
              Anterior
            </button>
            <button
              type="button"
              disabled={currentSceneIndex === sceneCount - 1 || !isConnected}
              onClick={() => sendAction({ type: "NEXT_SCENE" })}
            >
              Siguiente
              <ArrowRight aria-hidden="true" />
            </button>
          </nav>

          <section className="presenter-private-map">
            <span>Mapa rápido</span>
            <div>
              {scenes.map((scene, index) => (
                <button
                  type="button"
                  key={scene.id}
                  data-active={index === currentSceneIndex}
                  disabled={!isConnected}
                  onClick={() => sendAction({ type: "GO_TO_SCENE", index })}
                  aria-label={`Ir a ${scene.shortTitle}`}
                  title={scene.shortTitle}
                >
                  {index === 0 ? "00" : String(index).padStart(2, "0")}
                </button>
              ))}
            </div>
          </section>

          {!isConnected ? (
            <section className="presenter-private-empty">
              <MonitorUp aria-hidden="true" />
              <strong>Abre la presentación principal</strong>
              <p>Esta consola se conectará automáticamente con la pantalla de la audiencia.</p>
            </section>
          ) : null}
        </aside>
      </main>

      <footer className="presenter-private-footer">
        <span>← → navegar</span>
        <span>Charla {isTalkStarted ? timer.elapsed : "--:--"} / {timer.talkTarget}</span>
        <span>R reiniciar tiempo</span>
        <span>F fullscreen privado</span>
      </footer>
    </div>
  );
}
