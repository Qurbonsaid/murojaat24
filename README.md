# Termiz aqlli shahar

Public landing page for Termiz aqlli shahar, built with React, TypeScript, Vite, and Tailwind CSS

## Local development

Requirements:

- Node.js 18+
- npm

Run locally:

```sh
npm install
npm run dev
```

Build production bundle:

```sh
npm run build
npm run preview
```

## Environment

- `VITE_API_URL` - backend API base URL (default: `http://localhost:5000`).
  Define this in `.env.development` for local work and in Vercel env vars for production.

## Stack

- Vite
- TypeScript
- React
- Tailwind CSS
- shadcn/ui components

## Notes

- Public assets are served from the `public/` directory.
- SEO and social metadata are configured in `index.html`.
