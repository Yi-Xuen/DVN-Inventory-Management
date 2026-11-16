<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project context

Read `design.md` (product context) and `design-system/design.md` (visual foundations) before any UI work.

## Design rules

- **Always use the design tokens in this repo** (`design-system/tokens.css`, sourced from `design-system/tokens/*.json`). Never hard-code colours, font sizes, spacing, radius, shadows or icon sizes. If a value is missing, add a token first, then use it.
- **Follow atomic design**: atoms → molecules → organisms → templates → pages.
- **Keep Storybook in sync.** Whenever a component is added or changed, add or update its `*.stories.tsx` file next to it in the same change, covering its variants and states, so it can be previewed with `npm run storybook`.
