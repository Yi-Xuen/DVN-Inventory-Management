"use client";
import { Pill } from "../atoms/Pill";
import { metres } from "@/lib/format";

export type Batch = {
  /** Batch code, e.g. 2611-A. One batch is one roll. */
  code: string;
  received: number;
  remaining: number;
  /** Display date, e.g. "12 Nov 2026". */
  receivedOn: string;
  /** active = usable; remnant = short offcut, may be unusable; used = nothing left. */
  status?: "active" | "remnant" | "used";
};

export type BatchListProps = {
  batches: Batch[];
  /** Pass to make the rolls selectable (factory cut screen). */
  onSelect?: (code: string) => void;
  selected?: string;
  /** Name for the radio group when selectable. */
  name?: string;
};

/**
 * The rolls of one fabric, with metres left on each. One column on mobile, two on tablet, three on desktop.
 * With `onSelect` each roll becomes a radio option; used-up rolls cannot be picked.
 */
export function BatchList({ batches, onSelect, selected, name = "batch" }: BatchListProps) {
  return (
    <div role={onSelect ? "radiogroup" : "list"} aria-label="Rolls" className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
      {batches.map((b) => {
        const status = b.status ?? "active";
        const on = selected === b.code;
        const body = (
          <>
            <span className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-2">
                <span className="body-2-semibold text-fg">{b.code}</span>
                {status === "remnant" && <Pill tone="warning">Remnant</Pill>}
                {status === "used" && <Pill tone="soft">Used up</Pill>}
              </span>
              <span className="body-2-semibold whitespace-nowrap text-fg">{metres(b.remaining)}</span>
            </span>
            <span className="body-4 text-fg-subtle">
              Received {b.receivedOn} · {metres(b.received)}
            </span>
            <span aria-hidden="true" className="block h-1 overflow-hidden rounded-ds-1 bg-raised">
              <i className="block h-full rounded-ds-1 bg-primary" style={{ width: `${b.received ? Math.min(100, (b.remaining / b.received) * 100) : 0}%` }} />
            </span>
          </>
        );
        const box = `grid gap-2 rounded-ds-2 border bg-surface p-3 ${on ? "border-line-primary outline-2 -outline-offset-2 outline-line-primary" : "border-line"}`;
        if (!onSelect) return <div key={b.code} role="listitem" className={box}>{body}</div>;
        return (
          <label key={b.code} className={`${box} ${status === "used" ? "cursor-not-allowed opacity-50" : "cursor-pointer"} has-focus-visible:outline-2 has-focus-visible:outline-fg-primary`}>
            <input type="radio" name={name} value={b.code} checked={on} disabled={status === "used"} onChange={() => onSelect(b.code)} className="sr-only" />
            {body}
          </label>
        );
      })}
    </div>
  );
}
