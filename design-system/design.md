# Design System: Foundations

## Decisions (designer)
1. **Primary color:** `#0E2C22` (HSB 160/68/17), a deep forest green. One color supplied; no secondary.
2. **Font:** Montserrat for headings and text (single family; weights 400, 600, 700).
3. **Platform:** web app on mobile and desktop, so the type scale has mobile and desktop modes.

Defaults used (not asked): light + dark themes; output in `design-system/`.

## Color
Two levels of colour tokens. Components use semantic tokens only, never primitives.

### Level 1: primitives
Raw colours named by hue and step. Six palettes, each with the same 11 steps (50, 100 to 900, 950), plus `white`. Values are set in HSB: the hue is fixed per palette, saturation rises and brightness falls as the step number goes up.

| Palette | Notes | 50 / 500 / 700 / 900 / 950 |
|---|---|---|
| green | Hue 160. Primary and success | #F0FCF8 / #469E81 / #1D5C47 / #0E2C22 / #081A14 |
| neutral | Hue 39, saturation 2 to 10 | #FAF8F5 / #807D78 / #474542 / #21201E / #141412 |
| yellow | Hue 41. Warning | #FCF6E8 / #DEB459 / #8C7238 / #42361B / #292110 |
| red | Hue 7. Danger | #FCEBE8 / #E36B5B / #9E4A3F / #522621 / #331814 |
| blue | Hue 206. Chart fill | #EDF6FC / #5495C7 / #2E5C80 / #183042 / #0F1D29 |
| purple | Hue 285. Chart fill | #F9F0FC / #BB6BD6 / #793E8C / #40214A / #27142E |

- **Green** holds both the primary colour and success. The chosen colour #0E2C22 is `green.900`. There is no separate primary or success palette; the earlier, more saturated success tones (hue 160, S84) were replaced by green steps.
- **Yellow, red, blue and purple** were grown into full scales around the tones already in use, which sit on the scale unchanged: yellow 50 / 500 / 800, red 50 / 500 / 800, blue 400 / 500, purple 400 / 500.
- `white` (#FFFFFF) is a single colour outside the scales, so every palette keeps the same number of steps.

### Level 2: semantic
Four groups: background, border, icon and text. Each token aliases a primitive for light and dark mode. The shared attribute words are default, subtle, strong, primary, success, warning, danger, disabled and inverse. Chart fills are background tokens (`bg-chart-blue`, `bg-chart-purple`).

**Background (`bg-*`)**

| Token | Light | Dark |
|---|---|---|
| bg-page | neutral.50 | neutral.950 |
| bg-surface | white | neutral.900 |
| bg-surface-raised | neutral.200 | neutral.800 |
| bg-primary | green.700 | green.700 |
| bg-primary-hover | green.800 | green.800 |
| bg-primary-active | green.900 | green.900 |
| bg-disabled | neutral.300 | neutral.800 |
| bg-success | green.50 | green.800 |
| bg-warning | yellow.50 | yellow.900 |
| bg-danger | red.50 | red.900 |
| bg-chart-blue | blue.500 | blue.400 |
| bg-chart-purple | purple.500 | purple.400 |

**Border (`border-*`)**

| Token | Light | Dark |
|---|---|---|
| border-default | neutral.300 | neutral.700 |
| border-subtle | neutral.200 | neutral.800 |
| border-strong | neutral.400 | neutral.600 |
| border-primary | green.700 | green.700 |
| border-success | green.700 | green.500 |
| border-warning | yellow.500 | yellow.500 |
| border-danger | red.500 | red.500 |

**Icon (`icon-*`)**

| Token | Light | Dark |
|---|---|---|
| icon-default | neutral.950 | neutral.50 |
| icon-subtle | neutral.600 | neutral.400 |
| icon-primary | green.900 | green.500 |
| icon-success | green.700 | green.400 |
| icon-warning | yellow.800 | yellow.500 |
| icon-danger | red.800 | red.400 |

**Text (`text-*`)**

| Token | Light | Dark |
|---|---|---|
| text-default | neutral.950 | neutral.50 |
| text-subtle | neutral.600 | neutral.400 |
| text-disabled | neutral.400 | neutral.600 |
| text-inverse | neutral.50 | neutral.950 |
| text-primary | green.900 | green.500 |
| text-on-primary | neutral.50 | neutral.50 |
| text-success | green.700 | green.400 |
| text-warning | yellow.800 | yellow.500 |
| text-danger | red.800 | red.400 |
| text-danger-bright | red.700 | red.400 |

**Contrast:** checked with the WCAG formula in both modes. Text default is 17.4:1 on the page. Subtle text is 6.0:1 light and 7.5:1 dark. Status text on its own tint is 7.3 to 7.5:1 in light mode and 4.8 to 6.1:1 in dark mode. In dark mode the warning and danger tints moved to the 900 step and danger text to red.400, because the previous pairs were below 4.5:1 (4.1 and 2.6). `text-danger-bright` is a brighter red for small markers such as "Required": 5.7:1 on the light page, the brightest red step that still passes 4.5:1. Chart fills are 3.0 and 3.2:1 on the light page. Known gap, unchanged: `border-strong` is about 2.5:1 on surfaces, under the 3:1 target for non-text UI.

Think low contrast and high contrast, not light and dark.

## Typography
Montserrat: Regular 400, Semibold 600, Bold 700 only. Base is 16px (Body 2 and H4). Mobile uses ratio 1.2; desktop uses 1.333 for H1 and H2 (H3 to H5 are identical). Desktop is the 1.333 default for websites and can be tuned.

| Style | Mobile | Desktop | Weight | Letter-spacing |
|---|---|---|---|---|
| H1 | 32/36 | 36/40 | Bold | -2% |
| H2 | 24/28 | 28/32 | Bold | -2% |
| H3 | 20/24 | 20/24 | Bold | 0 |
| H4 | 16/20 | 16/20 | Bold | 0 |
| H5 | 14/16 | 14/16 | Bold | 0 |
| Body 1 | 20/28 | same | Regular (+ semibold, bold variants) | 0 |
| Body 2 | 16/24 | same | Regular (+ semibold, bold) | 0 |
| Body 3 | 14/20 | same | Regular (+ semibold, bold) | 0 |
| Body 4 | 12/16 | same | Regular (+ semibold, bold) | 0 |
| L1 | 20/20 | same | Semibold | 0 |
| L2 | 16/16 | same | Semibold | 0 |
| L3 | 14/14 | same | Semibold | 0 |

Line-heights: headings 120%, body 150%, labels 100%, all fitted to the 4px grid. Buttons use labels (L2 default, L1 large, L3 small); there are no separate button or eyebrow styles. Montserrat runs wide, so check letter-spacing by eye. The CSS applies mobile values by default and the desktop heading values at 1024px and up.

## Spacing
4px base; every value a multiple of 4. Fine steps up to 24px, wider steps after.

| Token | px | Use |
|---|---|---|
| space-0 | 0 | Reset |
| space-1 | 4 | Icon to text |
| space-2 | 8 | Related items |
| space-3 | 12 | Compact padding |
| space-4 | 16 | Default padding/gap |
| space-5 | 20 | Comfortable padding |
| space-6 | 24 | Card padding |
| space-8 | 32 | Inside-component sections |
| space-10 | 40 | Large padding |
| space-12 | 48 | Between blocks |
| space-16 | 64 | Page sections |
| space-20 | 80 | Large sections |
| space-24 | 96 | Largest app spacing |
| space-32 | 128 | Hero and landing sections (web) |

## Radius
Multiples of 4. Padding rule: inner radius = max(0, outer radius - padding). `radius.json` carries this as metadata.

| Token | px | Use |
|---|---|---|
| radius-0 | 0 | Square |
| radius-1 | 4 | Tags, chips, checkboxes |
| radius-2 | 8 | Buttons, inputs |
| radius-3 | 12 | Cards, popovers |
| radius-4 | 16 | Large cards, modals |
| radius-6 | 24 | Sheets |
| radius-full | 9999 | Pills, avatars |

## Icons
Library: **Iconsax**. Allowed styles: **Linear** (default, inactive states) and **Bold** (active/selected, filled status). Never Outline, Bulk, Broken or Two Tone. Icon color comes from the semantic icon tokens, never raw colors.

| Token | px | Use |
|---|---|---|
| icon-size-4 | 16 | Body 3/4, L2/L3, dense UI |
| icon-size-5 | 20 | Body 2, L1, small buttons |
| icon-size-6 | 24 | Default |
| icon-size-8 | 32 | Large buttons, tab bars |
| icon-size-10 | 40 | Feature icons |
| icon-size-12 | 48 | Hero icons |

## Shadows
Base color: `neutral.950` (#141412), never black. X offset and spread are 0. Every level is two layers, direct first (large, soft) then ambient (2px / 4px, fades as elevation rises and is gone at level 5). Dark mode doubles opacity and also uses lighter surfaces (`bg-surface`, `bg-surface-raised`).

| Token | Direct (Y / blur / opacity) | Ambient (Y / blur / opacity) | Dark mode | Use |
|---|---|---|---|---|
| shadow-1 | 4 / 8 / 6% | 2 / 4 / 12% | doubled | Cards, raised buttons |
| shadow-2 | 8 / 16 / 8% | 2 / 4 / 9% | doubled | Dropdowns, popovers, tooltips |
| shadow-3 | 12 / 24 / 9% | 2 / 4 / 6% | doubled | Sticky headers, FABs |
| shadow-4 | 16 / 32 / 10% | 2 / 4 / 3% | doubled | Side sheets, drawers |
| shadow-5 | 24 / 48 / 12% | none | doubled | Modals, dialogs |

## Resources used
Palette: primary color supplied by the designer as hex (no inspo-page or Adobe wheel pairing recorded). Font: Montserrat chosen directly by the designer.

## Governance
- **MVP:** ship these foundations, then add tokens only for real use cases.
- **Naming:** one shared word list (text/bg/border/icon); reuse words, avoid synonyms.
- **Change process:** (1) describe the use case existing tokens cannot cover; (2) check overlap, and extend or alias before adding; (3) add to the semantic layer with every mode, verify contrast, update the test screen; (4) record the decision here; (5) deprecate with a `deprecated/` prefix, migrate, then remove.
- **Test screen:** keep one (headline + subtext, card, borders, icons, success/warning/danger) and run it in light and dark after any token change.
- **Audit:** look for raw hex or primitives in components, tokens identical in all modes, missing dark pairs, failing contrast, unscoped variables, and off-vocabulary names.

## UI craft guide (how to make screens look better with this system)
Use these when composing screens. They come from the Refactoring UI principles in the design-system skills.

**Hierarchy**
- Each screen has one primary, a few secondary and many tertiary pieces of information. Make the primary obvious, then quiet the rest with colour and weight before size: `text-default` (primary), `text-subtle` (secondary), `text-disabled` only for disabled.
- Use weight 400, 600, 700 only. Emphasis is semibold (`body-*-semibold`) or the label styles, not a bigger size.
- Numbers matter most in this product (balances). Give the balance the largest style on the screen and its label `body-4`/`body-3` in `text-subtle`. Body text uses tabular numbers so columns line up.
- Buttons: one primary per view. Secondary is outlined, and tertiary is a text-only action (see backlog: not built yet). Destructive actions that are not the main action stay outlined; a solid danger button only on the final confirm step.

**Spacing and density**
- Group related things tighter than unrelated things: `space-1`/`space-2` inside a group, `space-4`/`space-6` between groups, `space-8`+ between sections. If two gaps look the same, one of them is wrong.
- Start with more space than looks necessary, then remove. Card padding is `space-4` on mobile and `space-6` from `md:`.
- Never add a border where spacing, a surface step (`bg-page` → `bg-surface` → `bg-surface-raised`) or a shadow can separate. Prefer `border-subtle` over `border-default` for dividers; `border-strong` is for form controls only.
- Limit line length to 45 to 75 characters for any paragraph.

**Colour**
- Grayscale first, colour second: get the layout right in neutrals, then add `primary` for the one main action and status colours for state.
- Colour carries meaning here (success, warning, danger, plus the four chart categories). Do not use status colours for decoration, and never rely on colour alone: pair it with an icon or label (the "short" hatch pattern in the balance bar is the model).
- Tinted surfaces (`bg-success`, `bg-warning`, `bg-danger`) hold text of the same family (`text-success`, etc.), which is the tested pair.
- Dark mode is not inverted light mode. Check every new screen in both; in dark, depth comes from lighter surfaces, not shadows (see audit finding 3).

**Shape, depth and icons**
- One radius family: `radius-2` controls, `radius-3` cards, `radius-4`/`radius-6` sheets and modals, `radius-full` pills. Nested corners follow the padding rule above. Do not mix square and rounded.
- Elevation reflects how high the element sits (shadow-1 card up to shadow-5 modal). Do not add a shadow and a strong border to the same element.
- Icons: Iconsax only, Linear by default, Bold for selected or filled status. Size from the icon tokens and matched to the text beside them (16 with Body 3/4, 20 with Body 2, 24 default). Icons are `icon-subtle` unless they carry state.

**Touch and accessibility (mobile-first, factory phones)**
- Tap targets are 44px or more on phones. `sm` buttons (40px) are for dense desktop use only.
- Every interactive element has a visible `focus-visible` style, a hover state (desktop), a pressed state and a disabled state.
- Text meets 4.5:1 and meaningful non-text UI (input borders, icons, focus rings, chart fills) meets 3:1. Run the contrast check after any colour change.

**Empty, loading and error states are part of the design.** Every list and form needs all three, using `EmptyState`, `Skeleton`/`Spinner` and `Alert`/inline field errors, not blank space.

## Changes applied after the audit (2026-11-17)
Applied in tokens, theme and components. Everything below this section is the original audit, kept for the reasoning.

**Colour (`semantic.json` and `tokens.css`)**
- `border-strong` is now `neutral.500` in both modes (about 4:1 on surfaces).
- Dark-mode primary: `bg-primary` `green.500`, hover `green.400`, pressed `green.300`, `border-primary` `green.500`, and `text-on-primary` `neutral.950`. Contrast on the dark page is 5.7:1.
- New: `bg-surface-overlay`, `bg-surface-hover`, `bg-surface-pressed`, `bg-primary-subtle`, `bg-danger-strong`, `bg-danger-strong-hover`, `bg-chart-green`, `bg-chart-yellow`, `border-focus`, `text-link`, `text-on-danger`, `text-on-chart`.
- Known gap: `bg-chart-yellow` is 2.83:1 on white in light mode (`yellow.600`); always pair it with a label. `bg-surface-pressed` in dark mode (`neutral.700`) is for `text-default`, not `text-subtle`.
- Correction to finding 3: dark shadows do show where an element sits on a lighter surface (menus on `bg-surface`). They are invisible on `bg-page`. Depth for cards comes from the surface step; sheets and modals use `bg-surface-overlay`.

**Other tokens**
- `border-width-1/2/4` (`tokens/border.json`), `--color-overlay` (`tokens/overlay.json`), and `--width-text` (640px), `--width-content` (1120px), `--width-app` (430px) in `tokens/spacing.json`.
- Tablet type: decided to keep two type modes. Mobile values apply below 1024px (tablet included); desktop heading sizes apply from `lg:`.

**Tailwind utilities (`app/design-system/theme.css`)**
`focus-ring` (2px `border-focus`, offset 2px) on every interactive element; `border-w-1/2/4`, `outline-w-2`; colour names `hover`, `pressed`, `overlay-surface`, `primary-subtle`, `danger-solid`, `line-focus`, `fg-link`, `chart-green`, `chart-yellow`.

**Components**
- `Button`: new `tertiary` (text only) and `danger-solid` (final destructive confirmation only). Outlined and tertiary hover use `bg-surface-hover` and `bg-surface-pressed`. `sm` is 44px on phones, 40px from `lg:`.
- `IconButton`: same hover tokens and 44px touch target.
- `Card` link, `ListRow`: hover, pressed and focus-ring states.
- `TextField`, `Select`, `NumberInput`: focus ring and hover border.
- `NavItem`: active item uses `bg-primary-subtle` from `lg:`.
- `app/globals.css`: legacy aliases (`--bg`, `--ink`, `--muted`, `--line`, `--card-line`, `--track`, `--neg`, `--c-*`, `--scrim`) removed; the prototype CSS now uses semantic tokens. `Sheet` uses `--color-overlay`.
- Stories added: Button tertiary, danger-solid, hierarchy and dark states; Card link hover, pressed and dark hover.

**Still open:** the duplicate `dvn-inventory-management/` folder, Mobile/Tablet/Desktop viewport stories for atoms and molecules, dark stories for Divider, Icon, Label, Skeleton, Spinner and ThemeToggle, other 32px/40px controls (Alert dismiss, Avatar), and the missing Table, Tabs, Dialog and Tooltip components.

## Audit findings (2026-11-17)
Source is largely adopted: components contain no raw hex, no off-grid spacing, no arbitrary px values, and only weights 400 to 700. The items below are what is left, ranked by impact on how good the UI looks and works. Contrast figures are WCAG ratios (light / dark).

### Foundation: to improve
1. **Input borders are under 3:1.** `border-strong` is 2.45:1 on `bg-surface` in light mode (2.55 in dark), and `TextField`, `Select` and `NumberInput` use it as the only edge of the field. Darken to about `neutral.500` in light mode (about 4:1). Also the known gap recorded above.
2. **Dark primary is low contrast against the page.** `bg-primary` (green.700) is 2.35:1 on `bg-page` and 2.07:1 on `bg-surface` in dark mode, and `border-primary` is 2.07:1. The label is fine (7.4:1) but the button shape nearly disappears. Give primary dark-mode values (for example fill `green.500`/`green.600` with a dark `text-on-primary`), and re-check hover and active.
3. **Dark shadows are invisible.** Shadows are `neutral.950` at doubled opacity on surfaces that are `neutral.900`/`neutral.950`, so they cannot show. In dark mode rely on the surface ladder and add a `border-subtle` edge to raised elements, or drop the shadow tokens to none there. Add a `bg-surface-overlay` (above `bg-surface-raised`) for sheets and modals so stacked layers stay distinguishable.
4. **Muted text and the border pair.** `text-disabled` is 2.3:1 light (disabled text is exempt, but do not use it for hints; use `text-subtle`). `border-default` is 1.4:1 and is meant as a quiet divider only.
5. **The system has no "tint" tokens, so screens look flat.** Add semantic tokens for the states a nicer UI needs: `bg-primary-subtle` (selected row, active tab), `bg-surface-hover` and `bg-surface-pressed` (list rows and outlined buttons; today `Button` builds these with an inline `color-mix`), `border-focus`, and `text-link`.

### Foundation: to add
- **Border widths:** `border-width-1` (default), `-2` (emphasis, focus ring) and `-4` (accent). Components currently use Tailwind `border-2` and `outline-2` directly.
- **Overlay:** `--color-overlay` (neutral.950 at 50%). `app/globals.css` defines `--scrim` with 45% and 70% by hand.
- **Layout widths:** `--width-text` (reading width) and `--width-content`. The prototype hard-codes a 430px phone column.
- **Chart/status fills as tokens:** `globals.css` reads primitives directly (`--green-500`, `--yellow-500`, `--neutral-950`), against the rule "components use semantic tokens only". Add `bg-chart-green` and `bg-chart-yellow` (or `bg-available`, `bg-proposal`) and a token for the tick colour.
- **Tablet type mode:** Tailwind has `md:` at 768px but type styles only change at 1024px. Either accept this and say so, or add a tablet step.

### Foundation: housekeeping
- **Legacy alias layer in `app/globals.css`** (`--bg`, `--ink`, `--muted`, `--line`, `--card-line`, `--track`, `--neg`, `--neg-bg`, `--accent`, `--c-*`) is a compatibility layer. Migrate the prototype CSS classes to semantic tokens or Tailwind utilities, then delete it, one entry at a time.
- **Duplicate tree:** the untracked `dvn-inventory-management/` folder holds a second, diverged copy of `design-system/`, `components/` and `app/`, plus a build output folder. It confuses audits and agents (an audit that includes it reports 78 colours instead of 2). Remove it or add it to `.gitignore`.
- **Naming:** tokens are `--bg-page`, `--text-subtle`, `--heading-1-font-size`. That is the project's convention and is internally consistent; keep it. Do not introduce a second naming style.
- **Uncommitted token changes** (`tokens.css`, `tokens/shadow.json`) should be committed with the matching `design.md` update so the JSON, CSS and docs stay in sync.

### Components: to improve
- **Hover and focus on cards:** `Card` as a link has only an `active:` state. Add `hover:` (`bg-surface-hover`) and `focus-visible` styles. Non-interactive atoms (Avatar, Divider, Label, Pill, Skeleton, Spinner, StatusBadge, Icon) correctly have none.
- **Field focus:** inputs change border colour only on focus. Use a 2px focus ring (`border-width-2`, `border-focus`) so focus does not depend on a colour change. Add a hover state and a disabled style consistent with `Button`.
- **Button hierarchy has two levels, not three.** Add a `tertiary` (text-only) variant and a `danger-solid` variant for final confirmations. The outlined/hover tints should use the new `bg-surface-hover` and `bg-surface-pressed` tokens instead of inline `color-mix`.
- **Touch targets:** `sm` Button and `IconButton` sm are 40px, and a few controls are 32px (`size-8`, `h-8`). On phones use 44px or more, and keep the small sizes for `lg:` layouts only.
- **Stories:** no atom or molecule story uses Mobile/Tablet/Desktop viewports (organisms were not checked). Add them wherever a component changes with the breakpoint. Dark stories are missing for Divider, Icon, Label, Skeleton, Spinner and ThemeToggle (low risk: they only use tokens), and each must carry `tags: ['!autodocs']`.
- **Missing pieces for richer screens:** a dense data row/table pattern, Tabs, a Dialog/Modal (sheets exist in `components/Sheets.tsx`, not as an organism), and a Tooltip. Build them from atoms, token-only, with stories.

### Foundation: already good (keep)
Two-level colour system with a full 11-step scale, status colours with tested contrast, 4px grid for spacing and radius, five two-part shadows from `neutral.950`, Iconsax with Linear/Bold only, three breakpoints only, every component has a story, and a test screen in `app/design-system`.
