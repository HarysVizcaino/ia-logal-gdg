import {
  AppWindow,
  ArrowDown,
  ArrowRight,
  Box,
  BrainCircuit,
  Braces,
  CheckCircle2,
  CloudDownload,
  Code2,
  Cpu,
  Database,
  FileBox,
  Gauge,
  Laptop,
  Network,
  PackageOpen,
  Radio,
  Server,
  Workflow,
} from "lucide-react";

import { SceneHeader } from "./section-one-scenes";

const softwareLayers = [
  { label: "Modelo", examples: "Qwen · Gemma · Llama", icon: BrainCircuit, tone: "cyan" },
  { label: "Runtime", examples: "Ollama · llama.cpp", icon: Cpu, tone: "violet" },
  { label: "Interfaz / API", examples: "Terminal · HTTP · UI", icon: Braces, tone: "gold" },
  { label: "Aplicación", examples: "Tu producto", icon: AppWindow, tone: "green" },
] as const;

export function ModelRuntimeApplicationScene() {
  return (
    <section className="scene section-scene software-layers-scene">
      <SceneHeader number="16" kicker="Ecosistema local" title="Un modelo por sí solo no hace nada" />

      <div className="software-stack-flow">
        {softwareLayers.map((layer, index) => {
          const Icon = layer.icon;
          return (
            <div className="software-layer-fragment" key={layer.label}>
              <article data-tone={layer.tone}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <Icon aria-hidden />
                <h2>{layer.label}</h2>
                <p>{layer.examples}</p>
              </article>
              {index < softwareLayers.length - 1 ? <ArrowRight aria-hidden /> : null}
            </div>
          );
        })}
      </div>

      <div className="runtime-responsibilities">
        <span>El runtime</span>
        <strong>Carga pesos</strong><i />
        <strong>Administra memoria</strong><i />
        <strong>Ejecuta inferencia</strong>
      </div>

      <p className="scene-keyline compact-keyline">Modelo, runtime e interfaz son <strong>cosas diferentes.</strong></p>
    </section>
  );
}

const openWeightModels = ["Qwen", "Gemma", "Llama", "Mistral", "DeepSeek"];

export function OpenWeightModelsScene() {
  return (
    <section className="scene section-scene open-weight-scene">
      <SceneHeader number="17" kicker="Ecosistema local" title="¿De dónde salen los modelos locales?" />

      <div className="open-weight-layout">
        <div className="model-name-cloud" aria-label="Ejemplos de familias de modelos">
          {openWeightModels.map((model, index) => (
            <span key={model} data-index={String(index + 1).padStart(2, "0")}>{model}</span>
          ))}
          <i>…</i>
        </div>

        <div className="weight-transfer">
          <article><FileBox aria-hidden /><strong>Model weights</strong><span>pesos disponibles</span></article>
          <ArrowRight aria-hidden />
          <article><CloudDownload aria-hidden /><strong>Download</strong><span>según licencia</span></article>
          <ArrowRight aria-hidden />
          <article><Laptop aria-hidden /><strong>Your hardware</strong><span>inferencia local</span></article>
        </div>
      </div>

      <div className="open-weight-definition">
        <div><PackageOpen aria-hidden /><strong>Open-weight models</strong></div>
        <p>Los pesos pueden estar disponibles, pero <span>las licencias y el nivel de apertura varían.</span></p>
      </div>
    </section>
  );
}

const lifecycleSteps = [
  { label: "Descargar", detail: "Internet · una vez", icon: CloudDownload, tone: "gold" },
  { label: "Guardar", detail: "Disco", icon: FileBox, tone: "violet" },
  { label: "Cargar", detail: "RAM / VRAM", icon: Database, tone: "cyan" },
  { label: "Inferir", detail: "Primer token", icon: BrainCircuit, tone: "green" },
  { label: "Mantener", detail: "keep alive / unload", icon: Cpu, tone: "muted" },
] as const;

export function ModelLifecycleScene() {
  return (
    <section className="scene section-scene model-lifecycle-scene">
      <SceneHeader number="18" kicker="Ecosistema local" title="Del disco al primer token" />

      <div className="model-lifecycle-flow">
        {lifecycleSteps.map(({ label, detail, icon: Icon, tone }, index) => (
          <div className="lifecycle-fragment" key={label}>
            <article data-tone={tone}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <Icon aria-hidden />
              <strong>{label}</strong>
              <small>{detail}</small>
            </article>
            {index < lifecycleSteps.length - 1 ? <ArrowRight aria-hidden /> : null}
          </div>
        ))}
      </div>

      <div className="lifecycle-runtime-rule">
        <article><Radio aria-hidden /><div><span>Servicio Ollama</span><strong>Debe estar activo</strong></div></article>
        <b>+</b>
        <article><PackageOpen aria-hidden /><div><span>Modelo instalado</span><strong>Ollama puede cargarlo al hacer Run</strong></div></article>
      </div>
      <p className="lifecycle-cold-start">La primera llamada puede incluir el tiempo de carga. Las siguientes pueden ser más rápidas mientras el modelo permanezca en memoria.</p>
    </section>
  );
}

const runtimeFacts = [
  { title: "llama.cpp", subtitle: "Inference engine", items: ["Hardware local", "Control de bajo nivel", "Ecosistema GGUF"], icon: Gauge, tone: "cyan" },
  { title: "Ollama", subtitle: "Developer experience", items: ["Gestión de modelos", "Comandos simples", "API local"], icon: Box, tone: "violet" },
] as const;

export function LlamaCppOllamaScene() {
  return (
    <section className="scene section-scene runtime-scene">
      <SceneHeader number="19" kicker="Ecosistema local" title="¿Quién ejecuta el modelo?" />

      <div className="runtime-layout">
        <div className="local-ai-stack">
          <span>Pila de IA local</span>
          <article data-layer="experience"><Box aria-hidden /><div><strong>Ollama</strong><small>Modelos · API · UX</small></div></article>
          <ArrowDown aria-hidden />
          <article data-layer="engine"><Cpu aria-hidden /><div><strong>Inference engine</strong><small>llama.cpp / otros</small></div></article>
          <ArrowDown aria-hidden />
          <article data-layer="hardware"><Laptop aria-hidden /><div><strong>Hardware</strong><small>CPU · GPU · memoria</small></div></article>
        </div>

        <div className="runtime-facts">
          {runtimeFacts.map((fact) => {
            const Icon = fact.icon;
            return (
              <article data-tone={fact.tone} key={fact.title}>
                <div><Icon aria-hidden /><span>{fact.subtitle}</span></div>
                <h2>{fact.title}</h2>
                <ul>{fact.items.map((item) => <li key={item}>{item}</li>)}</ul>
              </article>
            );
          })}
          <code><span>$</span> ollama run &lt;model&gt;</code>
        </div>
      </div>

      <p className="runtime-not-equivalent"><strong>Ollama</strong> simplifica la experiencia; no es equivalente de forma rígida a <strong>llama.cpp</strong>.</p>
    </section>
  );
}

export function LocalAiTerminalScene() {
  return (
    <section className="scene section-scene local-terminal-scene">
      <SceneHeader number="20" kicker="Ecosistema local" title="De cero a IA local" />

      <div className="demo-mode-badge"><Radio aria-hidden /><span>Demo data</span></div>

      <div className="terminal-layout">
        <article className="terminal-window" aria-label="Terminal simulada">
          <header><i /><i /><i /><span>local-ai — zsh</span><b>SIMULACIÓN</b></header>
          <div className="terminal-body">
            <p><span>$</span> ollama list</p>
            <div className="terminal-table"><strong>NAME</strong><strong>SIZE</strong><span>&lt;local-model&gt;</span><span>…</span></div>
            <p><span>$</span> ollama run &lt;model&gt;</p>
            <p className="terminal-prompt"><span>&gt;&gt;&gt;</span> Explícame qué es un Home Lab en una oración.</p>
            <p className="terminal-response">Un Home Lab es un entorno de computación personal para aprender, experimentar y ejecutar servicios propios.<i aria-hidden /></p>
          </div>
        </article>

        <aside className="terminal-status">
          <span>Estado de sesión</span>
          <dl>
            <div><dt>Modelo</dt><dd>Local</dd></div>
            <div><dt>Ubicación</dt><dd>Esta Mac</dd></div>
            <div><dt>Internet</dt><dd>No requerido*</dd></div>
            <div><dt>Costo de API</dt><dd>$0 por llamada</dd></div>
          </dl>
          <small>*Después de descargar los archivos requeridos. El hardware y la energía sí tienen costo.</small>
        </aside>
      </div>
    </section>
  );
}

const apiConsumers = [
  { label: "Tu app", icon: AppWindow },
  { label: "Tu agente", icon: Workflow },
  { label: "Tu automatización", icon: Code2 },
  { label: "Tu RAG", icon: Database },
] as const;

export function LocalModelApiScene() {
  const apiSteps = [
    { label: "Next.js app", icon: AppWindow },
    { label: "HTTP", icon: Network },
    { label: "Ollama API", icon: Server },
    { label: "Local model", icon: BrainCircuit },
    { label: "Mac M4", icon: Laptop },
  ] as const;

  return (
    <section className="scene section-scene local-api-scene">
      <SceneHeader number="21" kicker="Ecosistema local" title="El modelo también puede ser una API" />

      <div className="api-address"><span>Local endpoint</span><code>http://localhost:11434</code><b><i /> DEMO MODE</b></div>

      <div className="api-pipeline" aria-label="Flujo conceptual de una API local">
        {apiSteps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div className="api-step-fragment" key={step.label}>
              <article><Icon aria-hidden /><strong>{step.label}</strong></article>
              {index < apiSteps.length - 1 ? <ArrowRight aria-hidden /> : null}
            </div>
          );
        })}
      </div>

      <div className="api-consumers">
        {apiConsumers.map(({ label, icon: Icon }) => <span key={label}><Icon aria-hidden />{label}</span>)}
        <ArrowRight aria-hidden />
        <strong><BrainCircuit aria-hidden /> Local model</strong>
      </div>

      <div className="api-final-reveal">
        <CheckCircle2 aria-hidden />
        <p>Esta presentación puede hablar con el modelo que corre en esta Mac.</p>
      </div>

      <div className="demo-bridge"><span>Siguiente</span><strong>Demo — SLM vs LLM local</strong><ArrowRight aria-hidden /></div>
    </section>
  );
}
