# TK's Place on the Web

This is my personal site. You can find my credentials and some experiments.

Live at [kingking.io](https://kingking.io).

## Develop

Use Node 24 (see `.nvmrc`).

```bash
npm ci
npm run dev
```

## Build

```bash
npm run build     # writes the static site to build/
npm run preview   # serves build/ on http://localhost:4173
npm test          # Playwright tests against the preview server
npm run check     # svelte-check type check
npm run lint      # Prettier and ESLint
```

Before you run the tests for the first time, run `npx playwright install chromium`.

The site is fully static. `@sveltejs/adapter-static` prerenders every page.
Do not add server routes (`+page.server.ts`, `+server.ts`, `hooks.server.ts`).

The site uses SvelteKit 2, Svelte 5 (runes), and Tailwind CSS 4.
Tailwind is configured in `src/app.css`. There is no `tailwind.config` file.
The dark theme uses the `dark` class on `<html>`. A script in `src/app.html` sets this class before the first paint.

## Deploy

A push to `main` runs `.github/workflows/deploy.yml`.
The workflow builds the site and publishes it to GitHub Pages.
The custom domain `kingking.io` is set in the repository under Settings → Pages.
