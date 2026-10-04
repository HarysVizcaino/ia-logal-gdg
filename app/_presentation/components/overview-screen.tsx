import { motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";

import { scenes } from "../scene-registry";

interface OverviewScreenProps {
  readonly currentSceneIndex: number;
  readonly onClose: () => void;
  readonly onSelectScene: (index: number) => void;
}

export function OverviewScreen({
  currentSceneIndex,
  onClose,
  onSelectScene,
}: OverviewScreenProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.section
      className="overview-screen"
      role="dialog"
      aria-modal="true"
      aria-labelledby="overview-title"
      initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.985 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.985 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.24, ease: "easeOut" }}
    >
      <header className="overview-header">
        <div>
          <p>Mapa de la charla</p>
          <h2 id="overview-title">Todas las escenas</h2>
        </div>
        <button type="button" onClick={onClose} aria-label="Cerrar vista general" autoFocus>
          <X aria-hidden="true" />
        </button>
      </header>

      <div className="overview-grid">
        {scenes.map((scene, index) => {
          const isActive = index === currentSceneIndex;

          return (
            <button
              className="overview-card"
              data-active={isActive}
              type="button"
              key={scene.id}
              onClick={() => onSelectScene(index)}
              aria-current={isActive ? "step" : undefined}
            >
              <span className="overview-card-number">
                {String(index + 1).padStart(2, "0")}
              </span>
              <strong>{scene.shortTitle}</strong>
              <span>{scene.summary}</span>
            </button>
          );
        })}
      </div>

      <p className="overview-help">Selecciona una escena · Esc para volver</p>
    </motion.section>
  );
}
