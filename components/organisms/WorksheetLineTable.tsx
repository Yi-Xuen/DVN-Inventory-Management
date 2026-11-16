import { StatusBadge, type Status } from "../atoms/StatusBadge";
import { metres } from "@/lib/format";

export type WorksheetLine = {
  /** Item number, e.g. 1001-1. */
  itemNo: string;
  room: string;
  fabricCode: string;
  /** Metres entered by sales. */
  confirmed: number;
  /** Metres the factory really used. Filled in when sewing is completed. */
  actual?: number;
  status: Exclude<Status, "reserved">;
};

const dash = <span className="text-fg-subtle">–</span>;

/**
 * The lines of one worksheet, with sales' confirmed metres next to the factory's actual metres.
 * Mobile-first: a stacked card per line on mobile; a real table from tablet (md) up.
 * Cancelled lines are left out of the totals.
 */
export function WorksheetLineTable({ lines }: { lines: WorksheetLine[] }) {
  const live = lines.filter((l) => l.status !== "cancelled");
  const confirmed = live.reduce((sum, l) => sum + l.confirmed, 0);
  const actual = live.reduce((sum, l) => sum + (l.actual ?? 0), 0);
  const anyActual = live.some((l) => l.actual !== undefined);
  return (
    <div>
      {/* mobile: one card per line */}
      <ul className="m-0 grid list-none gap-2 p-0 md:hidden">
        {lines.map((l) => (
          <li key={l.itemNo} className="grid gap-2 rounded-ds-2 border border-line bg-surface p-3">
            <div className="flex items-center justify-between gap-2">
              <span className="body-2-semibold text-fg">{l.itemNo}</span>
              <StatusBadge status={l.status} />
            </div>
            <span className="body-3 text-fg-subtle">{l.room} · {l.fabricCode}</span>
            <dl className="m-0 grid grid-cols-2 gap-2">
              <div>
                <dt className="body-4-semibold text-fg-subtle">Confirmed</dt>
                <dd className="body-2-semibold m-0 text-fg">{metres(l.confirmed)}</dd>
              </div>
              <div>
                <dt className="body-4-semibold text-fg-subtle">Actual</dt>
                <dd className="body-2-semibold m-0 text-fg">{l.actual !== undefined ? metres(l.actual) : dash}</dd>
              </div>
            </dl>
          </li>
        ))}
        <li className="body-2-semibold flex justify-between gap-2 border-t border-line-strong pt-2 text-fg">
          <span>Total</span>
          <span>{metres(confirmed)} confirmed{anyActual && ` · ${metres(actual)} actual`}</span>
        </li>
      </ul>
      {/* tablet and desktop: table */}
      <table className="hidden w-full border-collapse text-left md:table">
        <thead>
          <tr className="body-4-semibold border-b border-line text-fg-subtle">
            <th scope="col" className="py-2 pr-4 font-[inherit]">Item</th>
            <th scope="col" className="py-2 pr-4 font-[inherit]">Room</th>
            <th scope="col" className="py-2 pr-4 font-[inherit]">Fabric</th>
            <th scope="col" className="py-2 pr-4 text-right font-[inherit]">Confirmed</th>
            <th scope="col" className="py-2 pr-4 text-right font-[inherit]">Actual</th>
            <th scope="col" className="py-2 font-[inherit]">Status</th>
          </tr>
        </thead>
        <tbody className="body-3 text-fg">
          {lines.map((l) => (
            <tr key={l.itemNo} className="border-b border-line-subtle">
              <th scope="row" className="body-3-semibold py-3 pr-4">{l.itemNo}</th>
              <td className="py-3 pr-4">{l.room}</td>
              <td className="py-3 pr-4">{l.fabricCode}</td>
              <td className="py-3 pr-4 text-right">{metres(l.confirmed)}</td>
              <td className="py-3 pr-4 text-right">{l.actual !== undefined ? metres(l.actual) : dash}</td>
              <td className="py-3"><StatusBadge status={l.status} /></td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="body-3-semibold text-fg">
            <th scope="row" colSpan={3} className="py-3 pr-4">Total</th>
            <td className="py-3 pr-4 text-right">{metres(confirmed)}</td>
            <td className="py-3 pr-4 text-right">{anyActual ? metres(actual) : dash}</td>
            <td />
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
