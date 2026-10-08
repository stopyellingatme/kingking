# TK's Place on the Web

This is my personal site. You can find my credentials and some experiments.

Live at [kingking.io](https://kingking.io).

## Develop

Use Node 18 (see `.nvmrc`).

```bash
npm ci
npm run dev
```

## Build

```bash
npm run build     # writes the static site to build/
npm run preview   # serves build/ on http://localhost:4173
npm test          # Playwright smoke test against the preview server
```

The site is fully static. `@sveltejs/adapter-static` prerenders every page.
Do not add server routes (`+page.server.ts`, `+server.ts`, `hooks.server.ts`).

The SvelteKit version is pinned to a 1.0 pre-release. Keep `package-lock.json` in git.
The npm `next` tag now points to a much newer major version.

## Deploy

A push to `main` runs `.github/workflows/deploy.yml`.
The workflow builds the site and publishes it to GitHub Pages.
The custom domain `kingking.io` is set in the repository under Settings → Pages.
