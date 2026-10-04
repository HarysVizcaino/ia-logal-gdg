"use client";

import {
  Activity,
  ArrowRight,
  BrainCircuit,
  CircleAlert,
  Laptop,
  LoaderCircle,
  Play,
  RefreshCcw,
  RotateCcw,
  Sparkles,
  Zap,
} from "lucide-react";
import { useState } from "react";

import { demoPresets, type LocalDemoPresetId } from "../local-demo/demo-config";
import { useLocalDemo } from "../local-demo/local-demo-context";
import type {
  LocalDemoCategory,
  LocalDemoRun,
  LocalInferenceMetrics,
} from "../local-demo/types";
import { SceneHeader } from "./section-one-scenes";

function formatMilliseconds(value?: number) {
  if (value === undefined) return "—";
  return value >= 1000 ? `${(value / 1000).toFixed(2)} s` : `${Math.round(value)} ms`;
}

function formatRate(value?: number) {
  return value === undefined ? "—" : value.toFixed(1);
}

function modelLabel(
  category: LocalDemoCategory,
  mode: "live" | "demo",
  configuredName: string,
  run?: LocalDemoRun,
) {
  if (mode === "demo") return `Demo ${category.toUpperCase()}`;
  return run?.metrics?.model || configuredName || "Sin configurar";
}

function ModeBadge({ mode }: { readonly mode: "live" | "demo" }) {
  return (
    <span className="lab-mode-badge" data-mode={mode}>
      <i /> {mode === "live" ? "Modo en vivo" : "Datos de demo"}
    </span>
  );
}

function DemoFallback() {
  const { setMode, state } = useLocalDemo();

  if (state.mode === "demo") return null;

  return (
    <button className="switch-demo-button" type="button" onClick={() => setMode("demo")}>
      Usar datos de demo
    </button>
  );
}

interface MetricsGridProps {
  readonly metrics?: LocalInferenceMetrics;
  readonly status?: LocalDemoRun["status"];
}

function MetricsGrid({ metrics, status = "idle" }: MetricsGridProps) {
  const values = [
    { label: "Primer token", value: formatMilliseconds(metrics?.ttftMs) },
    { label: "Tokens / s", value: formatRate(metrics?.tokensPerSecond) },
    { label: "Tiempo total", value: formatMilliseconds(metrics?.totalDurationMs) },
    { label: "Tokens de salida", value: metrics?.generatedTokens?.toString() ?? "—" },
  ];

  return (
    <div className="lab-metrics-grid" data-status={status}>
      {values.map((metric) => (
        <div key={metric.label}>
          <span>{metric.label}</span>
          <strong>{metric.value}</strong>
        </div>
      ))}
    </div>
  );
}

function RunStatus({ run }: { readonly run?: LocalDemoRun }) {
  const status = run?.status ?? "idle";
  const statusLabels: Record<typeof status, string> = {
    idle: "en espera",
    "loading-model": "cargando modelo",
    generating: "generando",
    complete: "completo",
    error: "error",
  };
  return (
    <span className="lab-run-status" data-status={status}>
      {status === "generating" || status === "loading-model" ? <LoaderCircle aria-hidden /> : <i />}
      {statusLabels[status]}
    </span>
  );
}

export function LocalAiLabScene() {
  const { checkPreflight, setMode, state, warmUpModels } = useLocalDemo();
  const { preflight } = state;
  const modelStatuses = [preflight.models.slm, preflight.models.llm];

  return (
    <section className="scene section-scene local-lab-scene">
      <SceneHeader number="22" kicker="Demo SLM + LLM local" title="Vamos a probarlo" />
      <div className="lab-heading"><span>Laboratorio de IA local</span><ModeBadge mode={state.mode} /></div>

      <div className="lab-preflight">
        <div className="lab-device-card">
          <Laptop aria-hidden />
          <div><span>Equipo</span><strong>Mac M4</strong></div>
          <div><span>Arquitectura</span><strong>{preflight.architecture ?? "arm64"}</strong></div>
        </div>
        <div className="preflight-checks">
          <span>Comprobación previa</span>
          <p data-ready={preflight.ollama}><b>{preflight.ollama ? "✓" : "×"}</b> Ollama</p>
          <p data-ready={preflight.models.slm.installed}><b>{preflight.models.slm.installed ? "✓" : "?"}</b> Modelo SLM</p>
          <p data-ready={preflight.models.llm.installed}><b>{preflight.models.llm.installed ? "✓" : "?"}</b> Modelo LLM</p>
        </div>
      </div>

      <div className="lab-model-cards">
        {modelStatuses.map((model) => (
          <article key={model.category} data-category={model.category}>
            <div><BrainCircuit aria-hidden /><span>Categoría</span><strong>{model.category.toUpperCase()}</strong></div>
            <dl>
              <div><dt>Modelo</dt><dd>{state.mode === "demo" ? `Demo ${model.category.toUpperCase()}` : model.model || "Sin configurar"}</dd></div>
              <div><dt>Ubicación</dt><dd>Local</dd></div>
              <div><dt>Estado</dt><dd data-ready={state.mode === "demo" || model.installed}>{state.mode === "demo" ? "Demo lista" : model.installed ? "Listo" : "No disponible"}</dd></div>
            </dl>
          </article>
        ))}
      </div>

      <div className="lab-actions">
        <button type="button" onClick={() => void checkPreflight()}><RefreshCcw aria-hidden /> Comprobar</button>
        <button type="button" disabled={state.mode !== "live" || !preflight.ollama} onClick={() => void warmUpModels()}><Zap aria-hidden /> Precargar modelos</button>
        {state.mode === "live" ? <DemoFallback /> : <button type="button" onClick={() => setMode("live")}><Activity aria-hidden /> Probar modo en vivo</button>}
      </div>
    </section>
  );
}

export function SlmClassificationDemoScene() {
  const { resetDemo, runPreset, state } = useLocalDemo();
  const [presetId, setPresetId] = useState<LocalDemoPresetId>(demoPresets.slmClassification1.id);
  const [prompt, setPrompt] = useState<string>(demoPresets.slmClassification1.prompt);
  const run = state.runs.slm;
  const model = modelLabel("slm", state.mode, state.preflight.models.slm.model, run);
  const allowedCategories = ["BILLING", "ACCOUNT_ACCESS", "TECHNICAL_SUPPORT", "CANCELLATION"];
  const normalizedOutput = run?.output.trim().toUpperCase() ?? "";
  const outputIsValid = allowedCategories.includes(normalizedOutput);

  function choosePreset(id: LocalDemoPresetId) {
    setPresetId(id);
    setPrompt(id === demoPresets.slmClassification2.id ? demoPresets.slmClassification2.prompt : demoPresets.slmClassification1.prompt);
  }

  return (
    <section className="scene section-scene lab-demo-scene">
      <SceneHeader number="23" kicker="Demo SLM + LLM local" title="SLM — una tarea concreta" />
      <div className="lab-demo-topline"><ModeBadge mode={state.mode} /><RunStatus run={run} /></div>

      <div className="lab-demo-layout">
        <aside className="lab-model-panel" data-category="slm">
          <BrainCircuit aria-hidden />
          <span>Modelo</span><strong>{model}</strong>
          <dl><div><dt>Ubicación</dt><dd>Local</dd></div><div><dt>Tarea</dt><dd>Clasificación</dd></div></dl>
          <DemoFallback />
        </aside>

        <div className="lab-prompt-panel">
          <header><span>Prompt predefinido</span><div><button type="button" data-active={presetId === demoPresets.slmClassification1.id} onClick={() => choosePreset(demoPresets.slmClassification1.id)}>Prueba 1</button><button type="button" data-active={presetId === demoPresets.slmClassification2.id} onClick={() => choosePreset(demoPresets.slmClassification2.id)}>Prueba 2</button></div></header>
          <textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} aria-label="Prompt de clasificación" />
          <div className="lab-output"><span>Salida</span><pre>{run?.output || "La respuesta aparecerá aquí…"}</pre>{run?.status === "complete" ? <small className="lab-output-validation" data-valid={outputIsValid}>{outputIsValid ? "✓ Categoría válida" : "× Salida fuera del esquema"}</small> : null}</div>
          {run?.error ? <p className="lab-error"><CircleAlert aria-hidden />{run.error}</p> : null}
          <footer><button type="button" disabled={run?.status === "generating" || run?.status === "loading-model"} onClick={() => void runPreset(presetId, prompt)}><Play aria-hidden /> Ejecutar {presetId.endsWith("2") ? "prueba 2" : "prueba 1"}</button><button type="button" onClick={() => resetDemo("slm")}><RotateCcw aria-hidden /> Reiniciar</button></footer>
        </div>

        <aside className="lab-metrics-panel"><span>Métricas</span><MetricsGrid metrics={run?.metrics} status={run?.status} /></aside>
      </div>
    </section>
  );
}

export function SlmLiveMetricsScene() {
  const { state } = useLocalDemo();
  const run = state.runs.slm;
  const metrics = run?.metrics;
  const model = modelLabel("slm", state.mode, state.preflight.models.slm.model, run);

  return (
    <section className="scene section-scene live-metrics-scene">
      <SceneHeader number="24" kicker="Demo SLM + LLM local" title="¿Qué acaba de pasar?" />
      <div className="metrics-heading"><div><span>SLM</span><strong>{model}</strong></div><ModeBadge mode={state.mode} /></div>
      <MetricsGrid metrics={metrics} status={run?.status} />
      {metrics?.loadDurationMs !== undefined ? <div className="load-inference-split"><span>Carga del modelo <strong>{formatMilliseconds(metrics.loadDurationMs)}</strong></span><i /><span>Solicitud total <strong>{formatMilliseconds(metrics.totalDurationMs)}</strong></span></div> : null}
      <div className="slm-tradeoff-strip"><span>Complejidad <strong>Baja</strong></span><span>Perfil <strong>Pequeño</strong></span><span>Cómputo <strong>Menor</strong></span></div>
      <p className="scene-keyline compact-keyline">Para esta tarea, más capacidad <strong>no necesariamente aporta más valor.</strong></p>
    </section>
  );
}

export function SwitchToLlmScene() {
  const { state } = useLocalDemo();
  const llm = state.preflight.models.llm;
  const isReady = state.mode === "demo" || llm.loaded || llm.installed;

  return (
    <section className="scene section-scene switch-model-scene">
      <SceneHeader number="23" kicker="Demo SLM + LLM local" title="Cambiando de modelo" />
      <ModeBadge mode={state.mode} />
      <div className="model-switch-flow">
        <article data-category="slm"><span>Current</span><BrainCircuit aria-hidden /><strong>SLM</strong></article>
        <div><ArrowRight aria-hidden /><span>Switch model</span></div>
        <article data-category="llm"><span>Next</span><Sparkles aria-hidden /><strong>LLM</strong></article>
      </div>
      <div className="model-load-state" data-ready={isReady}><i />{isReady ? "LLM READY" : "LLM NOT LOADED"}<small>{llm.model || "Modelo no configurado"}</small></div>
    </section>
  );
}

export function LlmAnalysisDemoScene() {
  const { resetDemo, runPreset, state } = useLocalDemo();
  const [prompt, setPrompt] = useState<string>(demoPresets.llmAnalysis.prompt);
  const run = state.runs.llm;
  const model = modelLabel("llm", state.mode, state.preflight.models.llm.model, run);

  return (
    <section className="scene section-scene lab-demo-scene llm-demo-scene">
      <SceneHeader number="25" kicker="Demo SLM + LLM local" title="LLM — ahora el problema es diferente" />
      <div className="lab-demo-topline"><ModeBadge mode={state.mode} /><RunStatus run={run} /></div>
      <div className="lab-demo-layout">
        <aside className="lab-model-panel" data-category="llm">
          <Sparkles aria-hidden />
          <span>Modelo</span><strong>{model}</strong>
          <dl><div><dt>Ubicación</dt><dd>Local</dd></div><div><dt>Tarea</dt><dd>Análisis</dd></div></dl>
          <DemoFallback />
        </aside>
        <div className="lab-prompt-panel">
          <header><span>Prompt predefinido</span><b>Análisis estructurado</b></header>
          <textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} aria-label="Prompt de análisis" />
          <div className="lab-output"><span>Salida en streaming</span><pre>{run?.output || "La respuesta aparecerá aquí…"}{run?.status === "generating" ? <i /> : null}</pre></div>
          {run?.error ? <p className="lab-error"><CircleAlert aria-hidden />{run.error}</p> : null}
          <footer><button type="button" disabled={run?.status === "generating" || run?.status === "loading-model"} onClick={() => void runPreset(demoPresets.llmAnalysis.id, prompt)}><Play aria-hidden /> Ejecutar análisis</button><button type="button" onClick={() => resetDemo("llm")}><RotateCcw aria-hidden /> Reiniciar</button></footer>
        </div>
        <aside className="lab-metrics-panel"><span>Métricas</span><MetricsGrid metrics={run?.metrics} status={run?.status} /></aside>
      </div>
    </section>
  );
}

const comparisonRows = [
  { label: "Modelo", value: (run: LocalDemoRun | undefined, metrics: LocalInferenceMetrics | undefined) => metrics?.model ?? run?.category.toUpperCase() ?? "—" },
  { label: "Ubicación", value: () => "Local" },
  { label: "Tarea", value: (run: LocalDemoRun | undefined) => run?.task ?? "—" },
  { label: "Primer token", value: (_run: LocalDemoRun | undefined, metrics: LocalInferenceMetrics | undefined) => formatMilliseconds(metrics?.ttftMs) },
  { label: "Tokens / s", value: (_run: LocalDemoRun | undefined, metrics: LocalInferenceMetrics | undefined) => formatRate(metrics?.tokensPerSecond) },
  { label: "Tiempo total", value: (_run: LocalDemoRun | undefined, metrics: LocalInferenceMetrics | undefined) => formatMilliseconds(metrics?.totalDurationMs) },
  { label: "Tokens de salida", value: (_run: LocalDemoRun | undefined, metrics: LocalInferenceMetrics | undefined) => metrics?.generatedTokens?.toString() ?? "—" },
] as const;

export function SlmVsLlmResultsScene() {
  const { state } = useLocalDemo();
  const slm = state.runs.slm;
  const llm = state.runs.llm;

  return (
    <section className="scene section-scene comparison-scene">
      <SceneHeader number="26" kicker="Demo SLM + LLM local" title="Dos tareas, dos perfiles" />
      <ModeBadge mode={state.mode} />
      <div className="comparison-table" role="table" aria-label="Comparación de resultados">
        <div className="comparison-row comparison-header" role="row"><span /><strong data-category="slm">SLM</strong><strong data-category="llm">LLM</strong></div>
        {comparisonRows.map((row) => <div className="comparison-row" role="row" key={row.label}><span>{row.label}</span><b>{row.value(slm, slm?.metrics)}</b><b>{row.value(llm, llm?.metrics)}</b></div>)}
      </div>
      <div className="comparison-traits"><div><strong>SLM</strong><span>Tarea estructurada</span><span>Salida verificable</span><span>Menos recursos</span></div><div><strong>LLM</strong><span>Respuesta abierta</span><span>Necesita una rúbrica</span><span>Más capacidad</span></div></div>
      <p className="comparison-caveat">Las tareas y longitudes de salida son distintas. Estas cifras no forman un benchmark directo.</p>
      <div className="comparison-verdict"><span>¿Qué demuestra la demo?</span><strong>Enrutamiento.</strong><p>Elegimos el recurso según la tarea y validamos la salida con criterios distintos.</p></div>
      <div className="frontier-bridge"><span>Local SLM ✓</span><span>Local LLM ✓</span><strong>¿Y si necesito más capacidad?</strong><ArrowRight aria-hidden /></div>
    </section>
  );
}
