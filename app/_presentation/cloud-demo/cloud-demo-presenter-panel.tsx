"use client";

import { Activity, RefreshCcw, RotateCcw } from "lucide-react";

import { useCloudDemo } from "./cloud-demo-context";

export function CloudDemoPresenterPanel() {
  const { checkPreflight, resetDemo, setMode, state } = useCloudDemo();
  const { preflight, run } = state;

  return (
    <section className="presenter-demo-ops presenter-cloud-ops">
      <header>
        <span>Cloud operations</span>
        <strong data-mode={state.mode}>{state.mode.toUpperCase()}</strong>
      </header>
      <dl>
        <div><dt>Internet</dt><dd data-ready={preflight.internet}>{preflight.internet ? "Connected" : "Unavailable"}</dd></div>
        <div><dt>Provider</dt><dd data-ready={preflight.providerReady}>{preflight.config.provider || "Not configured"}</dd></div>
        <div><dt>Model</dt><dd data-ready={preflight.modelConfigured}>{preflight.config.model || "Not configured"}</dd></div>
        <div><dt>Cloud status</dt><dd data-ready={preflight.status === "ready"}>{state.mode === "demo" ? "Demo ready" : preflight.status}</dd></div>
        <div><dt>Credentials</dt><dd data-ready={preflight.credentials}>{preflight.credentials ? "Configured" : "Missing"}</dd></div>
        <div><dt>Run status</dt><dd>{run?.status ?? "Idle"}</dd></div>
      </dl>
      <div className="presenter-cloud-actions">
        <button type="button" onClick={() => void checkPreflight()}><RefreshCcw aria-hidden /> Check</button>
        <button type="button" onClick={() => setMode(state.mode === "live" ? "demo" : "live")}><Activity aria-hidden />{state.mode === "live" ? "Use demo" : "Try live"}</button>
        <button type="button" onClick={resetDemo}><RotateCcw aria-hidden /> Reset</button>
      </div>
    </section>
  );
}
