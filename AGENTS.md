<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project context

Read `design.md` (product context) and `design-system/design.md` (visual foundations) before any UI work.

## Design rules

- **Always use the design tokens in this repo** (`design-system/tokens.css`, sourced from `design-system/tokens/*.json`). Never hard-code colours, font sizes, spacing, radius, shadows or icon sizes. If a value is missing, add a token first, then use it.
- **Colour tokens have two levels.** Primitives are raw palettes (`green`, `neutral`, `yellow`, `red`, `blue`, `purple`, 11 steps each). Semantic tokens (`bg-*`, `border-*`, `icon-*`, `text-*`) alias them. Components use semantic tokens only. Edit `design-system/tokens/*.json` and `design-system/tokens.css` together.
- **Follow atomic design**: atoms → molecules → organisms → templates → pages. Components live in `components/atoms`, `components/molecules` and `components/organisms`, and their Storybook titles use the same level (`Atoms/Button`).
- **Mobile-first, three sizes only.** Write the mobile layout with no prefix, then add `md:` (tablet, 768px) and `lg:` (desktop, 1024px). No other breakpoints exist (see `app/design-system/theme.css`). Give each responsive component Mobile, Tablet and Desktop stories using the `viewport` global.
- **Docs pages show light mode.** A story that forces dark mode (`globals: { theme: 'dark' }`) must also carry `tags: ['!autodocs']`, so it stays in the sidebar but out of the component's Docs page.
- **Keep Storybook in sync.** Whenever a component is added or changed, add or update its `*.stories.tsx` file next to it in the same change, covering its variants and states, so it can be previewed with `npm run storybook`.
