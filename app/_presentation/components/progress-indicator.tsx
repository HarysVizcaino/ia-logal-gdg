interface ProgressIndicatorProps {
  readonly current: number;
  readonly total: number;
}

export function ProgressIndicator({
  current,
  total,
}: ProgressIndicatorProps) {
  const safeTotal = Math.max(total, 1);
  const progress = Math.min(Math.max(current / safeTotal, 0), 1);

  return (
    <div className="progress-indicator" aria-label={`Escena ${current} de ${total}`}>
      <div
        className="progress-track"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={current}
      >
        <span style={{ transform: `scaleX(${progress})` }} />
      </div>
      <span className="progress-count">
        <strong>{String(current).padStart(2, "0")}</strong>
        <span>/</span>
        <span>{String(total).padStart(2, "0")}</span>
      </span>
    </div>
  );
}
