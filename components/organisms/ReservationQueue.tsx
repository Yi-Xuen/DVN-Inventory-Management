"use client";
import { ClipboardText } from "iconsax-react";
import { Button } from "../atoms/Button";
import { EmptyState } from "../molecules/EmptyState";
import { ListRow } from "../molecules/ListRow";
import { metres } from "@/lib/format";

export type Reservation = {
  id: string;
  customer: string;
  salesperson: string;
  metres: number;
  /** How old it is, e.g. "3 days ago". */
  age: string;
  /** True when the signed-in salesperson made it and may cancel it. */
  mine?: boolean;
};

export type ReservationQueueProps = {
  /** Oldest first: reservations are served first come, first served. */
  reservations: Reservation[];
  onCancel?: (id: string) => void;
};

/** Open reservations for one fabric in queue order, each with its age so old ones can be reviewed. */
export function ReservationQueue({ reservations, onCancel }: ReservationQueueProps) {
  const total = reservations.reduce((sum, r) => sum + r.metres, 0);
  return (
    <section aria-label="Reservations" className="grid">
      <div className="flex items-baseline justify-between gap-2 border-b border-line pb-2">
        <h2 className="heading-4 text-fg">Reservations</h2>
        <span className="body-3 text-fg-subtle">{reservations.length} open · {metres(total)}</span>
      </div>
      {reservations.length === 0 ? (
        <EmptyState icon={ClipboardText} title="No reservations" description="Nobody has reserved this fabric for a quotation yet." />
      ) : (
        <ol className="m-0 list-none divide-y divide-line-subtle p-0">
          {reservations.map((r, i) => (
            <li key={r.id}>
              <ListRow
                leading={<span className="body-4-semibold inline-grid size-8 place-items-center rounded-full bg-raised text-fg" aria-label={`Number ${i + 1} in the queue`}>{i + 1}</span>}
                title={r.customer}
                subtitle={`${r.salesperson} · ${r.age}`}
                value={metres(r.metres)}
                trailing={r.mine && onCancel ? <Button variant="danger" size="sm" fullWidth={false} onClick={() => onCancel(r.id)}>Cancel</Button> : undefined}
              />
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
