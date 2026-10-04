import { useCallback, useEffect, useState, type RefObject } from "react";

export function useFullscreen(target: RefObject<HTMLElement | null>) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    function syncFullscreenState() {
      setIsFullscreen(Boolean(document.fullscreenElement));
    }

    document.addEventListener("fullscreenchange", syncFullscreenState);

    return () => {
      document.removeEventListener("fullscreenchange", syncFullscreenState);
    };
  }, []);

  const toggleFullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
        return;
      }

      await target.current?.requestFullscreen();
    } catch {
      // Fullscreen can be denied by the browser. The presentation remains usable.
    }
  }, [target]);

  return { isFullscreen, toggleFullscreen };
}
