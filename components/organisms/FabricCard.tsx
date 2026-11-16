import { Card } from "../atoms/Card";
import { Pill } from "../atoms/Pill";
import { Stat } from "../molecules/Stat";
import { metres } from "@/lib/format";

export type FabricCardProps = {
  /** Internal fabric code, e.g. HO5D. */
  code: string;
  /** Supplier, collection and colour. */
  description: string;
  onHand: number;
  /** On hand less unfinished worksheet metres. Never negative. */
  actualBalance: number;
  /** Actual balance less waiting lines and reservations. May be negative. */
  reserveBalance: number;
  /** Metres on confirmed lines waiting for stock. Shows a badge when above 0. */
  waiting?: number;
  /** Makes the card a link to the fabric's stock card. */
  href?: string;
};

/**
 * One fabric in the overview list, with both balances. The card fills its column; lay cards out in a grid
 * of one column on mobile, two on tablet and three on desktop (`grid gap-3 md:grid-cols-2 lg:grid-cols-3`).
 */
export function FabricCard({ code, description, onHand, actualBalance, reserveBalance, waiting = 0, href }: FabricCardProps) {
  return (
    <Card href={href} className="md:p-5">
      <div className="grid gap-3">
      <div className="flex items-start justify-between gap-2">
        <div className="grid min-w-0">
          <span className="heading-4 text-fg">{code}</span>
          <span className="body-3 truncate text-fg-subtle">{description}</span>
        </div>
        {reserveBalance < 0 ? <Pill tone="danger">Short</Pill> : waiting > 0 ? <Pill tone="warning">Waiting</Pill> : null}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Stat label="Actual balance" value={actualBalance} />
        <Stat label="Reserve balance" value={reserveBalance} />
      </div>
      <span className="body-4 text-fg-subtle">
        On hand {metres(onHand)}
        {waiting > 0 && ` · Waiting for stock ${metres(waiting)}`}
      </span>
      </div>
    </Card>
  );
}
