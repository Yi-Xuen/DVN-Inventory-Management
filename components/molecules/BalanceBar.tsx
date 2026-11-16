import { metres } from "@/lib/format";

export type BalanceBarProps = {
  /** Metres physically in stock. The bar's full width. */
  onHand: number;
  /** Metres on worksheet lines not yet completed. */
  worksheet: number;
  /** Metres on confirmed lines that are waiting for stock. */
  waiting: number;
  /** Metres on open reservations (estimates). */
  reserved: number;
  className?: string;
};

const PARTS = [
  { key: "worksheet", label: "Worksheet", swatch: "bg-chart-blue" },
  { key: "waiting", label: "Waiting for stock", swatch: "bg-chart-purple" },
  { key: "reserved", label: "Reserved", swatch: "bg-line-warning" },
  { key: "free", label: "Free", swatch: "bg-primary" },
] as const;

/**
 * Shows how the metres on hand are spoken for. If more is promised than is on hand, the bar is full
 * and a danger note states the shortfall. The legend is one column on mobile, two on tablet, four on desktop.
 */
export function BalanceBar({ onHand, worksheet, waiting, reserved, className = "" }: BalanceBarProps) {
  const committed = worksheet + waiting + reserved;
  const free = Math.max(0, onHand - committed);
  const shortfall = Math.max(0, committed - onHand);
  const values = { worksheet, waiting, reserved, free };
  const total = Math.max(onHand, committed) || 1;
  return (
    <div className={`grid gap-3 ${className}`}>
      <div
        role="img"
        aria-label={`Of ${metres(onHand)} on hand: ${PARTS.map((p) => `${p.label} ${metres(values[p.key])}`).join(", ")}`}
        className="flex h-3 gap-1 overflow-hidden rounded-ds-1 bg-raised"
      >
        {PARTS.filter((p) => values[p.key] > 0).map((p) => (
          <i key={p.key} className={`block h-full ${p.swatch}`} style={{ width: `${(values[p.key] / total) * 100}%` }} />
        ))}
      </div>
      <dl className="body-3 m-0 grid gap-x-6 gap-y-1 md:grid-cols-2 lg:grid-cols-4">
        {PARTS.map((p) => (
          <div key={p.key} className="flex items-center gap-2">
            <span aria-hidden="true" className={`size-3 shrink-0 rounded-ds-1 ${p.swatch}`} />
            <dt className="text-fg-subtle">{p.label}</dt>
            <dd className="body-3-semibold m-0 ml-auto text-fg lg:ml-0">{metres(values[p.key])}</dd>
          </div>
        ))}
      </dl>
      {shortfall > 0 && (
        <p className="body-3-semibold rounded-ds-2 bg-danger-tint p-2 text-fg-danger">
          Short by {metres(shortfall)}. Buy at least this much to cover everything promised.
        </p>
      )}
    </div>
  );
}
