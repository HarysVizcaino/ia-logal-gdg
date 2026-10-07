"use client";

import { useEffect, useRef } from "react";

export function CloudStreamingOutput({ output, generating }: {
  readonly output: string;
  readonly generating: boolean;
}) {
  const viewportRef = useRef<HTMLPreElement>(null);
  const followOutput = useRef(true);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    if (!output) {
      followOutput.current = true;
      viewport.scrollTop = 0;
    } else if (followOutput.current) {
      viewport.scrollTop = viewport.scrollHeight;
    }
  }, [output]);

  return (
    <div className="cloud-output">
      <span>Salida en streaming</span>
      <pre
        ref={viewportRef}
        tabIndex={0}
        aria-label="Respuesta del modelo frontier"
        onKeyDown={(event) => {
          // Preserve native scrolling without triggering slide navigation.
          if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "PageUp", "PageDown", "Home", "End", " ", "Enter"].includes(event.key)) {
            event.stopPropagation();
          }
        }}
        onScroll={(event) => {
          const viewport = event.currentTarget;
          followOutput.current = viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight < 32;
        }}
      >
        {output || "La respuesta aparecerá aquí…"}
        {generating ? <i aria-hidden /> : null}
      </pre>
    </div>
  );
}
