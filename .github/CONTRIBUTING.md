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

1. Make sure the app builds: `pnpm build`
2. Update the `sitemap.xml` if you added a new route
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
  router/index.js      — routes (17 lazy + 1 eager)
  stores/appStore.js   — reactive localStorage store
  i18n/index.js        — i18n composable
  i18n/locales/        — {fr,en}.js translation files
  views/               — one .vue per tool
  workers/             — Web Workers (hashWorker.js)
  seo.js               — per-route SEO meta
```

Questions? Join the [Discord](https://discord.gg/YmA88jc7GF).
