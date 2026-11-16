"use client";
import { Scissor } from "iconsax-react";
import { Button } from "../atoms/Button";
import { StatusBadge } from "../atoms/StatusBadge";
import { EmptyState } from "../molecules/EmptyState";
import { metres } from "@/lib/format";

export type FactoryJob = {
  /** Worksheet item number, e.g. 1001-2. */
  itemNo: string;
  customer: string;
  room: string;
  fabricCode: string;
  fabricName: string;
  /** Metres sales confirmed. */
  confirmed: number;
  /** The factory only ever sees these two statuses. Waiting lines are hidden from it. */
  status: "confirmed" | "in_progress";
};

export type FactoryWorkListProps = {
  jobs: FactoryJob[];
  /** Marks a confirmed line as sewing in progress. */
  onStart: (itemNo: string) => void;
  /** Opens the cut form for a line in progress. */
  onLogCut: (itemNo: string) => void;
};

/**
 * The factory's open worksheet lines, each with its one next action.
 * One column on mobile, two on tablet and three on desktop.
 */
export function FactoryWorkList({ jobs, onStart, onLogCut }: FactoryWorkListProps) {
  if (jobs.length === 0) {
    return <EmptyState icon={Scissor} title="Nothing to cut" description="New worksheet lines appear here as soon as sales confirm them." />;
  }
  return (
    <ul className="m-0 grid list-none gap-3 p-0 md:grid-cols-2 lg:grid-cols-3">
      {jobs.map((job) => (
        <li key={job.itemNo} className="grid content-start gap-3 rounded-ds-3 bg-surface p-4 shadow-ds-1">
          <div className="flex items-center justify-between gap-2">
            <span className="heading-4 text-fg">{job.itemNo}</span>
            <StatusBadge status={job.status} />
          </div>
          <div className="grid">
            <span className="body-2-semibold text-fg">{job.fabricCode} · {metres(job.confirmed)}</span>
            <span className="body-3 truncate text-fg-subtle">{job.fabricName}</span>
            <span className="body-3 truncate text-fg-subtle">{job.customer} · {job.room}</span>
          </div>
          {job.status === "confirmed" ? (
            <Button variant="secondary" onClick={() => onStart(job.itemNo)}>Start sewing</Button>
          ) : (
            <Button onClick={() => onLogCut(job.itemNo)}>Log cut</Button>
          )}
        </li>
      ))}
    </ul>
  );
}
