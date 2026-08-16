# Contributing

Thanks for your interest in contributing to desktop.engineer!

## Getting started

```bash
pnpm install
pnpm dev
```

## Code conventions

- **Vue 3** with `<script setup>` — no Options API
- **No TypeScript, no tests, no linter** — keep it simple
- All user-facing strings go through `t('namespace.key')` (i18n)
  - Add the key to `src/i18n/locales/{fr,en}.js`
  - Use `{param}` interpolation for dynamic values
- `@/` import alias points to `src/`
- Backticks inside template literals in `.vue` files must be escaped with `\``
- No emojis — use Font Awesome 6 icons instead

## Before submitting a PR

1. Make sure the app builds: `pnpm build` (also generates PWA icons + static per-route HTML shells)
2. If you added a new route, update all of these:
   - `src/router/index.js`
   - `src/seo.js` (`seoMap` entry)
   - `public/sitemap.xml`
   - `scripts/generate-static-pages.mjs` (`NS_BY_PATH`, only if you want noscript SEO content)
   - `vercel.json` (rewrite exclusion, if the route prefix changes)
3. Update `AGENTS.md` if you added a new tool or changed the architecture

## PR checklist

- All strings use `t()` — no hardcoded French/English
- The build succeeds
- The feature works offline (PWA)

## Project structure

```
src/
  App.vue              — shell (navbar, footer, router-view)
  main.js              — entry point
  router/index.js      — routes (18 lazy + 1 eager)
  stores/appStore.js   — reactive localStorage store
  i18n/index.js        — i18n composable
  i18n/locales/        — {fr,en}.js translation files
  views/               — one .vue per tool
  workers/             — Web Workers (hashWorker.js)
  seo.js               — per-route SEO meta (+ SITE/seoMap, used by the static pages generator)
scripts/
  generate-pwa-icons.mjs   — PWA icons, runs on build
  generate-static-pages.mjs — per-route static HTML shells for SEO, runs on build
```

## Security

Security vulnerabilities must **not** be reported as public issues. See the [Security Policy](../SECURITY.md).

Questions? Join the [Discord](https://discord.gg/YmA88jc7GF).
