import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { Box } from 'iconsax-react';
import primitives from './tokens/primitives.json';
import semantic from './tokens/semantic.json';
import typography from './tokens/typography.json';
import spacing from './tokens/spacing.json';
import radius from './tokens/radius.json';
import iconSize from './tokens/icon-size.json';

type Leaf = { $value: string; hsb?: number[] };
const isLeaf = (v: unknown): v is Leaf => typeof v === 'object' && v !== null && '$value' in v;

/** Flatten a nested token tree into [dotted.path, leaf] pairs. */
function flatten(tree: Record<string, unknown>, path: string[] = []): [string, Leaf][] {
  return Object.entries(tree).flatMap(([k, v]) =>
    isLeaf(v) ? [[[...path, k].join('.'), v] as [string, Leaf]] : flatten(v as Record<string, unknown>, [...path, k]),
  );
}

const Section = ({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) => (
  <section className="flex flex-col gap-4">
    <div className="flex flex-col gap-1">
      <h2 className="heading-3">{title}</h2>
      {note && <p className="body-3 text-fg-subtle">{note}</p>}
    </div>
    {children}
  </section>
);

const Page = ({ children }: { children: React.ReactNode }) => (
  <div className="font-ds min-h-screen bg-page p-4 text-fg lg:p-8">
    <div className="mx-auto flex max-w-5xl flex-col gap-10">{children}</div>
  </div>
);

const meta = {
  title: 'Design tokens',
  tags: ['ai-generated'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const Swatch = ({ name, hex, hsb }: { name: string; hex: string; hsb?: number[] }) => (
  <div className="flex flex-col gap-2">
    <div className="h-14 rounded-ds-2 border border-line-subtle" style={{ background: hex }} />
    <div>
      <p className="body-4-semibold break-all">{name}</p>
      <p className="body-4 text-fg-subtle">{hex}{hsb ? ` · ${hsb.join('/')}` : ''}</p>
    </div>
  </div>
);

export const Colors: Story = {
  render: () => {
    const prim = flatten(primitives as Record<string, unknown>);
    const group = (prefix: string) => prim.filter(([n]) => n.startsWith(prefix));
    const sem = flatten(semantic as Record<string, unknown>);
    const primHex = Object.fromEntries(prim.map(([n, l]) => [n, l.$value]));
    const lookup = (name: string) => primHex[name] ?? '#000000';
    return (
      <Page>
        <Section title="Brand" note="Hue 160 from the chosen colour #0E2C22 (brand.900), 50 to 950, same scale system as the neutrals.">
          <div className="grid grid-cols-3 gap-4 md:grid-cols-6">
            {group('brand').map(([n, l]) => <Swatch key={n} name={n} hex={l.$value} hsb={l.hsb} />)}
          </div>
        </Section>
        <Section title="Neutrals" note="Hue 39 (warm tan from #C6A463) at low saturation, 50 to 950.">
          <div className="grid grid-cols-3 gap-4 md:grid-cols-6">
            {group('neutral').map(([n, l]) => <Swatch key={n} name={n} hex={l.$value} hsb={l.hsb} />)}
          </div>
        </Section>
        <Section title="Interface" note="Success shares the brand hue at higher saturation. Warning and danger use the course defaults.">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {['success', 'warning', 'danger'].flatMap((g) => group(g)).map(([n, l]) => <Swatch key={n} name={n} hex={l.$value} hsb={l.hsb} />)}
          </div>
        </Section>
        <Section title="Chart" note="Chart fills, one tone per mode: base for light mode and bright for dark mode. Hues follow #95CAF3 (206°) and #DC95F3 (285°), deepened in light mode to reach about 3:1 on the page.">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {group('chart').map(([n, l]) => <Swatch key={n} name={n} hex={l.$value} hsb={l.hsb} />)}
          </div>
        </Section>
        <Section title="Semantic tokens" note="Each token aliases a primitive per mode. Light and dark are shown side by side; the swatches do not depend on the Theme toolbar.">
          {['text', 'bg', 'border', 'icon', 'chart'].map((cat) => (
            <div key={cat} className="overflow-x-auto rounded-ds-3 border border-line bg-surface">
              <table className="w-full min-w-[560px] text-left">
                <thead>
                  <tr className="body-4-semibold text-fg-subtle">
                    <th className="p-3">{cat}</th><th className="p-3">Light mode</th><th className="p-3">Dark mode</th>
                  </tr>
                </thead>
                <tbody>
                  {sem.filter(([n]) => n.startsWith(`${cat}.`)).map(([n, l]) => {
                    const v = l.$value as unknown as { light: string; dark: string };
                    return (
                      <tr key={n} className="border-t border-line-subtle">
                        <td className="body-3-semibold p-3">{n}</td>
                        {([v.light, v.dark] as const).map((ref, i) => {
                          const prim = ref.replace(/[{}]/g, '');
                          const hex = lookup(prim);
                          return (
                            <td key={i} className="p-3">
                              <div className="flex items-center gap-3">
                                <div className="size-8 shrink-0 rounded-ds-1 border border-line" style={{ background: hex }} />
                                <div>
                                  <p className="body-4-semibold">{prim}</p>
                                  <p className="body-4 text-fg-subtle">{hex}</p>
                                </div>
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ))}
        </Section>
      </Page>
    );
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { name: 'Semantic tokens' })).toBeVisible();
    await expect((await canvas.findAllByText('neutral.950')).length).toBeGreaterThan(0);
  },
};

const STYLES = [
  ...['1', '2', '3', '4', '5'].map((n) => ({ key: `heading-${n}`, sample: 'Soft Blackout - 1065 white' })),
  ...['1', '2', '3', '4'].flatMap((n) => [
    { key: `body-${n}`, sample: 'On hand, minus worksheet, minus confirmed' },
    { key: `body-${n}-semibold`, sample: 'On hand, minus worksheet, minus confirmed' },
    { key: `body-${n}-bold`, sample: 'On hand, minus worksheet, minus confirmed' },
  ]),
  ...['1', '2', '3'].map((n) => ({ key: `label-${n}`, sample: 'Reserve this fabric' })),
];

export const Typography: Story = {
  render: () => {
    const mobile = typography.typography.mobile as Record<string, { $value: { fontSize: string; lineHeight: string; fontWeight: number; letterSpacing: string } }>;
    const desktop = typography.typography.desktop as typeof mobile;
    return (
      <Page>
        <Section title="Typography" note="Montserrat only, weights 400 / 600 / 700. Headings change between mobile and desktop at 1024px; body and labels do not.">
          <div className="overflow-x-auto rounded-ds-3 border border-line bg-surface">
            <table className="w-full min-w-[640px] text-left">
              <thead>
                <tr className="body-4-semibold text-fg-subtle">
                  <th className="p-3">Style</th><th className="p-3">Mobile</th><th className="p-3">Desktop</th><th className="p-3">Weight</th><th className="p-3">Sample</th>
                </tr>
              </thead>
              <tbody>
                {STYLES.map(({ key, sample }) => (
                  <tr key={key} className="border-t border-line-subtle align-baseline">
                    <td className="body-3-semibold p-3">{key}</td>
                    <td className="body-3 p-3 text-fg-subtle">{mobile[key].$value.fontSize} / {mobile[key].$value.lineHeight}</td>
                    <td className="body-3 p-3 text-fg-subtle">{desktop[key].$value.fontSize} / {desktop[key].$value.lineHeight}</td>
                    <td className="body-3 p-3 text-fg-subtle">{mobile[key].$value.fontWeight}</td>
                    <td className={`${key} p-3`}>{sample}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      </Page>
    );
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('heading-1')).toBeVisible();
  },
};

export const Spacing: Story = {
  render: () => (
    <Page>
      <Section title="Spacing" note="4px base unit. The number is the multiplier: space-6 = 6 × 4 = 24px. In Tailwind these match p-6, gap-6 and so on.">
        <div className="flex flex-col gap-2 rounded-ds-3 border border-line bg-surface p-4">
          {flatten(spacing as Record<string, unknown>).map(([n, l]) => (
            <div key={n} className="flex items-center gap-4">
              <span className="body-3-semibold w-24">space-{n.split('.')[1]}</span>
              <span className="body-3 w-16 text-fg-subtle">{l.$value}</span>
              <div className="h-4 bg-brand" style={{ width: l.$value }} />
            </div>
          ))}
        </div>
      </Section>
    </Page>
  ),
};

export const Radius: Story = {
  render: () => (
    <Page>
      <Section title="Border radius" note="Multiples of 4. Inner radius = max(0, outer radius − padding), so nested corners stay even.">
        <div className="flex flex-wrap gap-6">
          {flatten(radius as Record<string, unknown>).map(([n, l]) => (
            <div key={n} className="flex flex-col items-center gap-2">
              <div className="size-20 border-2 border-line-strong bg-surface" style={{ borderRadius: l.$value }} />
              <span className="body-4-semibold">radius-{n.split('.')[1]}</span>
              <span className="body-4 text-fg-subtle">{l.$value}</span>
            </div>
          ))}
        </div>
      </Section>
    </Page>
  ),
};

export const Icons: Story = {
  render: () => (
    <Page>
      <Section title="Icons" note="Iconsax, Linear (default) and Bold (active/selected) only. Sizes are multiples of 4.">
        <div className="flex flex-wrap items-end gap-8 rounded-ds-3 border border-line bg-surface p-6">
          {flatten(iconSize as Record<string, unknown>).map(([n, l]) => {
            const px = parseInt(l.$value, 10);
            return (
              <div key={n} className="flex flex-col items-center gap-2">
                <div className="flex gap-2 text-icon">
                  <Box size={px} color="currentColor" />
                  <Box size={px} variant="Bold" color="currentColor" />
                </div>
                <span className="body-4-semibold">icon-size-{n.split('.')[1]}</span>
                <span className="body-4 text-fg-subtle">{l.$value}</span>
              </div>
            );
          })}
        </div>
      </Section>
    </Page>
  ),
};

export const Shadows: Story = {
  render: () => (
    <Page>
      <Section title="Shadows" note="Five elevation levels in neutral.950 (never black). Dark mode doubles the opacity.">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          {[1, 2, 3, 4, 5].map((n) => (
            <div key={n} className="flex h-24 items-center justify-center rounded-ds-3 bg-surface body-3-semibold" style={{ boxShadow: `var(--shadow-${n})` }}>
              shadow-{n}
            </div>
          ))}
        </div>
      </Section>
    </Page>
  ),
};

export const ColorsDark: Story = { ...Colors, globals: { theme: 'dark' } };
