import type { ReactNode } from "react";
import { metres } from "@/lib/format";

export type StatProps = {
  label: string;
  /** Metres. A negative number is shown in the danger colour. */
  value: number;
  /** Small note under the number, e.g. "Never negative". */
  hint?: ReactNode;
  /** lg is for the headline balance on a stock card. */
  size?: "md" | "lg";
  className?: string;
};

/** One labelled metres figure (On hand, Actual balance, Reserve balance ...). Turns red when negative. */
export function Stat({ label, value, hint, size = "md", className = "" }: StatProps) {
  return (
    <div className={`grid gap-1 ${className}`}>
      <span className="body-4-semibold text-fg-subtle">{label}</span>
      <span className={`${size === "lg" ? "heading-1" : "heading-3"} ${value < 0 ? "text-fg-danger" : "text-fg"}`}>{metres(value)}</span>
      {hint && <span className="body-4 text-fg-subtle">{hint}</span>}
    </div>
  );
}
