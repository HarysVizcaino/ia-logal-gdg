import {
  ChevronLeft,
  ChevronRight,
  Expand,
  Eye,
  EyeOff,
  Grid3X3,
  Minimize,
  Presentation,
} from "lucide-react";

interface PresentationControlsProps {
  readonly canGoBack: boolean;
  readonly canGoForward: boolean;
  readonly isFullscreen: boolean;
  readonly isProgressVisible: boolean;
  readonly onPrevious: () => void;
  readonly onNext: () => void;
  readonly onToggleOverview: () => void;
  readonly onToggleProgress: () => void;
  readonly onToggleFullscreen: () => void;
  readonly onOpenPresenterView: () => void;
}

export function PresentationControls({
  canGoBack,
  canGoForward,
  isFullscreen,
  isProgressVisible,
  onPrevious,
  onNext,
  onToggleOverview,
  onToggleProgress,
  onToggleFullscreen,
  onOpenPresenterView,
}: PresentationControlsProps) {
  return (
    <nav className="presentation-controls" aria-label="Controles de presentación">
      <button
        type="button"
        onClick={onPrevious}
        disabled={!canGoBack}
        aria-label="Escena anterior"
        aria-keyshortcuts="ArrowLeft"
        title="Anterior (←)"
      >
        <ChevronLeft aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={onToggleOverview}
        aria-label="Abrir vista general"
        aria-keyshortcuts="Escape"
        title="Vista general (Esc)"
      >
        <Grid3X3 aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={onNext}
        disabled={!canGoForward}
        aria-label="Escena siguiente"
        aria-keyshortcuts="ArrowRight"
        title="Siguiente (→)"
      >
        <ChevronRight aria-hidden="true" />
      </button>
      <span className="presentation-controls-divider" aria-hidden="true" />
      <button
        type="button"
        onClick={onOpenPresenterView}
        aria-label="Abrir vista privada del ponente"
        aria-keyshortcuts="P"
        title="Vista privada del ponente (P)"
      >
        <Presentation aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={onToggleProgress}
        aria-label={isProgressVisible ? "Ocultar progreso" : "Mostrar progreso"}
        aria-keyshortcuts="V"
        title={isProgressVisible ? "Ocultar progreso (V)" : "Mostrar progreso (V)"}
      >
        {isProgressVisible ? (
          <EyeOff aria-hidden="true" />
        ) : (
          <Eye aria-hidden="true" />
        )}
      </button>
      <button
        type="button"
        onClick={onToggleFullscreen}
        aria-label={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
        aria-keyshortcuts="F"
        title={isFullscreen ? "Salir de fullscreen (F)" : "Fullscreen (F)"}
      >
        {isFullscreen ? (
          <Minimize aria-hidden="true" />
        ) : (
          <Expand aria-hidden="true" />
        )}
      </button>
    </nav>
  );
}
