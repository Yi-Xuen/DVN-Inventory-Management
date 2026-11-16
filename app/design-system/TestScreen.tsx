import { Home2, Box, TickCircle, Warning2, CloseCircle, SearchNormal1 } from "iconsax-react";

const swatch = ["50","100","200","300","400","500","600","700","800","900","950"];
const spaces = [1, 2, 3, 4, 5, 6, 8, 10, 12, 16];
const radii = [0, 1, 2, 3, 4, 6];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="heading-3">{title}</h2>
      {children}
    </section>
  );
}

function Status({ kind, label, Icon }: { kind: "success" | "warning" | "danger"; label: string; Icon: typeof TickCircle }) {
  const cls = {
    success: "bg-success-tint border-line-success text-fg [--ic:var(--icon-success)]",
    warning: "bg-warning-tint border-line-warning text-fg [--ic:var(--icon-warning)]",
    danger: "bg-danger-tint border-line-danger text-fg [--ic:var(--icon-danger)]",
  }[kind];
  return (
    <div className={`flex items-center gap-3 rounded-ds-2 border p-4 ${cls}`}>
      <Icon size={24} variant="Bold" color="var(--ic)" />
      <span className="label-2">{label}</span>
    </div>
  );
}

export function TestScreen() {
  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-12 px-4 py-8 lg:px-8 lg:py-12">
      <header className="flex flex-col gap-2">
        <h1 className="heading-1">Fabric stock, at a glance</h1>
        <p className="body-1 text-fg-subtle">Headline and subtext in Montserrat. Resize to see the mobile and desktop type sets.</p>
      </header>

      <Section title="Card, borders, icons, buttons">
        <div className="grid gap-4 md:grid-cols-2">
          <article className="flex flex-col gap-4 rounded-ds-3 border border-line bg-surface p-6 shadow-ds-1">
            <div className="flex items-center gap-3">
              <Box size={24} color="currentColor" className="text-icon" />
              <h3 className="heading-4">Roll FR-2041</h3>
            </div>
            <p className="body-2 text-fg-subtle">Linen blend, 48 m remaining. Reserved for 2 orders.</p>
            <div className="flex flex-wrap gap-2">
              <button className="label-2 flex items-center gap-2 rounded-ds-2 bg-brand px-4 py-3 text-fg-on-brand">
                <Home2 size={20} variant="Bold" color="currentColor" /> Reserve
              </button>
              <button className="label-2 flex items-center gap-2 rounded-ds-2 border border-line-strong px-4 py-3">
                <SearchNormal1 size={20} color="currentColor" className="text-icon-subtle" /> Details
              </button>
              <button disabled className="label-2 rounded-ds-2 border border-line-subtle px-4 py-3 text-fg-disabled">Disabled</button>
            </div>
          </article>
          <article className="flex flex-col gap-2 rounded-ds-3 bg-raised p-6">
            <h3 className="heading-4">Raised surface</h3>
            <p className="body-3 text-fg-subtle">Uses bg-surface-raised with no border. The card beside it uses bg-surface with shadow-1.</p>
            <p className="body-4 text-fg-disabled">Disabled text, Body 4</p>
          </article>
        </div>
      </Section>

      <Section title="Status states">
        <div className="grid gap-3 md:grid-cols-3">
          <Status kind="success" label="Reserved" Icon={TickCircle} />
          <Status kind="warning" label="Low stock" Icon={Warning2} />
          <Status kind="danger" label="Out of stock" Icon={CloseCircle} />
        </div>
      </Section>

      <Section title="Type scale">
        <div className="flex flex-col gap-3 rounded-ds-3 border border-line bg-surface p-6">
          <p className="heading-1">Heading 1</p><p className="heading-2">Heading 2</p><p className="heading-3">Heading 3</p>
          <p className="heading-4">Heading 4</p><p className="heading-5">Heading 5</p>
          <p className="body-1">Body 1 regular</p><p className="body-2">Body 2 regular <b className="font-semibold">semibold</b> <b className="font-bold">bold</b></p>
          <p className="body-3">Body 3</p><p className="body-4">Body 4</p>
          <p className="label-1">Label 1</p><p className="label-2">Label 2</p><p className="label-3">Label 3</p>
        </div>
      </Section>

      <Section title="Neutrals">
        <div className="grid grid-cols-6 gap-2 md:grid-cols-11">
          {swatch.map((s) => (
            <div key={s} className="flex flex-col gap-1">
              <div className="h-12 rounded-ds-1 border border-line-subtle" style={{ background: `var(--neutral-${s})` }} />
              <span className="body-4 text-fg-subtle">{s}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Spacing, radius, shadow">
        <div className="flex flex-wrap items-end gap-4">
          {spaces.map((n) => (
            <div key={n} className="flex flex-col items-center gap-1">
              <div className="bg-brand" style={{ width: `var(--space-${n})`, height: `var(--space-${n})` }} />
              <span className="body-4 text-fg-subtle">{n}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-4">
          {radii.map((n) => (
            <div key={n} className="flex size-16 items-center justify-center border border-line-strong bg-surface body-4" style={{ borderRadius: `var(--radius-${n})` }}>{n}</div>
          ))}
          <div className="flex size-16 items-center justify-center rounded-full border border-line-strong bg-surface body-4">full</div>
        </div>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-5">
          {[1, 2, 3, 4, 5].map((n) => (
            <div key={n} className="flex h-20 items-center justify-center rounded-ds-3 bg-surface body-3" style={{ boxShadow: `var(--shadow-${n})` }}>shadow-{n}</div>
          ))}
        </div>
      </Section>
    </main>
  );
}
