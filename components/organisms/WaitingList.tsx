import { StatusBadge } from "../atoms/StatusBadge";
import { ListRow } from "../molecules/ListRow";
import { metres } from "@/lib/format";

export type WaitingLine = {
  /** Worksheet item number, e.g. 1001-2. */
  itemNo: string;
  customer: string;
  room: string;
  metres: number;
  /** How long it has waited, e.g. "5 days". */
  waitingFor: string;
};

/**
 * Confirmed worksheet lines that do not fit in stock yet, oldest first. Kept apart from reservations:
 * these are firm orders. Renders nothing when there are none.
 */
export function WaitingList({ lines }: { lines: WaitingLine[] }) {
  if (lines.length === 0) return null;
  const total = lines.reduce((sum, l) => sum + l.metres, 0);
  return (
    <section aria-label="Waiting for stock" className="grid">
      <div className="flex items-baseline justify-between gap-2 border-b border-line pb-2">
        <h2 className="heading-4 text-fg">Waiting for stock</h2>
        <span className="body-3 text-fg-subtle">{lines.length} lines · {metres(total)}</span>
      </div>
      <ul className="m-0 list-none divide-y divide-line-subtle p-0">
        {lines.map((l) => (
          <li key={l.itemNo}>
            <ListRow
              title={`${l.customer} · ${l.room}`}
              subtitle={`Worksheet ${l.itemNo} · waiting ${l.waitingFor}`}
              value={metres(l.metres)}
              trailing={<StatusBadge status="waiting" />}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
