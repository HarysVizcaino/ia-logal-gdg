"use client";

import {
  Activity,
  ArrowDown,
  ArrowRight,
  BrainCircuit,
  Check,
  CircleAlert,
  Cloud,
  Code2,
  Database,
  Gauge,
  Globe2,
  Laptop,
  LoaderCircle,
  LockKeyhole,
  Network,
  Play,
  RefreshCcw,
  RotateCcw,
  Router,
  Scale,
  Sparkles,
  Wrench,
  Zap,
} from "lucide-react";
import { useState } from "react";

import {
  frontierIncidentPrompt,
} from "../cloud-demo/cloud-demo-config";
import { useCloudDemo } from "../cloud-demo/cloud-demo-context";
import { CloudStreamingOutput } from "../cloud-demo/cloud-streaming-output";
import type { CloudDemoMode, CloudRunStatus } from "../cloud-demo/types";
import { SceneHeader } from "./section-one-scenes";

function formatMilliseconds(value?: number) {
  if (value === undefined) return "—";
  return value >= 1_000 ? `${(value / 1_000).toFixed(2)} s` : `${Math.round(value)} ms`;
}

function CloudModeBadge({ mode }: { readonly mode: CloudDemoMode }) {
  return (
    <span className="cloud-mode-badge" data-mode={mode}>
      <i /> {mode === "live" ? "En vivo" : "Datos de demo"}
    </span>
  );
}

const cloudRunStatusLabels: Record<CloudRunStatus, string> = {
  idle: "en espera",
  connecting: "conectando",
  generating: "generando",
  complete: "completo",
  error: "error",
};

export function NeedMoreCapabilityScene() {
  return (
    <section className="scene section-scene capability-bridge-scene">
      <SceneHeader number="27" kicker="Frontier + Local vs Cloud" title="¿Y si necesito más capacidad?" />
      <div className="capability-ladder">
        <article><Laptop aria-hidden /><span>Local</span><strong>SLM</strong><b><Check aria-hidden /> listo</b></article>
        <ArrowRight aria-hidden />
        <article><BrainCircuit aria-hidden /><span>Local</span><strong>LLM</strong><b><Check aria-hidden /> listo</b></article>
        <ArrowRight aria-hidden />
        <article className="capability-question"><Gauge aria-hidden /><span>La tarea pide</span><strong>más capacidad</strong></article>
      </div>
      <div className="frontier-arrival"><Sparkles aria-hidden /><span>Nueva opción</span><strong>Frontier model</strong><small>No reemplaza a local. Amplía la arquitectura.</small></div>
    </section>
  );
}

const frontierCapabilities = [
  [BrainCircuit, "Razonamiento avanzado"],
  [Network, "Flujos más largos"],
  [Wrench, "Uso de herramientas"],
  [Router, "Planificación"],
  [Sparkles, "Capacidad multimodal"],
  [Zap, "Alta capacidad general"],
] as const;

export function WhatMakesFrontierScene() {
  return (
    <section className="scene section-scene frontier-definition-scene">
      <SceneHeader number="28" kicker="Frontier + Local vs Cloud" title={'Frontier ≠ simplemente “más grande”'} />
      <div className="frontier-definition-layout">
        <div className="frontier-orbit"><span>Frontier</span><strong>Estado actual<br />del arte</strong><i /></div>
        <div className="frontier-capability-grid">
          {frontierCapabilities.map(([Icon, label], index) => <article key={label} style={{ animationDelay: `${index * 55}ms` }}><Icon aria-hidden /><span>{label}</span></article>)}
        </div>
      </div>
      <p className="scene-keyline compact-keyline">Capacidad de vanguardia <strong>en un momento determinado.</strong></p>
    </section>
  );
}

function PreflightItem({ ready, label }: { readonly ready: boolean; readonly label: string }) {
  return <span data-ready={ready}><b>{ready ? "✓" : "×"}</b>{label}</span>;
}

export function FrontierCloudDemoScene() {
  const { checkPreflight, resetDemo, runFrontier, setMode, state } = useCloudDemo();
  const [prompt, setPrompt] = useState(frontierIncidentPrompt);
  const { preflight, run } = state;
  const isRunning = run?.status === "connecting" || run?.status === "generating";
  const metrics = run?.metrics;

  return (
    <section className="scene section-scene cloud-demo-scene">
      <SceneHeader number="29" kicker="Frontier + Local vs Cloud" title="La misma aplicación. Otro lugar." />
      <div className="cloud-demo-topline">
        <CloudModeBadge mode={state.mode} />
        <span className="cloud-run-status" data-status={run?.status ?? "idle"}>{isRunning ? <LoaderCircle aria-hidden /> : <i />}{cloudRunStatusLabels[run?.status ?? "idle"]}</span>
      </div>

      <div className="cloud-preflight-strip">
        <span>Comprobación</span>
        <PreflightItem ready={preflight.internet} label="Internet" />
        <PreflightItem ready={preflight.providerReady} label="Proveedor cloud" />
        <PreflightItem ready={preflight.credentials} label="Credenciales" />
        <PreflightItem ready={preflight.modelConfigured} label="Modelo" />
      </div>

      <div className="cloud-demo-layout">
        <aside className="cloud-route-panel">
          <Code2 aria-hidden /><strong>Next.js</strong><ArrowDown aria-hidden />
          <Globe2 aria-hidden /><strong>Internet</strong><ArrowDown aria-hidden />
          <Cloud aria-hidden /><strong>{preflight.config.label || "Frontier API"}</strong>
          <span>Cloud</span>
        </aside>

        <div className="cloud-chat-panel">
          <header><span>Prompt frontier</span><b>{preflight.config.model || "Modelo sin configurar"}</b></header>
          <textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} aria-label="Prompt para Frontier Model" />
          <CloudStreamingOutput output={run?.output ?? ""} generating={run?.status === "generating"} />
          {run?.error ? <p className="cloud-error"><CircleAlert aria-hidden />{run.error}</p> : null}
          <footer>
            <button type="button" disabled={isRunning} onClick={() => void runFrontier(prompt)}><Play aria-hidden /> Ejecutar frontier</button>
            <button type="button" onClick={resetDemo}><RotateCcw aria-hidden /> Reiniciar</button>
            <button type="button" onClick={() => void checkPreflight()}><RefreshCcw aria-hidden /> Comprobar</button>
            <button type="button" onClick={() => setMode(state.mode === "live" ? "demo" : "live")}><Activity aria-hidden />{state.mode === "live" ? "Usar demo grabada" : "Probar en vivo"}</button>
          </footer>
        </div>

        <aside className="cloud-metrics-panel">
          <span>{state.mode === "demo" ? "Métricas de demo" : "Métricas en vivo"}</span>
          <div><small>Primer token</small><strong>{formatMilliseconds(metrics?.ttftMs)}</strong></div>
          <div><small>Tiempo total</small><strong>{formatMilliseconds(metrics?.totalDurationMs)}</strong></div>
          <div><small>Tokens de salida</small><strong>{metrics?.generatedTokens ?? "—"}</strong></div>
          <div><small>Ubicación</small><strong>Cloud</strong></div>
          {metrics?.estimatedCost !== undefined ? <div><small>Costo estimado de API</small><strong>${metrics.estimatedCost.toFixed(5)}</strong></div> : null}
        </aside>
      </div>
    </section>
  );
}

const tradeoffs = {
  local: ["Hardware propio", "Control", "Offline posible", "Sin cobro por token", "Recursos limitados", "Mantenimiento propio"],
  cloud: ["Hardware del proveedor", "Mayor capacidad disponible", "Internet requerido", "Pago por uso", "Escala bajo demanda", "Infraestructura administrada"],
} as const;

export function LocalVsCloudScene() {
  return (
    <section className="scene section-scene tradeoff-scene">
      <SceneHeader number="29" kicker="Frontier + Local vs Cloud" title="La capacidad tiene un costo diferente" />
      <div className="tradeoff-columns">
        <article data-location="local"><header><Laptop aria-hidden /><div><span>Location</span><strong>Local</strong></div></header><ul>{tradeoffs.local.map((item) => <li key={item}><Check aria-hidden />{item}</li>)}</ul></article>
        <div className="tradeoff-scale"><Scale aria-hidden /><span>Trade-offs</span></div>
        <article data-location="cloud"><header><Cloud aria-hidden /><div><span>Location</span><strong>Cloud</strong></div></header><ul>{tradeoffs.cloud.map((item) => <li key={item}><Check aria-hidden />{item}</li>)}</ul></article>
      </div>
      <p className="cost-reframe">No estás eliminando el costo. <strong>Estás cambiando dónde ocurre.</strong></p>
    </section>
  );
}

const decisionCases = [
  { icon: Database, task: "Clasificar 100,000 documentos privados", answer: "Local", note: "privacidad + volumen + tarea predecible", tone: "local" },
  { icon: Code2, task: "Crear una landing page", answer: "Depende", note: "local o cloud", tone: "depends" },
  { icon: Wrench, task: "Investigar un incidente complejo con herramientas", answer: "Frontier cloud", note: "complejidad + herramientas + alto valor", tone: "cloud" },
  { icon: LockKeyhole, task: "Resumir documentos internos sensibles", answer: "Local", note: "contexto sensible + control", tone: "local" },
] as const;

export function WhichWouldYouUseScene() {
  const [revealed, setRevealed] = useState(false);
  return (
    <section className="scene section-scene decision-scene">
      <SceneHeader number="30" kicker="Frontier + Local vs Cloud" title="¿Local o Cloud?" />
      <div className="decision-question"><span>Pregunta a la audiencia</span><strong>¿Qué usarían aquí?</strong><button type="button" onClick={() => setRevealed((value) => !value)}>{revealed ? "Ocultar criterios" : "Revelar criterios"}</button></div>
      <div className="decision-grid" data-revealed={revealed}>
        {decisionCases.map(({ icon: Icon, task, answer, note, tone }, index) => <article key={task} style={{ animationDelay: `${index * 70}ms` }}><Icon aria-hidden /><p>{task}</p><div data-tone={tone}><strong>{revealed ? answer : "?"}</strong><span>{revealed ? note : "decisión contextual"}</span></div></article>)}
      </div>
      <p className="decision-caveat">Ejemplos, no reglas universales · privacidad · costo · latencia · volumen · complejidad</p>
    </section>
  );
}

const privacyChecks = [
  { label: "Telemetría", detail: "¿Qué envía la aplicación?", icon: Activity },
  { label: "Logs y backups", detail: "¿Dónde quedan los prompts?", icon: Database },
  { label: "API y red", detail: "¿Quién puede conectarse?", icon: Network },
  { label: "Permisos", detail: "¿Qué puede leer o ejecutar?", icon: LockKeyhole },
] as const;

export function LocalPrivacySecurityScene() {
  return (
    <section className="scene section-scene local-privacy-scene">
      <SceneHeader number="31" kicker="Frontier + Local vs Cloud" title="La privacidad depende del sistema completo" />

      <div className="privacy-boundary-layout">
        <article className="privacy-local-path">
          <header><LockKeyhole aria-hidden /><span>Dentro de tu infraestructura</span></header>
          <div><Code2 aria-hidden /><strong>Aplicación</strong></div>
          <ArrowDown aria-hidden />
          <div><Router aria-hidden /><strong>API local</strong></div>
          <ArrowDown aria-hidden />
          <div><BrainCircuit aria-hidden /><strong>Modelo</strong></div>
        </article>

        <div className="privacy-checks">
          {privacyChecks.map(({ label, detail, icon: Icon }, index) => (
            <article key={label} style={{ animationDelay: `${index * 70}ms` }}>
              <Icon aria-hidden />
              <div><strong>{label}</strong><span>{detail}</span></div>
            </article>
          ))}
        </div>
      </div>

      <div className="privacy-rule"><Check aria-hidden /><span>Local aporta control.</span><strong>La configuración determina la privacidad.</strong></div>
      <p className="privacy-warning">No expongas una API de inferencia directamente a Internet. Añade autenticación y controles de red.</p>
    </section>
  );
}

export function HybridRoutingScene() {
  return (
    <section className="scene section-scene hybrid-routing-scene">
      <SceneHeader number="31" kicker="Frontier + Local vs Cloud" title="Local + Cloud" />
      <div className="hybrid-routing-layout">
        <div className="routing-source"><span>Task</span><strong>User request</strong><ArrowRight aria-hidden /></div>
        <div className="routing-router"><Router aria-hidden /><span>Router</span><strong>¿Dónde aporta más valor?</strong><div><small>privacy?</small><small>complexity?</small><small>cost?</small><small>latency?</small></div></div>
        <div className="routing-destinations">
          <article data-route="slm"><Laptop aria-hidden /><div><span>Simple · private · high-volume</span><strong>SLM local</strong></div></article>
          <article data-route="llm"><BrainCircuit aria-hidden /><div><span>General · controlled · flexible</span><strong>LLM local</strong></div></article>
          <article data-route="cloud"><Cloud aria-hidden /><div><span>Complex · high-value · frontier capability</span><strong>Frontier cloud</strong></div></article>
        </div>
      </div>
      <p className="routing-note">El routing puede ser una decisión humana, una regla o parte de un sistema automatizado.</p>
    </section>
  );
}

export function ModelsAsInfrastructureScene() {
  return (
    <section className="scene section-scene infrastructure-close-scene">
      <SceneHeader number="32" kicker="Frontier + Local vs Cloud" title="Usa la IA como infraestructura" />
      <div className="resource-models"><article><span>01</span><strong>SLM</strong><small>focused resource</small></article><article><span>02</span><strong>LLM</strong><small>general resource</small></article><article><span>03</span><strong>Frontier</strong><small>maximum capability</small></article></div>
      <div className="resource-reframe"><span>Not competitors.</span><strong>Resources.</strong></div>
      <p>El modelo correcto, en el lugar correcto, <strong>para el problema correcto.</strong></p>
      <div className="homelab-next"><span>Siguiente · Home Lab + Tokens “Infinitos”</span><strong>¿Qué pasa cuando convierto mi infraestructura en una plataforma de IA?</strong><ArrowRight aria-hidden /></div>
    </section>
  );
}
