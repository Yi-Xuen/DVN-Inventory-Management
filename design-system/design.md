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
Color: `neutral.950` (#141412), never black. X offset and spread are 0. Each level was lowered one notch (shadow-2 to 5 take the previous level's values; shadow-1 is a new very subtle 4%). Dark mode doubles opacity and also uses lighter surfaces.

| Token | Y / blur | Light / dark opacity | Use |
|---|---|---|---|
| shadow-1 | 4 / 8 | 4% / 8% | Cards (very subtle) |
| shadow-2 | 4 / 8 | 8% / 16% | Dropdowns, popovers |
| shadow-3 | 8 / 16 | 10% / 20% | Sticky headers, FABs |
| shadow-4 | 12 / 24 | 12% / 24% | Drawers |
| shadow-5 | 16 / 32 | 14% / 28% | Modals |

## Resources used
Palette: primary color supplied by the designer as hex (no inspo-page or Adobe wheel pairing recorded). Font: Montserrat chosen directly by the designer.

## Governance
- **MVP:** ship these foundations, then add tokens only for real use cases.
- **Naming:** one shared word list (text/bg/border/icon); reuse words, avoid synonyms.
- **Change process:** (1) describe the use case existing tokens cannot cover; (2) check overlap, and extend or alias before adding; (3) add to the semantic layer with every mode, verify contrast, update the test screen; (4) record the decision here; (5) deprecate with a `deprecated/` prefix, migrate, then remove.
- **Test screen:** keep one (headline + subtext, card, borders, icons, success/warning/danger) and run it in light and dark after any token change.
- **Audit:** look for raw hex or primitives in components, tokens identical in all modes, missing dark pairs, failing contrast, unscoped variables, and off-vocabulary names.
