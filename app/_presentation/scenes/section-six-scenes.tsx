import {
  Activity,
  AppWindow,
  ArrowDown,
  ArrowRight,
  Bot,
  BrainCircuit,
  Cloud,
  Cpu,
  Gauge,
  HardDrive,
  House,
  Infinity as InfinityIcon,
  Laptop,
  Layers3,
  LockKeyhole,
  MessageCircleQuestion,
  Monitor,
  Network,
  Router,
  Server,
  Settings2,
  Sparkles,
  Wrench,
  Zap,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

import { presentationConfig } from "../presentation-config";
import { SceneHeader } from "./section-one-scenes";
import closingStyles from "./thank-you-scene.module.css";

const homeLabCapabilities = ["24/7", "Modelos", "Agentes", "Automatización", "APIs", "Datos privados", "Experimentación"] as const;

export function WhyAiHomeLabScene() {
  const evolution = [
    { icon: Laptop, label: "Laptop", note: "experimentar" },
    { icon: Monitor, label: "Desktop", note: "más capacidad" },
    { icon: Server, label: "Servidor", note: "dedicado" },
    { icon: House, label: "Home Lab", note: "infraestructura" },
  ] as const;

  return (
    <section className="scene section-scene homelab-evolution-scene">
      <SceneHeader number="32" kicker={'Home Labs + Tokens “Infinitos” + Cierre'} title="¿Por qué llevar esto a un Home Lab?" />
      <div className="homelab-evolution">
        {evolution.map(({ icon: Icon, label, note }, index) => (
          <div className="homelab-evolution-step" key={label} style={{ animationDelay: `${index * 85}ms` }}>
            <article data-final={index === evolution.length - 1}><Icon aria-hidden /><strong>{label}</strong><span>{note}</span></article>
            {index < evolution.length - 1 ? <ArrowRight aria-hidden /> : null}
          </div>
        ))}
      </div>
      <div className="homelab-capabilities">{homeLabCapabilities.map((item, index) => <span key={item} style={{ animationDelay: `${350 + index * 45}ms` }}>{item}</span>)}</div>
      <p className="scene-keyline compact-keyline">Una laptop sirve para experimentar. <strong>Un Home Lab puede convertirse en infraestructura.</strong></p>
    </section>
  );
}

const platformEdges = [
  [HardDrive, "Almacenamiento"],
  [Settings2, "Automatización"],
  [Activity, "Monitoreo"],
  [Layers3, "Virtualización"],
  [Network, "Redes"],
] as const;

export function YourAiInfrastructureScene() {
  return (
    <section className="scene section-scene ai-platform-scene">
      <SceneHeader number="33" kicker={'Home Labs + Tokens “Infinitos” + Cierre'} title="Tu propia infraestructura de IA" />
      <div className="ai-platform-layout">
        <div className="ai-platform-edge">{platformEdges.map(([Icon, label]) => <span key={label}><Icon aria-hidden />{label}</span>)}</div>
        <div className="ai-platform-shell">
          <header><House aria-hidden /><span>Home Lab</span><small>plataforma persistente</small></header>
          <article data-layer="models"><BrainCircuit aria-hidden /><div><span>Modelos</span><strong>SLM · LLM · Embeddings</strong></div></article>
          <ArrowDown aria-hidden />
          <article data-layer="services"><Bot aria-hidden /><div><span>Servicios</span><strong>APIs · RAG · Agentes</strong></div></article>
          <ArrowDown aria-hidden />
          <article data-layer="applications"><AppWindow aria-hidden /><div><span>Aplicaciones</span><strong>Experiencias reutilizables</strong></div></article>
        </div>
        <div className="ai-platform-thesis"><span>De una computadora</span><ArrowDown aria-hidden /><strong>a una capacidad<br />compartida.</strong></div>
      </div>
    </section>
  );
}

const operationLayers = [
  { icon: Network, label: "Acceso", detail: "red privada o VPN" },
  { icon: LockKeyhole, label: "Autenticación", detail: "usuarios y permisos" },
  { icon: Activity, label: "Monitoreo", detail: "salud, memoria y latencia" },
  { icon: Settings2, label: "Versionado", detail: "runtime, modelos y configuración" },
  { icon: Zap, label: "Continuidad", detail: "energía, temperatura y reinicio" },
] as const;

export function HomeLabOperationsScene() {
  return (
    <section className="scene section-scene homelab-operations-scene">
      <SceneHeader number="34" kicker={'Home Labs + Tokens “Infinitos” + Cierre'} title="De laboratorio a servicio 24/7" />

      <div className="operation-service-line">
        <div className="operation-core"><House aria-hidden /><span>Home Lab</span><strong>Servicio de IA</strong></div>
        <ArrowRight aria-hidden />
        <div className="operation-consumers"><AppWindow aria-hidden /><span>Aplicaciones</span><strong>Uso continuo</strong></div>
      </div>

      <div className="operation-layers">
        {operationLayers.map(({ icon: Icon, label, detail }, index) => (
          <article key={label} style={{ animationDelay: `${index * 60}ms` }}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <Icon aria-hidden />
            <strong>{label}</strong>
            <small>{detail}</small>
          </article>
        ))}
      </div>

      <p className="operation-rule">Una demo prueba que funciona. La operación permite confiar en el servicio.</p>
    </section>
  );
}

const infrastructureCosts = [
  [Cpu, "Hardware"],
  [Zap, "Electricidad"],
  [Wrench, "Mantenimiento"],
  [Activity, "Tiempo"],
] as const;

const localLimits = ["Contexto finito", "Velocidad finita", "Concurrencia finita", "Energía y temperatura"] as const;

export function InfiniteTokensScene() {
  return (
    <section className="scene section-scene infinite-tokens-scene">
      <SceneHeader number="35" kicker={'Home Labs + Tokens “Infinitos” + Cierre'} title="¿Tokens infinitos?" />
      <div className="infinite-token-hook"><InfinityIcon aria-hidden /><strong>Tokens</strong><span>…bueno, no exactamente.</span></div>
      <div className="token-economics">
        <article data-economy="cloud"><header><Cloud aria-hidden /><strong>Cloud</strong></header><div><span>Consumo</span><ArrowDown aria-hidden /><span>Tokens</span><ArrowDown aria-hidden /><b>Factura</b></div></article>
        <div className="economics-switch"><span>pago por uso</span><ArrowRight aria-hidden /><span>infraestructura propia</span></div>
        <article data-economy="local"><header><House aria-hidden /><strong>Local</strong></header><div><span>Consumo</span><ArrowDown aria-hidden /><span>Modelo</span><ArrowDown aria-hidden /><b>Tu hardware</b></div><em>Sin factura de API por token</em></article>
      </div>
      <div className="infrastructure-costs"><span>Costo real</span>{infrastructureCosts.map(([Icon, label]) => <b key={label}><Icon aria-hidden />{label}</b>)}</div>
      <div className="local-compute-limits"><span>Límites reales</span>{localLimits.map((limit) => <b key={limit}>{limit}</b>)}</div>
      <p>La capacidad local sigue teniendo límites físicos y operativos.</p>
    </section>
  );
}

const workloadAxes = [
  { icon: Gauge, axis: "Volumen", example: "Miles / millones de inferencias", direction: "Local puede tener sentido", tone: "local" },
  { icon: LockKeyhole, axis: "Control de datos", example: "Información sensible o regulada", direction: "Local puede tener sentido", tone: "local" },
  { icon: Activity, axis: "Latencia / offline", example: "Respuesta cercana o sin Internet", direction: "Local puede tener sentido", tone: "local" },
  { icon: Sparkles, axis: "Capacidad / escala", example: "Problemas difíciles o picos de uso", direction: "Cloud puede tener sentido", tone: "cloud" },
] as const;

export function WhenLocalMakesSenseScene() {
  return (
    <section className="scene section-scene workload-economics-scene">
      <SceneHeader number="36" kicker={'Home Labs + Tokens “Infinitos” + Cierre'} title="¿Cuándo vale la pena IA local?" />
      <div className="workload-axis-labels">{workloadAxes.map(({ axis }) => <span key={axis}>{axis}</span>)}</div>
      <div className="workload-grid">
        {workloadAxes.map(({ icon: Icon, axis, example, direction, tone }, index) => <article key={axis} style={{ animationDelay: `${index * 70}ms` }}><header><Icon aria-hidden /><strong>{axis}</strong></header><p>{example}</p><div data-tone={tone}><ArrowRight aria-hidden /><span>{direction}</span></div></article>)}
      </div>
      <p className="workload-verdict">La economía depende del <strong>workload.</strong></p>
    </section>
  );
}

const routingCriteria = ["Privacidad", "Complejidad", "Costo", "Latencia", "Disponibilidad"] as const;

export function FinalAiArchitectureScene() {
  return (
    <section className="scene section-scene final-architecture-scene">
      <SceneHeader number="37" kicker={'Home Labs + Tokens “Infinitos” + Cierre'} title="El sistema que realmente quiero construir" />
      <div className="final-architecture">
        <div className="final-request"><span>Usuario</span><strong>Aplicación</strong><ArrowRight aria-hidden /></div>
        <div className="final-router"><Router aria-hidden /><span>Router</span><strong>Según la tarea</strong><div>{routingCriteria.map((item) => <small key={item}>{item}</small>)}</div></div>
        <div className="final-home-lab">
          <header><House aria-hidden /><span>Home Lab</span></header>
          <article data-model="slm"><Cpu aria-hidden /><div><strong>SLM local</strong><span>clasificación</span></div></article>
          <article data-model="llm"><BrainCircuit aria-hidden /><div><strong>LLM local</strong><span>análisis / RAG</span></div></article>
        </div>
        <div className="final-cloud"><Cloud aria-hidden /><span>Frontier</span><strong>Cloud</strong><small>máxima capacidad</small></div>
      </div>
      <div className="final-architecture-caption"><span>Simple · privado · gran volumen</span><strong>El mejor recurso para cada tarea</strong><span>Complejo · alto valor</span></div>
    </section>
  );
}

const threeQuestions = [
  { number: "01", question: "¿Qué necesito resolver?", answer: "Tarea" },
  { number: "02", question: "¿Dónde tiene sentido ejecutarlo?", answer: "Modelo y ubicación" },
  { number: "03", question: "¿Qué infraestructura necesito?", answer: "Hardware" },
] as const;

export function ThreeQuestionsScene() {
  return (
    <section className="scene section-scene three-questions-scene">
      <SceneHeader number="38" kicker={'Home Labs + Tokens “Infinitos” + Cierre'} title="Tres preguntas antes de elegir un modelo" />
      <div className="question-sequence">{threeQuestions.map(({ number, question, answer }, index) => <article key={number} style={{ animationDelay: `${index * 170}ms` }}><span>{number}</span><MessageCircleQuestion aria-hidden /><strong>{question}</strong><small>{answer}</small></article>)}</div>
      <div className="problem-first-flow"><span>Tarea</span><ArrowRight aria-hidden /><span>Modelo</span><ArrowRight aria-hidden /><span>Ubicación</span><ArrowRight aria-hidden /><span>Hardware</span></div>
      <div className="question-contrast"><p><b>Evita</b>Tengo una GPU → ¿qué hago con ella?</p><p><b>Empieza aquí</b>Tengo un problema → ¿qué necesito para resolverlo?</p></div>
      <p className="scene-keyline compact-keyline"><strong>Problema primero.</strong> Modelo e infraestructura después.</p>
    </section>
  );
}

export function ClosingMessageScene() {
  return (
    <section className="scene section-scene closing-message-scene">
      <SceneHeader number="39" kicker={'Home Labs + Tokens “Infinitos” + Cierre'} title={'IA Local, Home Labs y Tokens “Infinitos”'} />
      <div className="closing-lines"><span>No necesitas el modelo más grande.</span><strong>Necesitas el modelo correcto.</strong><strong>En el lugar correcto.</strong><b>Para el problema correcto.</b></div>
      <div className="closing-local-cloud"><House aria-hidden /><span>Local</span><i>+</i><span>Cloud</span><Cloud aria-hidden /></div>
    </section>
  );
}

export function ThankYouQuestionsScene() {
  const { speaker } = presentationConfig;
  const instagramUrl = `https://www.instagram.com/${speaker.instagram.replace(/^@/, "")}/`;

  return (
    <section className={`scene section-scene ${closingStyles.scene}`}>
      <div className={closingStyles.main}>
        <div className={closingStyles.message}>
          <p>IA Local, Home Labs<br />y Tokens “Infinitos”</p>
          <h1>Gracias</h1>
          <strong>¿Preguntas?</strong>
        </div>
        <a className={closingStyles.qr} href={instagramUrl} target="_blank" rel="noopener noreferrer" aria-label={`Abrir Instagram de ${speaker.name}`}>
          <QRCodeSVG value={instagramUrl} size={512} level="M" marginSize={4} bgColor="#ffffff" fgColor="#000000" title={`QR de Instagram: ${speaker.instagram}`} role="img" />
          <span>Escanea y conectemos</span>
        </a>
      </div>
      <div className={closingStyles.footer}>
        <div><span>Speaker</span><strong>{speaker.name}</strong><p>{speaker.role}</p></div>
        <div><span>Conecta</span><a href={instagramUrl} target="_blank" rel="noopener noreferrer">{speaker.instagram}<ArrowRight aria-hidden /></a><p>Instagram</p></div>
      </div>
    </section>
  );
}
