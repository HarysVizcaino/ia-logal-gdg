export const frontierIncidentPrompt = `Eres responsable de un incidente de producción.

Los usuarios reportan timeouts después de un deployment reciente.

Datos actuales:
- CPU normal
- aumento de latencia en base de datos
- errores de conexión intermitentes

Diseña un plan de investigación priorizado.
Explica qué verificarías primero y qué acciones evitarías hasta tener más evidencia.

Responde de forma estructurada y concisa.`;

export const frontierSystemPrompt =
  "Actúa como un ingeniero senior de confiabilidad. Prioriza evidencia, reversibilidad y seguridad operacional. Responde en español.";

export const recordedFrontierOutput = `1. Contener y correlacionar
- Confirmar el inicio exacto de los timeouts y compararlo con el deployment.
- Revisar tasa de errores, p95/p99 y saturación del pool de conexiones.

2. Verificar la base de datos
- Inspeccionar consultas lentas, locks, conexiones activas y cambios de esquema.
- Comparar el patrón por servicio, endpoint y región.

3. Probar la hipótesis del deployment
- Revisar cambios en queries, timeouts, retries y configuración del pool.
- Hacer rollback o canary solo si la evidencia vincula la regresión.

Evitar por ahora
- Reinicios masivos, aumentar retries o escalar cómputo sin identificar el cuello de botella.`;

export const recordedFrontierMetrics = {
  ttftMs: 510,
  totalDurationMs: 4_280,
  promptTokens: 118,
  generatedTokens: 196,
} as const;
