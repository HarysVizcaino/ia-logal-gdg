"use client";

import { Activity, RefreshCcw, RotateCcw, Zap } from "lucide-react";

import { useLocalDemo } from "./local-demo-context";

export function LocalDemoPresenterPanel() {
  const { checkPreflight, resetDemo, setMode, state, warmUpModels } = useLocalDemo();
  const currentRun = state.runs.llm?.status === "generating"
    ? state.runs.llm
    : state.runs.slm?.status === "generating"
      ? state.runs.slm
      : state.runs.llm ?? state.runs.slm;

  return (
    <section className="presenter-demo-ops">
      <header>
        <span>Demo operations</span>
        <strong data-mode={state.mode}>{state.mode.toUpperCase()}</strong>
      </header>
      <dl>
        <div><dt>Ollama</dt><dd data-ready={state.preflight.ollama}>{state.preflight.ollama ? "Ready" : "Unavailable"}</dd></div>
        <div><dt>SLM</dt><dd data-ready={state.preflight.models.slm.installed}>{state.mode === "demo" ? "Demo ready" : state.preflight.models.slm.installed ? "Ready" : "Missing"}</dd></div>
        <div><dt>LLM</dt><dd data-ready={state.preflight.models.llm.installed}>{state.mode === "demo" ? "Demo ready" : state.preflight.models.llm.installed ? "Ready" : "Missing"}</dd></div>
        <div><dt>Current task</dt><dd>{currentRun?.task ?? "Idle"}</dd></div>
        <div><dt>Model status</dt><dd>{currentRun?.status ?? "Unloaded"}</dd></div>
      </dl>
      <div>
        <button type="button" onClick={() => void checkPreflight()}><RefreshCcw aria-hidden /> Check</button>
        <button type="button" disabled={state.mode !== "live" || !state.preflight.ollama} onClick={() => void warmUpModels()}><Zap aria-hidden /> Warm up</button>
        <button type="button" onClick={() => setMode(state.mode === "live" ? "demo" : "live")}><Activity aria-hidden /> {state.mode === "live" ? "Use demo" : "Try live"}</button>
        <button type="button" onClick={() => resetDemo()}><RotateCcw aria-hidden /> Reset</button>
      </div>
    </section>
  );
}
