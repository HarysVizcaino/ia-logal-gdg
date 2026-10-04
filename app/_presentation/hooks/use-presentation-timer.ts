import { useEffect, useState } from "react";

export type PresentationTiming = "ahead" | "on-time" | "behind";

interface UsePresentationTimerOptions {
  readonly isActive: boolean;
  readonly currentSceneIndex: number;
  readonly startedAt: number;
  readonly totalScenes: number;
  readonly targetSeconds?: number;
  readonly talkTargetMinutes?: number;
  readonly sceneDurationsSeconds?: readonly number[];
  readonly sectionKey?: string;
  readonly sectionStartSceneIndex?: number;
  readonly sectionTargetSeconds?: number;
}

function formatDuration(milliseconds: number) {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function usePresentationTimer({
  isActive,
  currentSceneIndex,
  startedAt,
  totalScenes,
  targetSeconds = 40 * 60,
  talkTargetMinutes = 40,
  sceneDurationsSeconds = [],
  sectionKey = "presentation",
  sectionStartSceneIndex = 0,
  sectionTargetSeconds = targetSeconds,
}: UsePresentationTimerOptions) {
  const [currentTime, setCurrentTime] = useState(() => Date.now());
  const [sceneStartedAt, setSceneStartedAt] = useState(startedAt);
  const [sectionClock, setSectionClock] = useState({
    key: sectionKey,
    startedAt,
  });

  useEffect(() => {
    if (!isActive) {
      return;
    }

    const updateClock = () => setCurrentTime(Date.now());
    const initialUpdate = window.setTimeout(updateClock, 0);
    const interval = window.setInterval(updateClock, 1000);

    return () => {
      window.clearTimeout(initialUpdate);
      window.clearInterval(interval);
    };
  }, [isActive]);

  useEffect(() => {
    const resetSceneClock = window.setTimeout(
      () => setSceneStartedAt(Date.now()),
      0,
    );

    return () => window.clearTimeout(resetSceneClock);
  }, [currentSceneIndex, startedAt]);

  useEffect(() => {
    const resetSectionClock = window.setTimeout(() => {
      setSectionClock((current) =>
        current.key === sectionKey && current.startedAt >= startedAt
          ? current
          : { key: sectionKey, startedAt: Date.now() },
      );
    }, 0);

    return () => window.clearTimeout(resetSectionClock);
  }, [sectionKey, startedAt]);

  const elapsedMilliseconds = Math.max(0, currentTime - startedAt);
  const targetMilliseconds = targetSeconds * 1000;
  const talkTargetMilliseconds = talkTargetMinutes * 60 * 1000;
  const talkRemainingSeconds = Math.max(
    0,
    Math.ceil((talkTargetMilliseconds - elapsedMilliseconds) / 1000),
  );
  const previousTargetSeconds = sceneDurationsSeconds
    .slice(sectionStartSceneIndex, currentSceneIndex)
    .reduce((total, seconds) => total + seconds, 0);
  const lastSceneIndex = Math.max(totalScenes - 1, 1);
  const expectedMilliseconds = sceneDurationsSeconds.length
    ? previousTargetSeconds * 1000
    : (currentSceneIndex / lastSceneIndex) * targetMilliseconds;
  const sectionElapsedMilliseconds = Math.max(
    0,
    currentTime - sectionClock.startedAt,
  );
  const pacingDifference = sectionElapsedMilliseconds - expectedMilliseconds;
  const pacingTolerance = 20 * 1000;
  const sceneElapsedMilliseconds = Math.max(0, currentTime - sceneStartedAt);
  const sceneTargetMilliseconds =
    (sceneDurationsSeconds[currentSceneIndex] ?? 0) * 1000;

  let timing: PresentationTiming = "on-time";

  if (pacingDifference < -pacingTolerance) {
    timing = "ahead";
  } else if (pacingDifference > pacingTolerance) {
    timing = "behind";
  }

  return {
    elapsed: formatDuration(elapsedMilliseconds),
    target: formatDuration(targetMilliseconds),
    talkTarget: formatDuration(talkTargetMilliseconds),
    talkRemainingSeconds,
    sectionElapsed: formatDuration(sectionElapsedMilliseconds),
    sectionTarget: formatDuration(sectionTargetSeconds * 1000),
    slideElapsed: formatDuration(sceneElapsedMilliseconds),
    slideTarget: formatDuration(sceneTargetMilliseconds),
    timing,
  };
}
