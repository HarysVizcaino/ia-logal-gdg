# IA Local, Home Labs y Tokens “Infinitos”

Presentación interactiva para DevFest Santo Domingo, construida con Next.js.
Incluye demos de inferencia local con Ollama, una demo cloud y una vista privada
para el presentador.

## Instalar dependencias y ejecutar la app

Requisitos: Node.js 20.9 o superior y pnpm 10.32.1, la versión indicada en
`package.json`.

Desde la carpeta del proyecto, instala las librerías:

```bash
pnpm install
```

Inicia la app en modo desarrollo:

```bash
pnpm dev --hostname 127.0.0.1 --port 3010
```

Abre [la presentación en el navegador](http://127.0.0.1:3010).
Para detener el servidor, presiona `Ctrl + C` en la terminal.

## Probar sin modelos locales: datos de demo

**Si no tienes los modelos instalados o tu computadora no puede ejecutarlos,
puedes usar los datos de demo.** Solo necesitas instalar las dependencias y correr
la app; no necesitas Ollama ni claves de API para reproducir estas demos.

En la diapositiva **Local AI Lab**, selecciona **Usar datos de demo** y luego
ejecuta las pruebas de SLM y LLM. Las respuestas y métricas están predefinidas:
simulan el streaming, pero no realizan inferencia real ni miden tu hardware.

Para volver a los modelos locales, selecciona **Probar modo en vivo** en el
laboratorio. La demo frontier tiene su propio selector: **Usar demo grabada** /
**Probar en vivo**, independiente del modo del laboratorio local.

## Ollama y modelos locales

Descarga e instala [Ollama](https://ollama.com/download).
También puedes consultar su [guía oficial](https://docs.ollama.com/quickstart).

Los modelos configurados para las demos de esta charla son:

| Demo | Modelo en Ollama | Uso en la presentación |
| --- | --- | --- |
| SLM | `qwen3.5:4b` | Clasificación de una tarea concreta con salida estructurada. |
| LLM | `qwen3:14b` | Análisis contextual y respuestas más elaboradas. |

Con Ollama iniciado, descarga ambos modelos:

```bash
ollama pull qwen3.5:4b
ollama pull qwen3:14b
```

Mantén abierta la aplicación de Ollama. Si el servicio no está corriendo,
puedes iniciarlo en otra terminal con:

```bash
ollama serve
```

No ejecutes un segundo servidor si Ollama ya está activo.

Crea `.env.local` en la raíz del proyecto, o agrega estas variables al archivo si
ya existe, sin borrar las demás configuraciones:

```dotenv
OLLAMA_BASE_URL=http://127.0.0.1:11434
SLM_MODEL=qwen3.5:4b
LLM_MODEL=qwen3:14b
```

Reinicia la app después de modificar las variables de entorno. En **Local AI Lab**,
selecciona el modo en vivo y comprueba el estado antes de ejecutar las demos.
Los modelos necesitan estar descargados y Ollama disponible; el runtime los
carga en memoria cuando recibe la solicitud de inferencia. La velocidad y la
capacidad para ejecutarlos dependen de la memoria y del hardware de tu equipo.

## Demo cloud con DeepSeek

La demo usa Chat Completions con streaming. Para probar DeepSeek, agrega estas
variables a `.env.local` (Next.js les da prioridad sobre las de `.env`):

```dotenv
FRONTIER_PROVIDER=deepseek
FRONTIER_LABEL=DeepSeek V4 Pro
FRONTIER_MODEL=deepseek-v4-pro
FRONTIER_BASE_URL=https://api.deepseek.com
DEEPSEEK_API_KEY=
FRONTIER_API_KEY=
FRONTIER_INPUT_COST_PER_1M=
FRONTIER_OUTPUT_COST_PER_1M=
```

Añade tu clave a `DEEPSEEK_API_KEY`. Deja `FRONTIER_API_KEY` vacío para no reutilizar
la clave del proveedor anterior. Los archivos `.env` y `.env.local` están excluidos
de Git; las credenciales solo se usan en el servidor.

Reinicia `pnpm dev --hostname 127.0.0.1 --port 3010`, recarga la presentación y,
en la demo frontier, usa **Probar en vivo**, **Comprobar** y **Ejecutar frontier**.
La comprobación valida acceso al proveedor y disponibilidad del modelo; el saldo
se comprueba al solicitar una respuesta. DeepSeek necesita su propia clave y saldo.

Las tarifas quedan vacías para no reutilizar las de OpenAI ni mostrar un costo
falsamente gratuito. Se pueden configurar en USD por millón de tokens si se desea
mostrar una estimación. Para volver a OpenAI, retira las variables de override de
`.env.local` y reinicia el servidor.

Referencias: [API de DeepSeek](https://api-docs.deepseek.com/),
[modelos disponibles](https://api-docs.deepseek.com/api/list-models/).
