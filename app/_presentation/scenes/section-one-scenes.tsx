import {
  ArrowRight,
  Bot,
  BrainCircuit,
  Building2,
  Cloud,
  Cpu,
  FileStack,
  Gauge,
  HardDrive,
  Laptop,
  MessageSquareText,
  Monitor,
  Network,
  Route,
  Server,
  Sparkles,
  Tags,
  UserRound,
  Wifi,
  Wrench,
} from "lucide-react";
import type { ComponentType } from "react";
import hybridStyles from "./hybrid-scene.module.css";

type Icon = ComponentType<{ readonly "aria-hidden"?: boolean }>;

interface SceneHeaderProps {
  readonly number: string;
  readonly title: string;
  readonly kicker?: string;
}

export function SceneHeader({ number, title, kicker }: SceneHeaderProps) {
  const displayNumber = String(Number.parseInt(number, 10) + 1).padStart(2, "0");

  return (
    <header className="section-scene-header">
      <p>
        <span>{displayNumber}</span>
        {kicker ?? "Qué es IA local"}
      </p>
      <h1>{title}</h1>
    </header>
  );
}

interface FlowNodeProps {
  readonly icon: Icon;
  readonly label: string;
  readonly detail?: string;
  readonly emphasis?: boolean;
}

function FlowNode({ icon: IconComponent, label, detail, emphasis }: FlowNodeProps) {
  return (
    <div className="flow-node" data-emphasis={emphasis || undefined}>
      <IconComponent aria-hidden />
      <span>{label}</span>
      {detail ? <small>{detail}</small> : null}
    </div>
  );
}

function FlowArrow() {
  return (
    <span className="flow-arrow" aria-hidden>
      <i />
      <ArrowRight />
    </span>
  );
}

export function WhereAiLivesScene() {
  return (
    <section className="scene section-scene architecture-scene">
      <SceneHeader
        number="01"
        title="¿Dónde vive la IA que usamos todos los días?"
      />

      <div className="architecture-comparison">
        <article className="architecture-lane architecture-cloud">
          <div className="architecture-label">
            <Cloud aria-hidden />
            <div>
              <strong>Cloud</strong>
              <span>Ruta remota</span>
            </div>
          </div>
          <div className="architecture-flow">
            <FlowNode icon={UserRound} label="Tú" />
            <FlowArrow />
            <FlowNode icon={Wifi} label="Internet" />
            <FlowArrow />
            <FlowNode icon={Building2} label="Proveedor" />
            <FlowArrow />
            <FlowNode icon={Server} label="Datacenter" />
            <FlowArrow />
            <FlowNode icon={BrainCircuit} label="Modelo" emphasis />
            <FlowArrow />
            <FlowNode icon={MessageSquareText} label="Respuesta" />
          </div>
        </article>

        <article className="architecture-lane architecture-local">
          <div className="architecture-label">
            <Laptop aria-hidden />
            <div>
              <strong>Local</strong>
              <span>Ruta corta</span>
            </div>
          </div>
          <div className="architecture-flow architecture-flow-short">
            <FlowNode icon={UserRound} label="Tú" />
            <FlowArrow />
            <FlowNode icon={Laptop} label="Tu computadora" />
            <FlowArrow />
            <FlowNode icon={BrainCircuit} label="Modelo" emphasis />
            <FlowArrow />
            <FlowNode icon={MessageSquareText} label="Respuesta" />
          </div>
        </article>
      </div>

      <p className="scene-keyline">
        Usar IA <strong>no significa</strong> ejecutarla localmente.
      </p>
    </section>
  );
}

const hardwareOptions = [
  { label: "Laptop", icon: Laptop },
  { label: "Desktop", icon: Monitor },
  { label: "Workstation", icon: Cpu },
  { label: "Servidor", icon: Server },
  { label: "Home Lab", icon: Network },
  { label: "Edge Device", icon: HardDrive },
] as const;

export function LocalAiDefinitionScene() {
  return (
    <section className="scene section-scene definition-scene">
      <SceneHeader number="02" title="¿Qué significa IA local?" />

      <blockquote className="local-definition">
        Ejecutar el modelo en hardware que <strong>tú controlas.</strong>
      </blockquote>

      <div className="hardware-options" aria-label="Hardware posible">
        {hardwareOptions.map(({ label, icon: IconComponent }) => (
          <div className="hardware-option" key={label}>
            <IconComponent aria-hidden />
            <span>{label}</span>
          </div>
        ))}
      </div>

      <div className="local-formula" aria-label="Modelo más inferencia más datos">
        <span>Modelo</span>
        <b>+</b>
        <span>Inferencia</span>
        <b>+</b>
        <span>Datos</span>
        <ArrowRight aria-hidden />
        <strong>Tu infraestructura</strong>
      </div>

      <div className="definition-footnotes">
        <span>No necesitas un datacenter.</span>
        <span>Home Lab es una opción, no un requisito.</span>
        <span>Hoy: modelos generativos de lenguaje.</span>
      </div>
    </section>
  );
}

const modelAxes = [
  {
    label: "Escala",
    left: "Pequeño",
    right: "Grande",
    detail: "memoria y cómputo",
    icon: Gauge,
    tone: "cyan",
  },
  {
    label: "Enfoque",
    left: "Generalista",
    right: "Especializado",
    detail: "datos y objetivo de entrenamiento",
    icon: Tags,
    tone: "violet",
  },
  {
    label: "Capacidad",
    left: "Establecido",
    right: "Frontier",
    detail: "estado de la capacidad actual",
    icon: Sparkles,
    tone: "gold",
  },
  {
    label: "Ubicación",
    left: "Local",
    right: "Cloud",
    detail: "dónde ocurre la inferencia",
    icon: Cloud,
    tone: "green",
  },
] as const;

export function ModelFamiliesScene() {
  return (
    <section className="scene section-scene model-axes-scene">
      <SceneHeader number="03" title="Cuatro ejes para describir un modelo" />

      <div className="model-axes-layout">
        <div className="model-axes-center">
          <BrainCircuit aria-hidden />
          <span>Un modelo</span>
          <strong>puede ocupar cualquier punto</strong>
        </div>
        <div className="model-axis-list">
          {modelAxes.map(({ label, left, right, detail, icon: IconComponent, tone }) => (
            <article data-tone={tone} key={label}>
              <IconComponent aria-hidden />
              <div className="model-axis-copy"><strong>{label}</strong><span>{detail}</span></div>
              <div className="model-axis-scale"><b>{left}</b><i /><b>{right}</b></div>
            </article>
          ))}
        </div>
      </div>

      <p className="model-axis-note">
        Un modelo pequeño puede ser generalista. Un modelo especializado también puede ser grande.
      </p>
    </section>
  );
}

const useProfiles = [
  {
    acronym: "SLM",
    role: "Especialista",
    icon: Tags,
    tone: "cyan",
    items: ["Clasificar", "Extraer", "Etiquetar", "Routing"],
    example: '“No puedo iniciar sesión” → ACCOUNT_SUPPORT',
  },
  {
    acronym: "LLM",
    role: "Generalista",
    icon: MessageSquareText,
    tone: "violet",
    items: ["Conversar", "Analizar", "Resumir", "Programar", "Sintetizar"],
    example: "Billing + tickets + configuración → respuesta",
  },
  {
    acronym: "FRONTIER",
    role: "Máxima capacidad",
    icon: Bot,
    tone: "gold",
    items: ["Razonamiento complejo", "Planificación", "Agentes", "Tool use", "Problemas difíciles"],
    example: "Observar → razonar → actuar → evaluar",
  },
] as const;

export function SpecialistGeneralistFrontierScene() {
  return (
    <section className="scene section-scene use-cases-scene">
      <SceneHeader number="04" title="¿Para qué sirve cada uno?" />

      <div className="model-use-grid">
        {useProfiles.map((profile) => {
          const IconComponent = profile.icon;
          return (
            <article className="model-use-card" data-tone={profile.tone} key={profile.acronym}>
              <div className="model-use-heading">
                <span><IconComponent aria-hidden /></span>
                <div>
                  <small>{profile.acronym}</small>
                  <h2>{profile.role}</h2>
                </div>
              </div>
              <ul>
                {profile.items.map((item) => <li key={item}>{item}</li>)}
              </ul>
              <p>{profile.example}</p>
            </article>
          );
        })}
      </div>

      <p className="scene-keyline compact-keyline">
        Diferentes modelos para <strong>diferentes trabajos.</strong>
      </p>
    </section>
  );
}

const taskCases = [
  {
    number: "01",
    icon: FileStack,
    problem: "50,000 documentos",
    action: "Clasificar y enrutar",
    model: "SLM",
    tone: "cyan",
    badges: ["RÁPIDO", "APTO PARA LOCAL", "MENOR COSTO"],
  },
  {
    number: "02",
    icon: MessageSquareText,
    problem: "Asistente de soporte",
    action: "Billing + tickets + configuración",
    model: "LLM",
    tone: "violet",
    badges: ["GENERALIZACIÓN", "CONTEXTO", "MATICES"],
  },
  {
    number: "03",
    icon: Wrench,
    problem: "Incidente de producción",
    action: "Investigar + planificar + herramientas",
    model: "FRONTIER",
    tone: "gold",
    badges: ["RAZONAMIENTO", "VARIOS PASOS", "HERRAMIENTAS"],
  },
] as const;

export function RightModelForTaskScene() {
  return (
    <section className="scene section-scene right-model-scene">
      <SceneHeader number="04" title="Más grande ≠ mejor para todo" />
      <p className="right-model-thesis">Usa la capacidad que realmente necesita el problema.</p>

      <div className="task-case-grid">
        {taskCases.map((task) => {
          const IconComponent = task.icon;
          return (
            <article className="task-case" data-tone={task.tone} key={task.number}>
              <div className="task-case-number">CASO {task.number}</div>
              <IconComponent aria-hidden />
              <h2>{task.problem}</h2>
              <span className="task-action">{task.action}</span>
              <ArrowRight className="task-arrow" aria-hidden />
              <strong>{task.model}</strong>
              <div className="task-badges">
                {task.badges.map((badge) => <span key={badge}>{badge}</span>)}
              </div>
            </article>
          );
        })}
      </div>

      <p className="scene-keyline compact-keyline">
        El modelo correcto para <strong>la tarea correcta.</strong>
      </p>
    </section>
  );
}

export function LocalCloudHybridScene() {
  return (
    <section className={`scene section-scene ${hybridStyles.scene}`}>
      <SceneHeader number="05" title="Local + Cloud" />
      <p className={hybridStyles.intro}>
        Una misma aplicación puede usar modelos locales y remotos.
      </p>

      <div className={hybridStyles.flow} aria-label="La petición llega a una aplicación que elige entre ejecución local y cloud">
        <h2 className={hybridStyles.requestHeading}><span>01</span> Tu petición</h2>
        <h2 className={hybridStyles.decisionHeading}><span>02</span> Tu aplicación decide</h2>
        <h2 className={hybridStyles.destinationHeading}><span>03</span> Dónde se ejecuta</h2>

        <div className={hybridStyles.request}>
          <MessageSquareText aria-hidden />
          <blockquote>“Ayúdame con<br />este ticket”</blockquote>
          <p>Una sola entrada</p>
        </div>

        <ArrowRight className={hybridStyles.incomingArrow} aria-hidden />

        <div className={hybridStyles.decision}>
          <Route aria-hidden />
          <strong>¿Qué necesita<br />esta tarea?</strong>
          <ul>
            <li>Capacidad del modelo</li>
            <li>Datos que puede enviar</li>
            <li>Recursos disponibles</li>
          </ul>
          <p>Router = selector de ruta</p>
        </div>

        <div className={hybridStyles.branch} aria-hidden>
          <i /><i />
        </div>

        <div className={hybridStyles.destinations}>
          <article className={hybridStyles.local}>
            <header><Laptop aria-hidden /><h3>Local</h3><span>Tu hardware</span></header>
            <p className={hybridStyles.example}>Clasificar el ticket</p>
            <p className={hybridStyles.model}>SLM o LLM en tu equipo</p>
            <p className={hybridStyles.benefit}>Control de la ejecución y del hardware</p>
          </article>
          <article className={hybridStyles.cloud}>
            <header><Cloud aria-hidden /><h3>Cloud</h3><span>Proveedor remoto</span></header>
            <p className={hybridStyles.example}>Investigar un caso difícil</p>
            <p className={hybridStyles.model}>Modelo remoto, por ejemplo, frontier</p>
            <p className={hybridStyles.benefit}>Capacidad bajo demanda · requiere Internet</p>
          </article>
        </div>
      </div>

      <footer className={hybridStyles.takeaway}>
        <strong>Una aplicación. La ruta adecuada para cada tarea.</strong>
        <p>Ejemplo de arquitectura: el tamaño del modelo no determina dónde se ejecuta.</p>
      </footer>
    </section>
  );
}
