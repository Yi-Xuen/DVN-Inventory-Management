# Design System: Foundations

## Decisions (designer)
1. **Brand color:** `#0E2C22` (HSB 160/68/17), a deep forest green. One color supplied; no secondary.
2. **Font:** Montserrat for headings and text (single family; weights 400, 600, 700).
3. **Platform:** web app on mobile and desktop, so the type scale has mobile and desktop modes.

Defaults used (not asked): light + dark themes; output in `design-system/`.

## Color
Rules: `base` = chosen color; `light` = same hue, S8 B99; `dark` = same hue/saturation, B lowered until 7:1 on `light`; `bright` = lightened for 4.5:1 on dark surfaces. Neutrals use hue 39 (warm tan, taken from #C6A463 with its saturation cut from 50 to a 2-10 ramp), brightness 98 to 8. Contrast re-checked: text 17.4:1, subtle text 6.0:1 light and 7.5:1 dark.

| Token | Hex | HSB |
|---|---|---|
| brand.primary.base | #0E2C22 | 160/68/17 |
| brand.primary.light | #F0FCF8 | 160/5/99 |
| brand.primary.dark | #1D5C47 | 160/68/36 |
| brand.primary.bright | #469E81 | 160/56/62 |
| neutral.50 / 950 | #FAF8F5 / #141412 | 39/2/98 / 39/10/8 |
| chart.blue (base / bright) | #5495C7 / #75A9D1 | 206/58/78 / 206/44/82 |
| chart.purple (base / bright) | #BB6BD6 / #C27ED9 | 285/50/84 / 285/42/85 |
| success (base / bright / dark) | #072B1F / #199E72 / #106146 | hue 160, S84 |
| warning (base / dark) | #DEB459 / #614E27 | 41/60/87 |
| danger (base / dark) | #E36B5B / #7A3A31 | 7/60/89 |

**Chart colors:** `chart.blue` and `chart.purple` follow the hues of #95CAF3 (206) and #DC95F3 (285). Semantic `chart.*` uses `base` in light mode and `bright` in dark mode. Light-mode tones are deeper than the reference pastels so fills reach about 3:1 on the page (blue 3.0:1, purple 3.2:1). Dark-mode tones are 5.6 to 7.3:1 on the dark surfaces.

**Interface palette notes:** the brand is green, so success overlaps the brand hue. Per the overlap rule, success keeps hue 160 and brightness and raises saturation from 68 to 84. Warning and danger do not overlap and use the course defaults. A very dark brand base (B17) means brand surfaces use `base`, and brand text uses `dark` (light mode) or `bright` (dark mode).

**Contrast:** all 36 checked pairs pass WCAG, with no failures to fix. Text default is 17.5:1 on the page in both modes. Subtle text is 6.1:1 in light and 7.6:1 in dark. Tone pairs (dark on light) are 7.0 to 7.4:1.

Semantic tokens (text, bg, border, icon) alias primitives in `semantic.json`, with light and dark values. Think low contrast and high contrast, not light and dark.

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
Palette: brand color supplied by the designer as hex (no inspo-page or Adobe wheel pairing recorded). Font: Montserrat chosen directly by the designer.

## Governance
- **MVP:** ship these foundations, then add tokens only for real use cases.
- **Naming:** one shared word list (text/bg/border/icon); reuse words, avoid synonyms.
- **Change process:** (1) describe the use case existing tokens cannot cover; (2) check overlap, and extend or alias before adding; (3) add to the semantic layer with every mode, verify contrast, update the test screen; (4) record the decision here; (5) deprecate with a `deprecated/` prefix, migrate, then remove.
- **Test screen:** keep one (headline + subtext, card, borders, icons, success/warning/danger) and run it in light and dark after any token change.
- **Audit:** look for raw hex or primitives in components, tokens identical in all modes, missing dark pairs, failing contrast, unscoped variables, and off-vocabulary names.
