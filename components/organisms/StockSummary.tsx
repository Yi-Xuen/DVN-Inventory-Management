import { Card } from "../atoms/Card";
import { BalanceBar } from "../molecules/BalanceBar";
import { Stat } from "../molecules/Stat";

export type StockSummaryProps = {
  /** Metres physically in stock. */
  onHand: number;
  /** Metres on worksheet lines not yet completed. */
  worksheet: number;
  /** Metres on confirmed lines waiting for stock. */
  waiting: number;
  /** Metres on open reservations. */
  reserved: number;
};

/**
 * The six balance figures for one fabric, calculated from four inputs:
 * actual balance = on hand − worksheet; reserve balance = actual − waiting − reserved.
 * Mobile-first: the two balances on top, then the other four in two columns (four from tablet).
 * On desktop the balances sit beside the other figures.
 */
export function StockSummary({ onHand, worksheet, waiting, reserved }: StockSummaryProps) {
  const actual = onHand - worksheet;
  const reserve = actual - waiting - reserved;
  return (
    <Card className="md:p-6">
      <div className="grid gap-4 lg:grid-cols-2 lg:items-start lg:gap-x-8">
      <div className="grid grid-cols-2 gap-3">
        <Stat size="lg" label="Actual balance" value={actual} hint="Free to promise or cut" />
        <Stat size="lg" label="Reserve balance" value={reserve} hint={reserve < 0 ? "Fabric must be bought" : "After waiting and reserved"} />
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="On hand" value={onHand} />
        <Stat label="Worksheet" value={worksheet} />
        <Stat label="Waiting for stock" value={waiting} />
        <Stat label="Reserved" value={reserved} />
      </div>
      <BalanceBar onHand={onHand} worksheet={worksheet} waiting={waiting} reserved={reserved} className="lg:col-span-2" />
      </div>
    </Card>
  );
}
