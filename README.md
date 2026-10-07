This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Demo cloud con DeepSeek

La demo usa Chat Completions con streaming. Para probar DeepSeek, crea `.env.local`
con estas variables (Next.js les da prioridad sobre las de `.env`):

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

Reinicia `npm run dev -- --hostname 127.0.0.1 --port 3010`, recarga la presentación y,
en la demo frontier, usa **Probar en vivo**, **Comprobar** y **Ejecutar frontier**.
La comprobación valida acceso al proveedor y disponibilidad del modelo; el saldo
se comprueba al solicitar una respuesta. DeepSeek necesita su propia clave y saldo.

Las tarifas quedan vacías para no reutilizar las de OpenAI ni mostrar un costo
falsamente gratuito. Se pueden configurar en USD por millón de tokens si se desea
mostrar una estimación. Para volver a OpenAI, retira las variables de override de
`.env.local` y reinicia el servidor.

Referencias: [API de DeepSeek](https://api-docs.deepseek.com/),
[modelos disponibles](https://api-docs.deepseek.com/api/list-models/).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
