# PRD — IA Local, Home Labs y Tokens “Infinitos”

## 1. Visión del producto

Construir una aplicación web local que funcione como presentación interactiva para una charla sobre IA local.

La aplicación debe combinar:

- slides/escenas de presentación;
- diagramas animados;
- demos reales con modelos locales;
- comparación entre SLM, LLM y Frontier Models;
- métricas básicas de inferencia;
- una terminal controlada;
- ejecución local usando Ollama;
- ejecución cloud usando un proveedor frontier;
- funcionamiento offline para la mayor parte de la charla.

La aplicación será ejecutada en una Mac con Apple Silicon M4 durante la presentación.

No debe depender de una infraestructura externa para funcionar, excepto en las demos que explícitamente utilicen modelos cloud.

---

## 2. Objetivo principal

La web debe ayudar a explicar visualmente esta idea:

> No siempre necesitas el modelo más grande. Necesitas el modelo correcto, ejecutándose en el lugar correcto, para el problema correcto.

La aplicación no es un dashboard tradicional ni un chatbot.

Es una experiencia de presentación interactiva.

---

## 3. Usuarios

### Usuario principal

El ponente.

Debe poder controlar toda la presentación utilizando principalmente:

- flecha derecha;
- flecha izquierda;
- espacio;
- teclado;
- mouse solo cuando sea necesario.

### Usuario secundario

La audiencia.

No interactúa directamente con la web, pero debe poder seguir fácilmente:

- conceptos;
- animaciones;
- demos;
- resultados;
- diferencias entre local y cloud.

---

## 4. Objetivos de UX

La experiencia debe sentirse más parecida a una keynote interactiva que a una aplicación SaaS.

Principios:

- contenido grande y legible;
- muy poco texto por escena;
- elementos visuales grandes;
- transiciones suaves;
- alta legibilidad desde lejos;
- dark mode por defecto;
- diseño tecnológico;
- navegación rápida;
- cero distracciones;
- ningún scroll vertical durante la presentación.

Resolución prioritaria:

```text
1920x1080
16:9
```

Debe funcionar también correctamente en pantallas Retina.

---

## 5. Tecnología

### Stack requerido

```text
Next.js
TypeScript
React
Tailwind CSS
Framer Motion
Ollama API
```

Para iconografía:

```text
Lucide React
```

Opcional:

```text
xterm.js
```

No usar inicialmente:

- NestJS;
- base de datos;
- Docker obligatorio;
- microservicios;
- autenticación;
- CMS.

Todo debe poder correr con:

```bash
npm run dev
```

o:

```bash
npm run build
npm start
```

---

## 6. Arquitectura general

```text
Browser
   │
   ▼
Next.js
   │
   ├── Presentation Engine
   │
   ├── Local AI API
   │       ↓
   │     Ollama
   │
   ├── Cloud AI API
   │       ↓
   │   Frontier Model
   │
   ├── System Info
   │
   └── Controlled Terminal
```

---

## 7. Modos de IA

La aplicación debe soportar tres conceptos claramente diferenciados.

### SLM

Modelo pequeño ejecutado localmente.

Ejemplo conceptual:

```text
3B / 4B
LOCAL
```

Uso principal de demo:

- clasificación;
- routing;
- extracción;
- tareas simples.

### LLM

Modelo más grande ejecutado localmente.

Ejemplo conceptual:

```text
7B / 8B / 14B
LOCAL
```

Uso:

- conversación;
- resumen;
- análisis;
- razonamiento moderado;
- preguntas más abiertas.

### Frontier

Modelo servido desde la nube.

Ejemplos posibles:

```text
OpenAI
Anthropic
Google
```

Debe quedar claramente indicado en UI que:

```text
LOCAL
```

y:

```text
CLOUD
```

son arquitecturas distintas.

---

## 8. Presentation Engine

La web debe tener un sistema propio de escenas.

No utilizar páginas tradicionales independientes como UX principal.

Ejemplo conceptual:

```text
/scenes/01-intro
/scenes/02-cloud
/scenes/03-models
```

Pero el usuario debe percibirlo como una presentación continua.

### Controles

```text
ArrowRight → siguiente escena
ArrowLeft  → escena anterior
Space      → avanzar
Esc        → overview
F          → fullscreen
```

Opcional:

```text
G → ir a escena
```

---

## 9. Indicador de progreso

Mostrar de forma discreta:

```text
07 / 18
```

o una barra inferior.

Debe poder ocultarse.

---

## 10. Estructura inicial de escenas

### Scene 01 — Intro

Mostrar:

```text
IA LOCAL
HOME LABS
Y TOKENS “INFINITOS”
```

Subtítulo opcional:

```text
¿Qué pasa cuando la IA deja de vivir únicamente en la nube?
```

Animación mínima.

---

## 11. Scene 02 — Cómo usamos IA hoy

Mostrar arquitectura:

```text
Usuario
   ↓
Internet
   ↓
OpenAI / Anthropic / Google
   ↓
Datacenter
```

Pregunta final:

> ¿Tiene que vivir siempre allí?

---

## 12. Scene 03 — Cloud vs Local

Dos arquitecturas lado a lado.

### Cloud

```text
Usuario
 ↓
Internet
 ↓
Provider
 ↓
GPU
```

### Local

```text
Usuario
 ↓
Ollama
 ↓
Modelo
 ↓
Mac
```

Debe poder animarse el flujo.

---

## 13. Scene 04 — Modelos

Introducir:

```text
SLM
LLM
FRONTIER
```

Mostrar las tres categorías visualmente.

No presentarlas como categorías matemáticamente estrictas.

---

## 14. Scene 05 — SLM

Concepto:

```text
SMALL LANGUAGE MODEL
```

Mostrar:

- pequeño;
- rápido;
- eficiente;
- tarea específica;
- local friendly.

Ejemplo:

```text
Documento
 ↓
SLM
 ↓
Categoría
```

---

## 15. Scene 06 — Demo SLM

La interfaz debe permitir escribir o lanzar un prompt predefinido.

Ejemplo:

```text
Clasifica este mensaje:

“No puedo acceder a mi cuenta desde ayer.”
```

Resultado esperado:

```text
ACCOUNT_SUPPORT
```

Mostrar:

```text
LOCAL
```

y datos de inferencia si están disponibles.

---

## 16. Scene 07 — LLM

Mostrar:

```text
LARGE LANGUAGE MODEL
```

Conceptos:

- generalista;
- conocimiento más amplio;
- conversación;
- síntesis;
- mayor uso de memoria.

---

## 17. Scene 08 — Demo LLM

Ejemplo:

```text
Un cliente fue cobrado dos veces después de cambiar su plan.
¿Qué información necesitarías para investigar el problema?
```

Mostrar streaming de respuesta.

Debe sentirse claramente más sofisticado que la demo SLM.

---

## 18. Scene 09 — Frontier Model

Mostrar:

```text
FRONTIER
```

Conceptos:

- máxima capacidad;
- razonamiento complejo;
- agentic workflows;
- cloud;
- costo por uso.

No asociar frontier únicamente con tamaño en parámetros.

---

## 19. Scene 10 — Demo Frontier

Mismo frontend de chat, pero cambiar claramente la ruta:

```text
LOCAL
```

a:

```text
CLOUD
```

Animación:

```text
Mac
 ↓
Internet
 ↓
Frontier API
```

---

## 20. Selector de modelos

Crear un componente reusable:

```text
[ SLM ] [ LLM ] [ FRONTIER ]
```

Cada uno debe indicar:

```text
Model
Location
Provider
Status
```

Ejemplo:

```text
Qwen
LOCAL
Ollama
READY
```

---

## 21. Scene — Qué ocurre durante inferencia

Explicar visualmente:

```text
Prompt
 ↓
Tokens
 ↓
Model
 ↓
Next Token
 ↓
Next Token
 ↓
Response
```

Idealmente animar los tokens apareciendo uno a uno.

---

## 22. Tokens

Crear una visualización donde una frase se divida visualmente en tokens.

No necesita implementar tokenización real en MVP.

Puede ser una aproximación visual.

Posteriormente podrá conectarse a un tokenizer real.

---

## 23. Parámetros

Explicar visualmente:

```text
3B
8B
14B
70B
```

El objetivo es transmitir:

```text
más parámetros
≈
más memoria y computación
```

sin afirmar que más parámetros siempre equivale a mejor modelo.

---

## 24. Cuantización

Crear una escena interactiva:

```text
FP16
 ↓
Q8
 ↓
Q4
```

Visualmente reducir el tamaño de un bloque.

Mostrar:

```text
Memory ↓
Model size ↓
Hardware requirements ↓
```

Y:

```text
Possible quality trade-off
```

---

## 25. Hardware

La charla será ejecutada en Apple Silicon.

La UI debe mostrar el concepto:

```text
Apple Silicon

CPU ┐
GPU ├── Unified Memory
NPU ┘
```

Compararlo visualmente con:

```text
Traditional PC

CPU → RAM
GPU → VRAM
```

---

## 26. Información real del Mac

Crear endpoint:

```text
GET /api/system
```

Debe intentar devolver:

```ts
{
  platform: "macOS",
  chip: "...",
  memoryTotal: "...",
  memoryUsed: "...",
  architecture: "arm64"
}
```

No es obligatorio obtener todos los datos en MVP.

Debe fallar de forma segura.

---

## 27. Ollama integration

Crear:

```text
GET /api/ollama/models
```

Usando:

```text
http://localhost:11434
```

Debe devolver modelos disponibles.

Ejemplo:

```ts
[
  {
    name: "qwen...",
    size: ...
  }
]
```

---

## 28. Chat local

Crear:

```text
POST /api/ai/local
```

Payload conceptual:

```ts
{
  model: string,
  messages: Message[]
}
```

Debe usar Ollama.

Prioridad:

**streaming response.**

---

## 29. Métricas de Ollama

Cuando sea posible mostrar:

- total duration;
- load duration;
- prompt eval count;
- eval count;
- eval duration.

A partir de eso calcular:

```text
tokens/sec
```

Mostrar:

```text
42.6 tok/s
```

---

## 30. Metrics component

Crear panel reusable:

```text
MODEL
Qwen

LOCATION
LOCAL

TOKENS / SEC
42.6

GENERATED
184

DURATION
4.3s
```

No saturar visualmente.

---

## 31. Cloud AI abstraction

No acoplar directamente toda la UI a OpenAI.

Crear interfaz:

```ts
interface AIProvider {
  chat(...)
}
```

Inicialmente puede implementarse:

```text
OpenAI
```

Más adelante:

```text
Anthropic
Gemini
```

---

## 32. Endpoint cloud

```text
POST /api/ai/cloud
```

Debe requerir variables de entorno.

Ejemplo:

```text
OPENAI_API_KEY=
```

Nunca exponer secretos al browser.

---

## 33. Fallback para demo cloud

Si no existe Internet o la API falla:

mostrar:

```text
CLOUD UNAVAILABLE
```

y permitir:

```text
Use Recorded Demo
```

El speaker debe poder continuar la charla.

---

## 34. Offline-first

La aplicación debe poder presentar todas las escenas sin Internet.

Internet solo debe ser necesario para:

```text
Frontier demo
```

Assets:

- logos;
- iconos;
- imágenes;
- fonts;

deben estar disponibles localmente cuando sea posible.

---

## 35. Terminal

Crear componente:

```text
<Terminal />
```

Debe parecer una terminal real.

No permitir shell arbitraria inicialmente.

---

## 36. Comandos permitidos

MVP:

```text
help
models
ollama list
ollama ps
hardware
clear
```

Opcional:

```text
run <model>
```

Internamente puede mapear:

```ts
command -> handler
```

en lugar de ejecutar directamente shell arbitrario.

---

## 37. Seguridad de terminal

PROHIBIDO en MVP:

```ts
exec(userInput)
```

No crear un endpoint de ejecución arbitraria.

Usar allowlist.

Ejemplo:

```ts
const commands = {
  "ollama list": ollamaList,
  "ollama ps": ollamaPs,
  "hardware": getHardware
}
```

---

## 38. Scene — Home Lab

Mostrar evolución:

```text
Laptop
 ↓
Desktop
 ↓
Server
 ↓
Home Lab
```

Mensaje:

> Un Home Lab no es requisito para empezar.

---

## 39. Scene — IA más allá del chat

Mostrar tarjetas:

```text
Classification
Summarization
RAG
Coding
Agents
Automation
Private data
```

---

## 40. Demo arquitectura

Crear animación:

```text
App
 ↓
Local API
 ↓
Ollama
 ↓
Model
 ↓
Apple Silicon
```

Y posteriormente:

```text
App
 ↓
Cloud API
 ↓
Frontier Model
```

---

## 41. Tokens “Infinitos”

Escena específica.

### Cloud

```text
Tokens
 ↓
API usage
 ↓
Invoice
```

### Local

```text
Tokens
 ↓
Your hardware
 ↓
Electricity / Hardware
```

Mensaje:

> No son literalmente infinitos. Cambias pago por uso por infraestructura propia.

---

## 42. Cost meter

Crear componente visual opcional:

```text
LOCAL
API cost: $0.00

CLOUD
Estimated API cost: $0.00xxx
```

No necesita tener precisión financiera perfecta en MVP.

Debe indicar:

```text
Estimated
```

---

## 43. Offline demo

Crear un modo especial activable por teclado:

```text
O
```

o botón:

```text
GO OFFLINE
```

La UI visualmente muestra:

```text
INTERNET OFFLINE
```

La demo local sigue funcionando.

La cloud queda deshabilitada.

No es obligatorio que la web apague realmente Wi-Fi.

---

## 44. Presenter Mode

Debe existir un panel oculto.

Acceso:

```text
P
```

Mostrar:

- escena actual;
- siguiente escena;
- notas;
- tiempo transcurrido;
- estado Ollama;
- estado Internet;
- modelo cargado.

---

## 45. Speaker notes

Cada escena debe aceptar:

```ts
notes: string[]
```

Ejemplo:

```ts
{
  title: "...",
  notes: [
    "Explicar diferencia entre RAM y memoria unificada",
    "No entrar todavía en quantization"
  ]
}
```

---

## 46. Timer

Presenter mode debe incluir:

```text
Elapsed
23:42
```

y opcional:

```text
Target
40:00
```

Indicadores:

```text
ON TIME
BEHIND
AHEAD
```

---

## 47. Navigation overview

Presionar:

```text
ESC
```

Debe abrir grid:

```text
01 Intro
02 Cloud
03 Local
04 Models
...
```

Permitir saltar a cualquier escena.

---

## 48. Fullscreen

El sistema debe soportar fullscreen desde la UI.

Mostrar un pequeño botón antes de comenzar:

```text
START PRESENTATION
```

que intente activar fullscreen.

---

## 49. Diseño visual

Tema:

```text
Dark
Black
Deep gray
Subtle purple/neon accents
```

Pero evitar que parezca gaming.

Debe sentirse:

```text
developer
AI
minimal
premium
```

---

## 50. Tipografía

Usar fuente sans-serif moderna.

Prioridad:

- legibilidad;
- números grandes;
- títulos muy grandes.

Evitar demasiado texto pequeño.

---

## 51. Animaciones

Framer Motion.

Usar principalmente:

- fade;
- scale;
- slide;
- line/path progression.

Evitar animaciones excesivas.

Duración objetivo:

```text
200ms–600ms
```

---

## 52. Componentes principales

```text
PresentationShell
Scene
SceneTitle
ArchitectureDiagram
ModelCard
ModelSelector
LocalCloudBadge
Terminal
ChatDemo
MetricsPanel
TokenVisualizer
QuantizationVisualizer
HardwareDiagram
PresenterMode
ProgressIndicator
ConnectionStatus
```

---

## 53. Estado global

Puede utilizar:

```text
React Context
```

o:

```text
Zustand
```

Para manejar:

```ts
{
  currentScene,
  selectedModel,
  presentationMode,
  ollamaStatus,
  internetStatus
}
```

No introducir Redux.

---

## 54. Datos de escenas

Las escenas deben ser fáciles de reorganizar.

Ejemplo:

```ts
const scenes = [
  {
    id: "intro",
    title: "...",
    component: IntroScene
  }
]
```

No hardcodear navegación manual entre rutas.

---

## 55. Demo presets

Crear prompts preconfigurados.

Ejemplo:

```text
SLM_CLASSIFICATION
LLM_SUPPORT
FRONTIER_INCIDENT
```

El speaker debe poder lanzar un demo con un clic.

---

## 56. Reset demo

Cada demo debe tener:

```text
RESET
```

para volver al estado inicial.

Esto es crítico para ensayos.

---

## 57. Demo mode

Agregar variable:

```text
DEMO_MODE=true
```

Cuando está activa:

- puede simular métricas;
- puede devolver respuestas precargadas;
- evita fallos en presentación.

---

## 58. Live mode

```text
DEMO_MODE=false
```

Debe ejecutar servicios reales.

La UI debe mostrar:

```text
LIVE
```

---

## 59. Health check

Crear:

```text
GET /api/health
```

Debe comprobar:

```text
Next.js
Ollama
Cloud credentials
Internet
```

Ejemplo:

```ts
{
  app: true,
  ollama: true,
  internet: true,
  cloudProvider: true
}
```

---

## 60. Preflight screen

Antes de comenzar la presentación:

```text
PRESENTATION CHECK

✓ App
✓ Ollama
✓ Models
✓ Internet
✓ Cloud API

START
```

Si cloud falla:

```text
⚠ Cloud API unavailable
Presentation can continue.
```

---

## 61. Model preload

Debe existir una forma de indicar:

```text
PRELOAD MODEL
```

antes de comenzar una demo.

La intención es reducir la latencia inicial de Ollama.

---

## 62. Error handling

Nunca mostrar stack traces durante la charla.

Errores deben convertirse en mensajes amigables:

```text
LOCAL MODEL UNAVAILABLE
```

```text
CLOUD CONNECTION LOST
```

```text
MODEL NOT INSTALLED
```

---

## 63. Logs

En desarrollo:

```text
console/server logs
```

Durante presentación:

no mostrar logs técnicos fuera del presenter mode.

---

## 64. Performance

La transición entre escenas debe sentirse instantánea.

Evitar cargas pesadas durante navegación.

Precargar:

- escena siguiente;
- componentes;
- assets.

---

## 65. Responsive

Prioridad absoluta:

```text
16:9 desktop / projector
```

Secundario:

```text
laptop
```

Mobile no es prioridad para MVP.

---

## 66. Accesibilidad

- contraste alto;
- texto grande;
- navegación por teclado;
- no depender únicamente de color para distinguir local/cloud.

---

## 67. MVP

La primera versión funcional debe incluir solo:

1. Presentation shell.
2. Navegación por teclado.
3. 8–10 escenas.
4. SLM / LLM / Frontier cards.
5. Ollama status.
6. Ollama model list.
7. Local chat streaming.
8. Cloud chat.
9. Metrics básicas.
10. Terminal controlada.
11. Presenter mode básico.
12. Preflight screen.
13. Demo mode.

No construir todo el contenido definitivo todavía.

---

## 68. Fase 2

Después del MVP:

- token visualizer;
- quantization animation;
- Apple Silicon hardware animation;
- cost calculator;
- enhanced metrics;
- offline visualization;
- benchmark comparisons;
- polished presenter notes;
- transitions refinadas.

---

## 69. Fase 3

Opcional:

- compartir presentación en red local;
- audiencia conectada desde QR;
- encuestas en vivo;
- preguntas;
- votación SLM vs LLM;
- dashboard remoto;
- control desde teléfono.

Esto queda fuera del alcance actual.

---

## 70. Criterios de aceptación del MVP

La aplicación se considera lista para primera prueba cuando:

- inicia localmente;
- puede navegarse completamente con teclado;
- funciona sin Internet excepto cloud;
- detecta Ollama;
- lista modelos instalados;
- puede enviar un prompt a un modelo local;
- muestra respuesta streaming;
- puede enviar una consulta a un modelo cloud;
- diferencia claramente LOCAL y CLOUD;
- puede ejecutar comandos controlados;
- tiene fallback de demo;
- un fallo de API no rompe la presentación.

---

## 71. Primera tarea para Codex

> Build the MVP foundation for this interactive presentation platform using Next.js, TypeScript, Tailwind CSS and Framer Motion.
>
> Start only with the presentation engine, keyboard navigation, fullscreen presentation shell, scene registry, progress indicator, overview screen and presenter mode.
>
> Create placeholder scenes for:
>
> 1. Intro  
> 2. Cloud AI  
> 3. Local AI  
> 4. SLM  
> 5. LLM  
> 6. Frontier Model  
> 7. Hardware  
> 8. Quantization  
> 9. Home Lab  
> 10. Tokens “Infinitos”
>
> Do not implement Ollama or cloud APIs yet.
>
> Structure the code so integrations can be added later without rewriting the presentation engine.
>
> Prioritize 1920x1080 presentation mode, keyboard navigation and clean reusable components.
