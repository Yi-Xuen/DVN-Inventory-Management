# DVN Inventory Management

Clickable prototype of the Divani fabric roll inventory flow (overview, balance calculator, stock lists, job details and the Reserve flow). It uses **sample data only**, kept in the browser (localStorage). There is no database or login yet.

Wireframes live in the Obsidian vault (`02 Product/09 Fabric Stock Screens - Draft.html`). Stack decision: ADR-001 (Next.js, later Supabase).

## Run locally

```bash
npm install
npm run dev
```

## Build and deploy

`npm run build` writes a static site to `out/`. Pushing to `main` publishes it to GitHub Pages through `.github/workflows/pages.yml`.
In the repo, go to Settings → Pages and set Source to "GitHub Actions" (one-time).

The "Reset demo" button at the top of the app restores the starting data.
