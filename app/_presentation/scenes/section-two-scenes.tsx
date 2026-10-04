import {
  ArrowDown,
  ArrowRight,
  Binary,
  BrainCircuit,
  Braces,
  Check,
  Cpu,
  Database,
  Gauge,
  HardDrive,
  Laptop,
  Layers3,
  MessageSquareText,
  Monitor,
  ScanText,
  Sparkles,
  TriangleAlert,
  Workflow,
  Zap,
} from "lucide-react";

import { SceneHeader } from "./section-one-scenes";

function Connector() {
  return <ArrowRight className="s2-connector" aria-hidden />;
}

export function InferenceScene() {
  const steps = [
    { label: "Prompt", detail: "entrada", icon: MessageSquareText },
    { label: "Tokens", detail: "secuencia", icon: Braces },
    { label: "Modelo", detail: "inferencia", icon: BrainCircuit },
    { label: "Siguiente token", detail: "predicción", icon: Sparkles },
    { label: "Respuesta", detail: "salida", icon: ScanText },
  ] as const;
  const visibleTokens = [
    { text: "La", id: "1842", kind: "context" },
    { text: "capital", id: "7361", kind: "context" },
    { text: "de", id: "315", kind: "context" },
    { text: "Rep", id: "9284", kind: "context" },
    { text: "ública", id: "15067", kind: "context" },
    { text: "Dominicana", id: "22109", kind: "context" },
    { text: "es", id: "374", kind: "context" },
    { text: "Santo", id: "48291", kind: "prediction" },
    { text: "Domingo", id: "17382", kind: "prediction" },
  ] as const;

  return (
    <section className="scene section-scene inference-scene">
      <SceneHeader
        number="06"
        kicker="Qué necesita un modelo para correr"
        title="¿Qué ocurre después de enviar un prompt?"
      />

      <div className="inference-flow" aria-label="Flujo conceptual de inferencia">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div className="inference-flow-fragment" key={step.label}>
              <article data-active={index === 2 || undefined}>
                <Icon aria-hidden />
                <strong>{step.label}</strong>
                <span>{step.detail}</span>
              </article>
              {index < steps.length - 1 ? <Connector /> : null}
            </div>
          );
        })}
      </div>

      <button
        type="button"
        className="token-vision-demo"
        aria-label="Demostración interactiva: el texto se representa como IDs numéricos de tokens"
        title="Pasa el cursor o haz clic para ver los IDs de tokens"
      >
        <span className="token-vision-topline" aria-hidden>
          <span className="token-vision-mode">
            <b className="token-vision-human-label">Vista humana · texto</b>
            <b className="token-vision-model-label">Vista del modelo · IDs</b>
          </span>
          <small>Pasa el cursor o haz clic</small>
        </span>

        <span className="token-vision-sequence" aria-hidden>
          {visibleTokens.map((token, index) => (
            <span className="token-vision-fragment" data-kind={token.kind} key={`${token.text}-${token.id}`}>
              {index === 7 ? <ArrowRight className="token-prediction-arrow" /> : null}
              <span className="token-vision-text">{token.text}</span>
              <span className="token-vision-id">{token.id}</span>
            </span>
          ))}
        </span>

        <span className="token-vision-legend" aria-hidden>
          <span><i data-kind="context" />prompt convertido en tokens</span>
          <span><i data-kind="prediction" />tokens generados</span>
          <small>IDs ilustrativos · cambian según el tokenizer</small>
        </span>
      </button>

      <p className="scene-keyline compact-keyline">
        Inferencia = <strong>ejecutar el modelo para generar una salida.</strong>
      </p>
    </section>
  );
}

export function TokensScene() {
  return (
    <section className="scene section-scene tokens-scene">
      <SceneHeader
        number="07"
        kicker="Qué necesita un modelo para correr"
        title="Primero: los tokens"
      />

      <div className="token-source">“Inteligencia artificial local”</div>
      <ArrowDown className="token-down" aria-hidden />
      <div className="token-chips" aria-label="Ejemplo conceptual de tokens">
        <span data-index="01">Inteligencia</span>
        <span data-index="02">·artificial</span>
        <span data-index="03">·local</span>
      </div>

      <div className="token-rule">
        <strong>Token</strong>
        <span>≠</span>
        <strong>palabra</strong>
        <small>necesariamente</small>
      </div>

      <div className="token-example">
        <span>HomeLab</span>
        <ArrowRight aria-hidden />
        <b>[Home]</b>
        <b>[Lab]</b>
        <small>Ejemplo educativo · depende del tokenizer</small>
      </div>
    </section>
  );
}

export function ParametersScene() {
  const sizes = ["3B", "8B", "14B", "70B"];

  return (
    <section className="scene section-scene parameters-scene">
      <SceneHeader
        number="08"
        kicker="Qué necesita un modelo para correr"
        title="¿Qué significa 3B, 8B o 70B?"
      />

      <div className="parameter-scale" aria-label="Ejemplos de tamaños de modelos">
        {sizes.map((size) => <span key={size}>{size}</span>)}
      </div>
      <p className="billions-definition"><strong>B</strong> = billions of parameters</p>

      <div className="parameter-concept">
        <div><Workflow aria-hidden /><span>Entrenamiento</span></div>
        <Connector />
        <div className="learned-values">
          <Binary aria-hidden />
          <strong>Parámetros</strong>
          <span>Valores numéricos aprendidos</span>
          <small>También los llamaremos <b>“pesos”</b></small>
        </div>
        <Connector />
        <div><BrainCircuit aria-hidden /><span>Modelo</span></div>
      </div>

      <div className="parameter-truths">
        <p><span>Más parámetros</span><b>≠</b><strong>siempre mejor</strong></p>
        <p><span>Más parámetros</span><ArrowRight aria-hidden /><strong>generalmente más memoria + cómputo</strong></p>
      </div>
    </section>
  );
}

const modelWorkModes = [
  { label: "Entrenamiento", detail: "crea los pesos", icon: Workflow, tone: "gold" },
  { label: "Fine-tuning", detail: "adapta los pesos", icon: Binary, tone: "violet" },
  { label: "RAG", detail: "añade contexto externo", icon: Database, tone: "cyan" },
  { label: "Inferencia", detail: "genera una salida", icon: Sparkles, tone: "green" },
] as const;

export function ModelWorkModesScene() {
  return (
    <section className="scene section-scene model-work-modes-scene">
      <SceneHeader
        number="09"
        kicker="Qué necesita un modelo para correr"
        title="Entrenamiento, ajuste, RAG e inferencia"
      />

      <div className="model-work-flow">
        {modelWorkModes.map(({ label, detail, icon: Icon, tone }, index) => (
          <div className="model-work-fragment" key={label}>
            <article data-tone={tone}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <Icon aria-hidden />
              <strong>{label}</strong>
              <small>{detail}</small>
            </article>
            {index < modelWorkModes.length - 1 ? <ArrowRight aria-hidden /> : null}
          </div>
        ))}
      </div>

      <div className="model-work-scope">
        <BrainCircuit aria-hidden />
        <div><span>Esta charla</span><strong>Ejecutamos pesos ya entrenados</strong></div>
        <p>RAG aporta documentos durante la inferencia. No vuelve a entrenar el modelo.</p>
      </div>
    </section>
  );
}

export function ModelMemoryScene() {
  return (
    <section className="scene section-scene model-memory-scene">
      <SceneHeader
        number="10"
        kicker="Qué necesita un modelo para correr"
        title="¿Dónde guardamos todos esos parámetros?"
      />

      <div className="memory-journey" aria-label="Recorrido del modelo desde el disco hasta la generación">
        <article className="memory-stage memory-storage-stage">
          <span className="memory-stage-label"><b>01</b> En reposo</span>
          <div className="model-file-visual">
            <HardDrive aria-hidden />
            <div className="model-file">
              <BrainCircuit aria-hidden />
              <span>modelo.gguf</span>
            </div>
          </div>
          <strong>SSD</strong>
          <p>Parámetros almacenados</p>
          <small>Sin operaciones</small>
        </article>

        <div className="memory-transfer memory-load-transfer" aria-hidden>
          <span>Ollama / runtime</span>
          <div><i /><i /><i /><ArrowRight /></div>
          <small>Carga o mapea los pesos</small>
        </div>

        <article className="memory-stage memory-loaded-stage">
          <span className="memory-stage-label"><b>02</b> Cargado</span>
          <div className="working-memory">
            <div className="working-memory-title">
              <Database aria-hidden />
              <strong>RAM / VRAM</strong>
            </div>
            <div className="working-memory-weights">
              <BrainCircuit aria-hidden />
              <span>Pesos del modelo</span>
            </div>
            <div className="working-memory-extra">
              <span>Runtime</span>
              <span>Contexto</span>
            </div>
          </div>
          <div className="memory-size-example">
            <span>8B × 2 bytes</span>
            <strong>≈ 16 GB</strong>
            <small>solo los pesos</small>
          </div>
        </article>

        <div className="memory-transfer memory-inference-transfer" aria-hidden>
          <span>Prompt</span>
          <div><i /><i /><i /><ArrowRight /></div>
          <small>Tokens</small>
        </div>

        <article className="memory-stage memory-compute-stage">
          <span className="memory-stage-label"><b>03</b> Generando</span>
          <div className="memory-compute-visual">
            <span aria-hidden />
            <Cpu aria-hidden />
            <div aria-hidden><i /><i /><i /></div>
          </div>
          <strong>CPU / GPU</strong>
          <p>Ejecuta las capas</p>
          <div className="generated-token"><Sparkles aria-hidden /><span>Siguiente token</span></div>
        </article>
      </div>

      <p className="scene-keyline compact-keyline memory-keyline">
        En el disco cuando está en reposo. <strong>En memoria cuando está generando.</strong>
      </p>
    </section>
  );
}

const contextExamples = [
  { tokens: "2K", width: "24%", note: "prompt corto" },
  { tokens: "8K", width: "48%", note: "más historial" },
  { tokens: "32K", width: "92%", note: "más cache" },
] as const;

export function ContextMemoryScene() {
  return (
    <section className="scene section-scene context-memory-scene">
      <SceneHeader
        number="11"
        kicker="Qué necesita un modelo para correr"
        title="El contexto también consume memoria"
      />

      <div className="context-memory-layout">
        <article className="fixed-weights-block">
          <BrainCircuit aria-hidden />
          <span>Pesos del modelo</span>
          <strong>Tamaño casi fijo</strong>
          <small>según modelo y cuantización</small>
        </article>

        <div className="context-growth">
          <header><Layers3 aria-hidden /><div><span>KV cache</span><strong>Crece con el contexto</strong></div></header>
          {contextExamples.map((example) => (
            <article key={example.tokens}>
              <b>{example.tokens}</b>
              <i style={{ width: example.width }} />
              <span>{example.note}</span>
            </article>
          ))}
        </div>
      </div>

      <div className="context-concurrency">
        <span>Más historial</span><b>+</b><span>más usuarios simultáneos</span><b>=</b><strong>más memoria</strong>
      </div>
      <p className="context-caveat">La ventana de contexto es finita. El consumo exacto depende del modelo, runtime y configuración.</p>
    </section>
  );
}

function MemoryTower({ kind, amount, icon: Icon }: { readonly kind: string; readonly amount: string; readonly icon: typeof Cpu }) {
  return (
    <article className="memory-tower">
      <div><Icon aria-hidden /><strong>{kind === "RAM" ? "CPU" : "GPU"}</strong></div>
      <ArrowDown aria-hidden />
      <div className="memory-pool"><span>{kind}</span><strong>{amount}</strong></div>
    </article>
  );
}

export function RamVramScene() {
  return (
    <section className="scene section-scene ram-vram-scene">
      <SceneHeader
        number="12"
        kicker="Qué necesita un modelo para correr"
        title="RAM y VRAM no son lo mismo"
      />

      <div className="ram-vram-layout">
        <div className="traditional-pc">
          <p>PC tradicional · dos pools separados</p>
          <div>
            <MemoryTower kind="RAM" amount="32 GB" icon={Cpu} />
            <MemoryTower kind="VRAM" amount="16 GB" icon={Monitor} />
          </div>
        </div>

        <div className="vram-behavior">
          <article>
            <Check aria-hidden />
            <div><strong>Modelo dentro de VRAM</strong><span>Inferencia normalmente más rápida</span></div>
          </article>
          <article>
            <TriangleAlert aria-hidden />
            <div><strong>Modelo mayor que VRAM</strong><span>Offload / RAM / menor rendimiento posible</span></div>
          </article>
          <p>El comportamiento depende del runtime y de la arquitectura.</p>
        </div>
      </div>

      <p className="scene-keyline compact-keyline">
        VRAM suele ser <strong>uno de los límites principales</strong> en una GPU dedicada.
      </p>
    </section>
  );
}

export function AppleUnifiedMemoryScene() {
  return (
    <section className="scene section-scene unified-memory-scene">
      <SceneHeader
        number="13"
        kicker="Qué necesita un modelo para correr"
        title="¿Y qué pasa en una Mac M4?"
      />

      <div className="unified-layout">
        <article className="separate-memory-mini">
          <span>PC tradicional</span>
          <div><Cpu aria-hidden /><b>CPU</b><i /><strong>RAM</strong></div>
          <div><Monitor aria-hidden /><b>GPU</b><i /><strong>VRAM</strong></div>
          <small>Memorias separadas</small>
        </article>

        <article className="apple-silicon-diagram">
          <div className="apple-chip-label"><Cpu aria-hidden /><span>Apple Silicon</span></div>
          <h2>Unified Memory</h2>
          <div className="unified-components">
            <span><Cpu aria-hidden />CPU</span>
            <span><Monitor aria-hidden />GPU</span>
            <span><Zap aria-hidden />Neural Engine</span>
          </div>
          <div className="unified-pool"><Database aria-hidden /><strong>Memoria compartida</strong><span>macOS + apps + runtime + modelo + buffers</span></div>
        </article>

        <article className="hardware-info-card">
          <span>Esta presentación</span>
          <Laptop aria-hidden />
          <h2>Mac M4</h2>
          <dl>
            <div><dt>Arquitectura</dt><dd>arm64</dd></div>
            <div><dt>Memoria</dt><dd>Unified</dd></div>
            <div><dt>IA local</dt><dd>Lista</dd></div>
          </dl>
          <small>Sin asumir memoria disponible</small>
        </article>
      </div>

      <p className="unified-warning"><TriangleAlert aria-hidden /> Ollama no usa el Neural Engine automáticamente. La aceleración depende del runtime.</p>
    </section>
  );
}

const quantizedModels = [
  { label: "FP16", note: "16 bits por peso", width: "100%", memory: "≈ 16 GB", status: "NO CABE", tone: "red" },
  { label: "Q8", note: "8 bits por peso", width: "50%", memory: "≈ 8 GB", status: "AL LÍMITE", tone: "yellow" },
  { label: "Q4", note: "4 bits por peso", width: "25%", memory: "≈ 4 GB", status: "PUEDE CABER", tone: "green" },
] as const;

export function QuantizationScene() {
  return (
    <section className="scene section-scene quantization-scene">
      <SceneHeader
        number="14"
        kicker="Qué necesita un modelo para correr"
        title="Cuantización: el mismo modelo ocupa menos memoria"
      />

      <p className="quantization-definition"><strong>Ejemplo: un modelo de 8B.</strong> Cuantizar usa menos bits para guardar cada peso.</p>

      <div className="quantization-visualizer">
        <div className="quantization-models">
          {quantizedModels.map((model) => (
            <article key={model.label}>
              <div><strong>{model.label}</strong><span>{model.note}</span></div>
              <i data-tone={model.tone} style={{ width: model.width }}><Binary aria-hidden /><b>{model.memory}</b></i>
              <small>{model.status}</small>
            </article>
          ))}
        </div>

        <div className="quantization-arrow"><Gauge aria-hidden /><span>Menos bits<br />por peso</span><ArrowRight aria-hidden /></div>

        <div className="quantization-memory">
          <span>Límite del ejemplo</span>
          <strong className="quantization-memory-total">8 GB disponibles</strong>
          <div className="memory-capacity" aria-label="Q4 ocupa aproximadamente la mitad de los 8 GB disponibles"><i data-used /><i data-used /><i /><i /></div>
          <b className="quantization-memory-result">Q4 usa ≈ 4 GB en pesos</b>
          <small>Ahora puede caber</small>
        </div>
      </div>

      <div className="quantization-tradeoff">
        <div className="quantization-gain"><Check aria-hidden /><span><strong>Resultado</strong> El modelo necesita menos memoria.</span></div>
        <div className="quantization-cost"><TriangleAlert aria-hidden /><span><strong>Costo posible</strong> La calidad o el rendimiento pueden cambiar.</span></div>
      </div>
      <p className="quantization-footnote">Aproximación conceptual de los pesos. El uso real también incluye contexto, runtime y otros buffers.</p>
    </section>
  );
}

const fitFactors = [
  { label: "Modelo", detail: "parámetros", icon: BrainCircuit },
  { label: "Precisión", detail: "FP16 / Q8 / Q4", icon: Binary },
  { label: "Contexto", detail: "tokens + cache", icon: Layers3 },
  { label: "Memoria", detail: "disponible", icon: Database },
] as const;

const speedFactors = ["Ancho de banda", "Cómputo", "Runtime", "Offload"] as const;

export function ModelFitScene() {
  return (
    <section className="scene section-scene model-fit-scene">
      <SceneHeader
        number="15"
        kicker="Qué necesita un modelo para correr"
        title="¿Qué cabe en mi computadora?"
      />

      <div className="fit-equation" aria-label="Factores que determinan si un modelo puede ejecutarse">
        {fitFactors.map((factor, index) => {
          const Icon = factor.icon;
          return (
            <div className="fit-factor-fragment" key={factor.label}>
              <article><Icon aria-hidden /><strong>{factor.label}</strong><span>{factor.detail}</span></article>
              {index < fitFactors.length - 1 ? <b>+</b> : null}
            </div>
          );
        })}
        <strong className="fit-result"><Check aria-hidden /> ¿Puede correr?</strong>
      </div>

      <div className="same-model-comparison">
        <div><span>Modelo</span><strong>8B Q4</strong></div>
        <b>≠</b>
        <div><span>Modelo</span><strong>8B FP16</strong></div>
      </div>

      <div className="fit-speed-strip">
        <span>Si cabe, la velocidad depende de</span>
        {speedFactors.map((factor) => <b key={factor}>{factor}</b>)}
      </div>

      <div className="fit-disclaimer">
        <TriangleAlert aria-hidden />
        <div><strong>Capacidad y velocidad son preguntas diferentes</strong><span>La memoria determina si cabe. El hardware y el runtime determinan cómo se comporta.</span></div>
      </div>

      <div className="next-section-callout">
        <span>Siguiente bloque</span>
        <strong>El ecosistema de IA local</strong>
        <ArrowRight aria-hidden />
      </div>
    </section>
  );
}
