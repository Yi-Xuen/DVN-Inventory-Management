import { Pill, type PillProps } from "./Pill";

/** Where a reservation or worksheet line is in the job flow. */
export type Status = "reserved" | "waiting" | "confirmed" | "in_progress" | "completed" | "cancelled";

export const STATUS: Record<Status, { label: string; tone: NonNullable<PillProps["tone"]> }> = {
  reserved: { label: "Reserved", tone: "neutral" },
  waiting: { label: "Waiting for stock", tone: "warning" },
  confirmed: { label: "Confirmed", tone: "primary" },
  in_progress: { label: "Sewing in progress", tone: "primary-solid" },
  completed: { label: "Completed", tone: "success" },
  cancelled: { label: "Cancelled", tone: "soft" },
};

/** Pill with the fixed label and colour for each job status, so a status always looks the same. */
export function StatusBadge({ status, ...props }: { status: Status } & Omit<PillProps, "tone" | "children">) {
  return <Pill tone={STATUS[status].tone} {...props}>{STATUS[status].label}</Pill>;
}
