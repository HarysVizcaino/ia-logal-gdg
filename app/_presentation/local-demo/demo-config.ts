import type { LocalDemoCategory, LocalInferenceMetrics } from "./types";

export interface LocalDemoPreset {
  readonly id: string;
  readonly category: LocalDemoCategory;
  readonly label: string;
  readonly task: string;
  readonly system: string;
  readonly prompt: string;
  readonly demoOutput: string;
  readonly demoMetrics: Omit<LocalInferenceMetrics, "model">;
}

export const demoPresets = {
  slmClassification1: {
    id: "slm-classification-1",
    category: "slm",
    label: "Test 1",
    task: "Classification",
    system: "Responde únicamente con una de las categorías proporcionadas.",
    prompt: `Clasifica el siguiente mensaje en una sola categoría.

Categorías:
BILLING
ACCOUNT_ACCESS
TECHNICAL_SUPPORT
CANCELLATION

Mensaje:
"Desde ayer no puedo entrar a mi cuenta aunque ya cambié mi contraseña."

Responde únicamente con el nombre de la categoría.`,
    demoOutput: "ACCOUNT_ACCESS",
    demoMetrics: { ttftMs: 184, totalDurationMs: 612, promptTokens: 64, generatedTokens: 3, tokensPerSecond: 28.4, loadDurationMs: 92 },
  },
  slmClassification2: {
    id: "slm-classification-2",
    category: "slm",
    label: "Test 2",
    task: "Classification",
    system: "Responde únicamente con una de las categorías proporcionadas.",
    prompt: `Clasifica el siguiente mensaje en una sola categoría.

Categorías:
BILLING
ACCOUNT_ACCESS
TECHNICAL_SUPPORT
CANCELLATION

Mensaje:
"Me cobraron dos veces este mes."

Responde únicamente con el nombre de la categoría.`,
    demoOutput: "BILLING",
    demoMetrics: { ttftMs: 171, totalDurationMs: 544, promptTokens: 57, generatedTokens: 2, tokensPerSecond: 31.1, loadDurationMs: 41 },
  },
  llmAnalysis: {
    id: "llm-analysis",
    category: "llm",
    label: "Análisis",
    task: "Analysis",
    system: "Responde de forma breve, estructurada y sin inventar datos que no estén en el caso.",
    prompt: `Un cliente cambió su plan hace una semana.

Desde entonces ha recibido dos cargos diferentes y además abrió un ticket diciendo que perdió acceso a una funcionalidad.

¿Cómo investigarías el problema y qué información necesitarías antes de responderle?

Responde de forma breve y estructurada.`,
    demoOutput: "1. Verificaría el cambio de plan, la fecha efectiva y el prorrateo aplicado.\n2. Compararía ambos cargos con las facturas y transacciones.\n3. Revisaría el ticket, permisos y la funcionalidad perdida.\n4. Confirmaría el historial del cliente antes de responder y proponer una corrección.",
    demoMetrics: { ttftMs: 463, totalDurationMs: 4870, promptTokens: 79, generatedTokens: 71, tokensPerSecond: 16.8, loadDurationMs: 730 },
  },
} as const satisfies Record<string, LocalDemoPreset>;

export type LocalDemoPresetId = (typeof demoPresets)[keyof typeof demoPresets]["id"];

export const presetsById = Object.fromEntries(
  Object.values(demoPresets).map((preset) => [preset.id, preset]),
) as Record<LocalDemoPresetId, LocalDemoPreset>;
