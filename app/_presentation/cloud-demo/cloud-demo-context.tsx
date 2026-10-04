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

import {
  frontierIncidentPrompt,
  frontierSystemPrompt,
  recordedFrontierMetrics,
  recordedFrontierOutput,
} from "./cloud-demo-config";
import type {
  CloudDemoMode,
  CloudDemoState,
  CloudInferenceMetrics,
  CloudPreflight,
  CloudStreamChunk,
} from "./types";

const cloudChannelName = "ia-local-cloud-demo-v1";

const initialPreflight: CloudPreflight = {
  status: "checking",
  internet: false,
  providerReady: false,
  credentials: false,
  modelConfigured: false,
  config: { provider: "", model: "", label: "Frontier model" },
};

const initialState: CloudDemoState = { mode: "live", preflight: initialPreflight };

interface CloudDemoContextValue {
  readonly state: CloudDemoState;
  readonly checkPreflight: () => Promise<void>;
  readonly setMode: (mode: CloudDemoMode) => void;
  readonly runFrontier: (prompt?: string) => Promise<void>;
  readonly resetDemo: () => void;
}

const CloudDemoContext = createContext<CloudDemoContextValue>({
  state: initialState,
  checkPreflight: async () => undefined,
  setMode: () => undefined,
  runFrontier: async () => undefined,
  resetDemo: () => undefined,
});

function errorMessage(payload: unknown, fallback: string) {
  return typeof payload === "object" && payload !== null && "error" in payload && typeof payload.error === "string"
    ? payload.error
    : fallback;
}

export function CloudDemoProvider({ children }: { readonly children: ReactNode }) {
  const [state, setState] = useState<CloudDemoState>(initialState);
  const channelRef = useRef<BroadcastChannel | null>(null);
  const activeRequest = useRef<AbortController | null>(null);

  const updateState = useCallback((updater: (current: CloudDemoState) => CloudDemoState) => {
    setState((current) => {
      const next = updater(current);
      channelRef.current?.postMessage({ type: "STATE", state: next });
      return next;
    });
  }, []);

  const checkPreflight = useCallback(async () => {
    updateState((current) => ({
      ...current,
      preflight: { ...current.preflight, status: "checking", error: undefined },
    }));

    try {
      const response = await fetch("/api/ai/cloud", { cache: "no-store" });
      const payload = (await response.json()) as CloudPreflight;
      updateState((current) => ({ ...current, preflight: payload }));
    } catch {
      updateState((current) => ({
        ...current,
        preflight: { ...current.preflight, status: "unavailable", error: "CLOUD UNAVAILABLE" },
      }));
    }
  }, [updateState]);

  useEffect(() => {
    if (typeof BroadcastChannel === "undefined") return;
    const channel = new BroadcastChannel(cloudChannelName);
    channelRef.current = channel;
    const receiveState = (event: MessageEvent<{ type?: string; state?: CloudDemoState }>) => {
      if (event.data?.type === "STATE" && event.data.state) setState(event.data.state);
    };
    channel.addEventListener("message", receiveState);
    return () => {
      channel.removeEventListener("message", receiveState);
      channel.close();
      channelRef.current = null;
    };
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void checkPreflight(), 0);
    return () => window.clearTimeout(timer);
  }, [checkPreflight]);

  const setMode = useCallback((mode: CloudDemoMode) => {
    activeRequest.current?.abort();
    activeRequest.current = null;
    updateState((current) => ({ ...current, mode, run: undefined }));
  }, [updateState]);

  const resetDemo = useCallback(() => {
    activeRequest.current?.abort();
    activeRequest.current = null;
    updateState((current) => ({ ...current, run: undefined }));
  }, [updateState]);

  const runFrontier = useCallback(async (customPrompt?: string) => {
    activeRequest.current?.abort();
    const controller = new AbortController();
    activeRequest.current = controller;
    updateState((current) => ({ ...current, run: { status: "connecting", output: "" } }));

    if (state.mode === "demo") {
      let output = "";
      for (const piece of recordedFrontierOutput.split(/(\s+)/)) {
        if (controller.signal.aborted) return;
        await new Promise((resolve) => window.setTimeout(resolve, 18));
        output += piece;
        updateState((current) => ({ ...current, run: { status: "generating", output } }));
      }
      updateState((current) => ({
        ...current,
        run: {
          status: "complete",
          output: recordedFrontierOutput,
          metrics: {
            ...recordedFrontierMetrics,
            model: current.preflight.config.model || "Recorded frontier model",
            provider: current.preflight.config.provider || "Recorded provider",
          },
        },
      }));
      activeRequest.current = null;
      return;
    }

    const startedAt = performance.now();
    let firstTokenMs: number | undefined;
    let output = "";
    let buffer = "";
    let provider = state.preflight.config.provider;
    let model = state.preflight.config.model;
    let usage: Omit<CloudInferenceMetrics, "ttftMs" | "totalDurationMs"> | undefined;

    try {
      const response = await fetch("/api/ai/cloud", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model,
          stream: true,
          messages: [
            { role: "system", content: frontierSystemPrompt },
            { role: "user", content: customPrompt?.trim() || frontierIncidentPrompt },
          ],
        }),
        signal: controller.signal,
      });

      if (!response.ok || !response.body) {
        const payload = await response.json().catch(() => null);
        throw new Error(errorMessage(payload, "CLOUD UNAVAILABLE"));
      }

      updateState((current) => ({ ...current, run: { status: "generating", output: "" } }));
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        buffer += decoder.decode(value, { stream: !done });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        if (done && buffer.trim()) lines.push(buffer);

        for (const line of lines) {
          if (!line.trim()) continue;
          const chunk = JSON.parse(line) as CloudStreamChunk;
          if (chunk.type === "content" && chunk.content) {
            if (firstTokenMs === undefined) firstTokenMs = performance.now() - startedAt;
            output += chunk.content;
            updateState((current) => ({ ...current, run: { status: "generating", output } }));
          } else if (chunk.type === "usage") {
            provider = chunk.provider;
            model = chunk.model;
            usage = {
              provider,
              model,
              promptTokens: chunk.promptTokens,
              generatedTokens: chunk.generatedTokens,
              estimatedCost: chunk.estimatedCost,
            };
          } else if (chunk.type === "done") {
            provider = chunk.provider;
            model = chunk.model;
          }
        }
        if (done) break;
      }

      updateState((current) => ({
        ...current,
        run: {
          status: "complete",
          output,
          metrics: {
            provider,
            model,
            ...usage,
            ttftMs: firstTokenMs,
            totalDurationMs: performance.now() - startedAt,
          },
        },
      }));
    } catch (error) {
      if (controller.signal.aborted) return;
      updateState((current) => ({
        ...current,
        run: {
          status: "error",
          output,
          error: error instanceof Error ? error.message : "CLOUD UNAVAILABLE",
        },
      }));
    } finally {
      activeRequest.current = null;
    }
  }, [state.mode, state.preflight.config, updateState]);

  const value = useMemo<CloudDemoContextValue>(
    () => ({ state, checkPreflight, setMode, runFrontier, resetDemo }),
    [state, checkPreflight, setMode, runFrontier, resetDemo],
  );

  return <CloudDemoContext.Provider value={value}>{children}</CloudDemoContext.Provider>;
}

export function useCloudDemo() {
  return useContext(CloudDemoContext);
}
