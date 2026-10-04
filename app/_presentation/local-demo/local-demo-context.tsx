"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { presetsById, type LocalDemoPresetId } from "./demo-config";
import { collectOllamaMetrics } from "./metrics";
import type {
  LocalDemoCategory,
  LocalDemoMode,
  LocalDemoPreflight,
  LocalDemoState,
  LocalInferenceMetrics,
  OllamaStreamChunk,
} from "./types";

const demoChannelName = "ia-local-demo-v1";

const initialPreflight: LocalDemoPreflight = {
  status: "checking",
  ollama: false,
  models: {
    slm: {
      category: "slm",
      label: "Small Local Model",
      model: "",
      configured: false,
      installed: false,
      loaded: false,
    },
    llm: {
      category: "llm",
      label: "Large Local Model",
      model: "",
      configured: false,
      installed: false,
      loaded: false,
    },
  },
};

const initialState: LocalDemoState = {
  mode: "live",
  preflight: initialPreflight,
  runs: {},
};

interface LocalDemoContextValue {
  readonly state: LocalDemoState;
  readonly checkPreflight: () => Promise<void>;
  readonly setMode: (mode: LocalDemoMode) => void;
  readonly runPreset: (presetId: LocalDemoPresetId, prompt?: string) => Promise<void>;
  readonly resetDemo: (category?: LocalDemoCategory) => void;
  readonly warmUpModels: () => Promise<void>;
}

const LocalDemoContext = createContext<LocalDemoContextValue>({
  state: initialState,
  checkPreflight: async () => undefined,
  setMode: () => undefined,
  runPreset: async () => undefined,
  resetDemo: () => undefined,
  warmUpModels: async () => undefined,
});

function readableError(payload: unknown, fallback: string) {
  return typeof payload === "object" &&
    payload !== null &&
    "error" in payload &&
    typeof payload.error === "string"
    ? payload.error
    : fallback;
}

export function LocalDemoProvider({ children }: { readonly children: ReactNode }) {
  const [state, setState] = useState<LocalDemoState>(initialState);
  const channelRef = useRef<BroadcastChannel | null>(null);
  const activeRequests = useRef<Partial<Record<LocalDemoCategory, AbortController>>>({});

  const updateState = useCallback(
    (updater: (current: LocalDemoState) => LocalDemoState) => {
      setState((current) => {
        const next = updater(current);
        channelRef.current?.postMessage({ type: "STATE", state: next });
        return next;
      });
    },
    [],
  );

  const checkPreflight = useCallback(async () => {
    updateState((current) => ({
      ...current,
      preflight: { ...current.preflight, status: "checking", error: undefined },
    }));

    try {
      const response = await fetch("/api/ai/local", { cache: "no-store" });
      const payload = (await response.json()) as LocalDemoPreflight;
      updateState((current) => ({ ...current, preflight: payload }));
    } catch {
      updateState((current) => ({
        ...current,
        preflight: {
          ...current.preflight,
          status: "unavailable",
          ollama: false,
          error: "OLLAMA UNAVAILABLE",
        },
      }));
    }
  }, [updateState]);

  useEffect(() => {
    if (typeof BroadcastChannel === "undefined") {
      return;
    }

    const channel = new BroadcastChannel(demoChannelName);
    channelRef.current = channel;
    const receiveState = (event: MessageEvent<{ type?: string; state?: LocalDemoState }>) => {
      if (event.data?.type === "STATE" && event.data.state) {
        setState(event.data.state);
      }
    };
    channel.addEventListener("message", receiveState);

    return () => {
      channel.removeEventListener("message", receiveState);
      channel.close();
      channelRef.current = null;
    };
  }, []);

  useEffect(() => {
    const startPreflight = window.setTimeout(() => void checkPreflight(), 0);
    return () => window.clearTimeout(startPreflight);
  }, [checkPreflight]);

  const setMode = useCallback(
    (mode: LocalDemoMode) => {
      updateState((current) => ({ ...current, mode }));
    },
    [updateState],
  );

  const resetDemo = useCallback(
    (category?: LocalDemoCategory) => {
      if (category) {
        activeRequests.current[category]?.abort();
        delete activeRequests.current[category];
      } else {
        activeRequests.current.slm?.abort();
        activeRequests.current.llm?.abort();
        activeRequests.current = {};
      }

      updateState((current) => ({
        ...current,
        runs: category
          ? { ...current.runs, [category]: undefined }
          : {},
      }));
    },
    [updateState],
  );

  const runPreset = useCallback(
    async (presetId: LocalDemoPresetId, customPrompt?: string) => {
      const preset = presetsById[presetId];
      const category = preset.category;
      activeRequests.current[category]?.abort();
      const controller = new AbortController();
      activeRequests.current[category] = controller;

      updateState((current) => ({
        ...current,
        runs: {
          ...current.runs,
          [category]: {
            category,
            presetId,
            task: preset.task,
            status: current.mode === "live" ? "loading-model" : "generating",
            output: "",
          },
        },
      }));

      if (state.mode === "demo") {
        const pieces = preset.demoOutput.split(/(\s+)/);

        for (const piece of pieces) {
          if (controller.signal.aborted) return;
          await new Promise((resolve) => window.setTimeout(resolve, 24));
          updateState((current) => ({
            ...current,
            runs: {
              ...current.runs,
              [category]: {
                category,
                presetId,
                task: preset.task,
                status: "generating",
                output: `${current.runs[category]?.output ?? ""}${piece}`,
              },
            },
          }));
        }

        const now = Date.now();
        const model = `Demo ${category.toUpperCase()}`;
        updateState((current) => ({
          ...current,
          runs: {
            ...current.runs,
            [category]: {
              category,
              presetId,
              task: preset.task,
              status: "complete",
              output: preset.demoOutput,
              metrics: {
                ...preset.demoMetrics,
                model,
                startedAt: now - (preset.demoMetrics.totalDurationMs ?? 0),
                finishedAt: now,
              },
            },
          },
        }));
        return;
      }

      const requestStartedAt = performance.now();
      const wallClockStartedAt = Date.now();
      let firstTokenMs: number | undefined;
      let output = "";
      let buffer = "";

      try {
        const response = await fetch("/api/ai/local", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            category,
            action: "chat",
            messages: [
              { role: "system", content: preset.system },
              { role: "user", content: customPrompt?.trim() || preset.prompt },
            ],
          }),
          signal: controller.signal,
        });

        if (!response.ok || !response.body) {
          const payload = await response.json().catch(() => null);
          throw new Error(readableError(payload, "INFERENCE FAILED"));
        }

        updateState((current) => ({
          ...current,
          runs: {
            ...current.runs,
            [category]: { ...current.runs[category]!, status: "generating" },
          },
        }));

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let finalMetrics: LocalInferenceMetrics | undefined;

        while (true) {
          const { done, value } = await reader.read();
          buffer += decoder.decode(value, { stream: !done });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";
          if (done && buffer.trim()) {
            lines.push(buffer);
            buffer = "";
          }

          for (const line of lines) {
            if (!line.trim()) continue;
            const chunk = JSON.parse(line) as OllamaStreamChunk;
            const content = chunk.message?.content ?? "";

            if (content) {
              if (firstTokenMs === undefined) {
                firstTokenMs = performance.now() - requestStartedAt;
              }
              output += content;
              updateState((current) => ({
                ...current,
                runs: {
                  ...current.runs,
                  [category]: { ...current.runs[category]!, output },
                },
              }));
            }

            if (chunk.done) {
              finalMetrics = collectOllamaMetrics(
                chunk,
                firstTokenMs,
                wallClockStartedAt,
                Date.now(),
              );
            }
          }

          if (done) break;
        }

        updateState((current) => ({
          ...current,
          runs: {
            ...current.runs,
            [category]: {
              ...current.runs[category]!,
              status: "complete",
              output,
              metrics: finalMetrics,
            },
          },
        }));
        void checkPreflight();
      } catch (error) {
        if (controller.signal.aborted) return;
        updateState((current) => ({
          ...current,
          runs: {
            ...current.runs,
            [category]: {
              ...current.runs[category]!,
              status: "error",
              error: error instanceof Error ? error.message : "INFERENCE FAILED",
            },
          },
        }));
      } finally {
        delete activeRequests.current[category];
      }
    },
    [checkPreflight, state.mode, updateState],
  );

  const warmUpModels = useCallback(async () => {
    if (state.mode !== "live") return;

    await Promise.all(
      (["slm", "llm"] as const).map(async (category) => {
        const model = state.preflight.models[category];
        if (!model.configured || !model.installed) return;
        await fetch("/api/ai/local", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ category, action: "warmup" }),
        });
      }),
    );
    await checkPreflight();
  }, [checkPreflight, state.mode, state.preflight.models]);

  const value = useMemo<LocalDemoContextValue>(
    () => ({ state, checkPreflight, setMode, runPreset, resetDemo, warmUpModels }),
    [state, checkPreflight, setMode, runPreset, resetDemo, warmUpModels],
  );

  return <LocalDemoContext.Provider value={value}>{children}</LocalDemoContext.Provider>;
}

export function useLocalDemo() {
  return useContext(LocalDemoContext);
}
