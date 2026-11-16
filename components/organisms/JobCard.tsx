import type { ReactNode } from "react";
import { Danger } from "iconsax-react";
import { Card } from "../atoms/Card";
import { Divider } from "../atoms/Divider";
import { Icon } from "../atoms/Icon";
import { metres } from "@/lib/format";

export type JobCardFabric = {
  /** Fabric name, e.g. "Soft Blackout - 1065 white". */
  name: string;
  /** Metres for this fabric in the job. */
  metres: number;
  /** Small note under the name, e.g. the rolls a finished job was cut from. */
  note?: string;
  /** Stock cannot cover this fabric yet: a small alert icon and danger-coloured metres mark it (the icon is announced as backorder). */
  backorder?: boolean;
};

export type JobCardProps = {
  customer: string;
  location: string;
  /** Salesperson who made the job. */
  by: string;
  /** Planned handover, e.g. "Feb 2027". Leave out when not set. */
  handover?: string | null;
  /** Shown instead of the handover line for a finished job, e.g. "30 Oct 2026". */
  completed?: string;
  /** Where a worksheet is, e.g. "Sewing in progress". Added to the end of the muted line. */
  status?: string;
  /** Pills at the top right: the likelihood for a proposal, the worksheet number ("WS 1045") once there is one. */
  badges?: ReactNode;
  /** One row per fabric in the job. */
  fabrics: JobCardFabric[];
  /** Makes the whole card a link to the job. */
  href?: string;
};

/**
 * One job in a list: who it is for, one muted line with who reserved it, when it is due and where it is, then each fabric with its metres.
 * Mobile-first and a single column of content at every size; lay cards out in a grid of one column on mobile,
 * two on tablet and three on desktop (`grid gap-3 md:grid-cols-2 lg:grid-cols-3`).
 */
export function JobCard({ customer, location, by, handover, completed, status, badges, fabrics, href }: JobCardProps) {
  return (
    <Card href={href} className="md:p-5">
      <div className="grid gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="grid min-w-0 gap-1">
            <span className="heading-4 text-fg">{customer}, {location}</span>
            <span className="body-3 text-fg-subtle">
              {[by, completed ? `Completed ${completed}` : handover ? `Handover ${handover}` : "Handover not set", status].filter(Boolean).join(" · ")}
            </span>
          </div>
          {badges && <span className="flex shrink-0 flex-wrap justify-end gap-1">{badges}</span>}
        </div>

        <Divider />

        <ul className="m-0 grid list-none gap-3 p-0">
          {fabrics.map((f, i) => (
            <li key={`${f.name}-${i}`} className="flex items-start justify-between gap-3">
              <span className="grid min-w-0">
                <span className="body-3 text-fg">{f.name}</span>
                {f.note && <span className="body-4 text-fg-subtle">{f.note}</span>}
              </span>
              <span className={`body-3-semibold flex shrink-0 items-center gap-1 whitespace-nowrap ${f.backorder ? "text-fg-danger" : "text-fg"}`}>
                {f.backorder && <Icon icon={Danger} size={4} bold className="text-icon-danger" label="Backorder" />}
                {metres(f.metres)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
