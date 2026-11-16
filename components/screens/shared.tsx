"use client";
import { useState } from "react";
import { ScanBarcode } from "iconsax-react";
import { Fabric, Job, Line, ROLLS, STATUS_LABEL, fabricName } from "@/lib/data";
import { fmt, jobMetres, useStore } from "@/lib/store";
import { go } from "@/lib/nav";
import { Card } from "../atoms/Card";
import { Icon } from "../atoms/Icon";
import { IconButton } from "../atoms/IconButton";
import { Pill } from "../atoms/Pill";
import { Alert } from "../molecules/Alert";
import { SearchBar } from "../molecules/SearchBar";
import { JobCard as JobCardView } from "../organisms/JobCard";
import { Sheet } from "../organisms/Sheet";

/** Smart search: every word typed must appear somewhere in the fabric's supplier, collection, design, colour or roll codes. */
export function matchFabric(f: Fabric, query: string) {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length === 0) return true;
  const hay = `${f.supplier} ${f.collection} ${f.design} ${f.colour} ${ROLLS.filter((r) => r.fabricId === f.id).map((r) => r.code).join(" ")}`.toLowerCase();
  return words.every((w) => hay.includes(w));
}

/** Confirmed and worksheet lines that stock cannot cover yet. */
export function backorderLines(jobs: Job[], covered: Set<string>): { job: Job; line: Line }[] {
  return jobs
    .filter((j) => j.stage === "confirmed" || j.stage === "worksheet")
    .flatMap((j) => j.lines.filter((l) => !covered.has(l.id)).map((line) => ({ job: j, line })));
}

/** What the job is doing right now, in the words staff use. */
export function stageLabel(j: Job) {
  if (j.stage === "worksheet") return j.ws === "sewing" ? "Sewing in progress" : "Queued for sewing";
  if (j.stage === "used") return "Done";
  return STATUS_LABEL[j.stage];
}

/** One fabric in a list: name, supplier, and what is free or short. */
export function FabricRow({ f, sub, pill }: { f: Fabric; sub?: string; pill?: React.ReactNode }) {
  const { stats } = useStore();
  const s = stats(f.id);
  return (
    <Card href={`#/fabric/${f.id}`}>
      <div className="flex items-center justify-between gap-3">
        <div className="grid min-w-0">
          <span className="body-2-semibold truncate text-fg">{fabricName(f)}</span>
          <span className="body-3 truncate text-fg-subtle">{sub ?? `${f.supplier} · ${s.rolls} ${s.rolls === 1 ? "roll" : "rolls"}`}</span>
        </div>
        {pill ?? (s.short > 0 ? <Pill tone="danger">Short {fmt(s.short)}</Pill> : <Pill tone="neutral">{fmt(s.avail)} free</Pill>)}
      </div>
    </Card>
  );
}

/** One job in a list, filled from the store. Pass `fabricId` on a fabric page to show only that fabric's lines. */
export function JobCard({ j, fabricId }: { j: Job; fabricId?: string }) {
  const { covered, fabric } = useStore();
  const lines = fabricId ? j.lines.filter((l) => l.fabricId === fabricId) : j.lines;
  const isUsed = j.stage === "used";
  const badges = (
    <>
      {j.stage === "proposal" && j.likelihood && <Pill tone="soft">{j.likelihood}</Pill>}
      {j.wsNo !== undefined && <Pill tone="soft">WS {j.wsNo}</Pill>}
    </>
  );
  return (
    <JobCardView
      href={`#/job/${j.id}`}
      customer={j.customer}
      location={j.location}
      by={j.by}
      handover={j.handover}
      completed={j.completed}
      status={j.ws === "draft" ? "Worksheet draft" : j.stage === "worksheet" ? stageLabel(j) : undefined}
      badges={badges}
      fabrics={lines.map((l) => {
        const f = fabric(l.fabricId);
        return {
          name: f ? fabricName(f) : "Fabric",
          metres: l.metres,
          note: isUsed ? (l.rolls?.length ? `Rolls ${l.rolls.join(", ")}` : "Rolls not recorded") : undefined,
          backorder: !isUsed && !covered.has(l.id),
        };
      })}
    />
  );
}

/** Search box with the small Scan QR button beside it. */
export function SearchRow({ value, onChange, onScan, placeholder }: { value: string; onChange: (v: string) => void; onScan: () => void; placeholder?: string }) {
  return (
    <div className="flex items-center gap-2">
      <SearchBar value={value} onChange={onChange} placeholder={placeholder ?? "Supplier, collection, colour"} className="min-w-0 flex-1" />
      <IconButton aria-label="Scan QR" variant="field" onClick={onScan} className="size-12"><Icon icon={ScanBarcode} /></IconButton>
    </div>
  );
}

/** Lets the user choose one fabric. Used for the pretend QR scan and for starting a reservation from Jobs. */
export function PickFabricSheet({ open, title, note, onPick, onClose }: { open: boolean; title: string; note?: string; onPick: (f: Fabric) => void; onClose: () => void }) {
  const { fabrics, stats } = useStore();
  const [q, setQ] = useState("");
  const list = fabrics.filter((f) => matchFabric(f, q));
  return (
    <Sheet open={open} onClose={onClose} title={title}>
      <div className="grid gap-3">
        {note && <Alert title={note} />}
        <SearchBar value={q} onChange={setQ} placeholder="Supplier, collection, colour" />
        <div className="grid gap-2">
          {list.map((f) => (
            <button key={f.id} type="button" onClick={() => onPick(f)} className="flex min-h-14 cursor-pointer items-center justify-between gap-3 rounded-ds-2 border border-line px-3 py-2 text-left active:bg-raised">
              <span className="grid min-w-0">
                <span className="body-2-semibold truncate text-fg">{fabricName(f)}</span>
                <span className="body-3 truncate text-fg-subtle">{f.supplier}</span>
              </span>
              <span className="body-3-semibold shrink-0 whitespace-nowrap text-fg-subtle">{stats(f.id).short > 0 ? `Short ${fmt(stats(f.id).short)}` : `${fmt(stats(f.id).avail)} free`}</span>
            </button>
          ))}
          {list.length === 0 && <p className="sub">No fabric matches that search.</p>}
        </div>
      </div>
    </Sheet>
  );
}

/** The prototype has no camera, so "scanning" means picking the fabric the code would open. */
export function ScanSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <PickFabricSheet
      open={open}
      title="Scan QR"
      note="The prototype has no camera. Pick the fabric whose QR code you are scanning."
      onClose={onClose}
      onPick={(f) => { onClose(); go(`fabric/${f.id}`); }}
    />
  );
}

export { jobMetres };
