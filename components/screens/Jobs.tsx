"use client";
import { useState } from "react";
import { Add } from "iconsax-react";
import { CURRENT_USER, LIKELIHOODS, Status, fabricName, handoverOptions } from "@/lib/data";
import { fmt, jobMetres, useStore } from "@/lib/store";
import { back, go } from "@/lib/nav";
import { Button } from "../atoms/Button";
import { Card } from "../atoms/Card";
import { Icon } from "../atoms/Icon";
import { Pill } from "../atoms/Pill";
import { Slider } from "../atoms/Slider";
import { Alert } from "../molecules/Alert";
import { MonthYearPicker } from "../molecules/MonthYearPicker";
import { PageTitleBar } from "../molecules/PageTitleBar";
import { SegmentedControl } from "../molecules/SegmentedControl";
import { StatTile } from "../molecules/StatTile";
import { AddFabricSheet, CancelDialog, ConfirmFlow, EditLineSheet, MergeSheet, StatusAction, UpdateStatusSheet, WorksheetFlow } from "../JobFlows";
import { ReserveSheet } from "../Sheets";
import { JobCard, PickFabricSheet, stageLabel } from "./shared";

const STAGE_TABS: { value: Status; label: string }[] = [
  { value: "proposal", label: "Proposal" }, { value: "confirmed", label: "Confirmed" },
  { value: "worksheet", label: "Worksheet" }, { value: "used", label: "Done" },
];
type Whose = "mine" | "all";
/** Remembers the last filter while the user opens a job and comes back. */
const last: { whose: Whose; stage: Status } = { whose: "mine", stage: "proposal" };

/* ---------- Jobs tab ---------- */
export function JobsHome() {
  const { jobs } = useStore();
  const [whose, setWhose] = useState<Whose>(last.whose);
  const [stage, setStage] = useState<Status>(last.stage);
  const [pick, setPick] = useState(false);
  const [reserveFor, setReserveFor] = useState<string | null>(null);

  const list = jobs.filter((j) => j.stage === stage && (whose === "all" || j.by === CURRENT_USER));
  const count = (st: Status) => jobs.filter((j) => j.stage === st && (whose === "all" || j.by === CURRENT_USER)).length;

  return (
    <>
      <PageTitleBar
        title="Jobs"
        actions={<Button size="sm" fullWidth={false} iconLeft={<Icon icon={Add} size={5} />} onClick={() => setPick(true)}>Reserve</Button>}
      />
      <SegmentedControl
        aria-label="Whose jobs"
        options={[{ value: "mine", label: "My jobs" }, { value: "all", label: "All jobs" }]}
        value={whose}
        onChange={(v) => { last.whose = v; setWhose(v); }}
      />
      <div className="grid grid-cols-2 gap-3">
        {STAGE_TABS.map((t) => (
          <StatTile key={t.value} label={t.label} value={count(t.value)} selected={stage === t.value} onClick={() => { last.stage = t.value; setStage(t.value); }} />
        ))}
      </div>
      <div className="list">
        {list.map((j) => <JobCard key={j.id} j={j} />)}
        {list.length === 0 && <p className="sub">{whose === "mine" ? "You have nothing at this stage. Switch to All jobs to see everyone's." : "Nothing at this stage."}</p>}
      </div>

      <PickFabricSheet open={pick} title="Reserve which fabric?" onClose={() => setPick(false)} onPick={(f) => { setPick(false); setReserveFor(f.id); }} />
      {reserveFor && (
        <ReserveSheet fabricId={reserveFor} onClose={() => setReserveFor(null)} onDone={(id) => { setReserveFor(null); go(`job/${id}`); }} />
      )}
    </>
  );
}

/* ---------- One job: its fabrics, its status, and what can be done next ---------- */
type Open = null | "status" | "add" | "merge" | "cancel" | { edit: string };

export function JobDetail({ id }: { id: string }) {
  const { jobs, fabric, covered, canEdit, setJobField, shareWorksheet } = useStore();
  const HANDOVER = handoverOptions();
  const [open, setOpen] = useState<Open>(null);
  const [flow, setFlow] = useState<null | "confirm" | "worksheet">(null);
  const [pickHo, setPickHo] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const j = jobs.find((x) => x.id === id);

  if (!j) return (<><PageTitleBar title="Job not found" onBack={() => back("jobs")} /><p className="sub">This job is no longer in the demo data.</p></>);
  if (j.stage === "cancelled") return (
    <>
      <PageTitleBar title={`${j.customer}, ${j.location}`} onBack={() => back("jobs")} />
      <Alert title="This job was cancelled">Its metres are free for others. The history is kept below.</Alert>
      <div className="log"><p className="cap">Updates</p>{j.log.map((l, i) => <p key={i}>{l}</p>)}</div>
    </>
  );

  const mine = canEdit(j);
  const open4edit = mine && (j.stage === "proposal" || j.stage === "confirmed");
  const canMove = mine && j.stage !== "used";
  const draft = j.ws === "draft";
  const lineEdit = typeof open === "object" && open ? j.lines.find((l) => l.id === open.edit) : undefined;
  // worksheet line numbers run across every fabric: 1046-1, 1046-2 ...
  const roomStart: Record<string, number> = {};
  let rooms = 0;
  for (const l of j.lines) { roomStart[l.id] = rooms; rooms += l.rooms?.length ?? 0; }

  const onStatus = (a: StatusAction) => {
    setOpen(null);
    if (a === "confirm") setFlow("confirm");
    if (a === "worksheet") setFlow("worksheet");
    if (a === "cancel") setOpen("cancel");
    if (a === "share") { shareWorksheet(j.id); setNote(`WS ${j.wsNo} is shared. The factory can now see it under Ready to sew.`); }
  };

  return (
    <>
      <PageTitleBar title={`${j.customer}, ${j.location}`} subtitle={j.wsNo ? `WS ${j.wsNo}` : undefined} onBack={() => back("jobs")} />
      <div className="flex flex-wrap gap-1">
        <Pill tone={j.stage === "worksheet" && j.ws === "sewing" ? "primary-solid" : "neutral"}>{stageLabel(j)}</Pill>
        {draft && <Pill tone="warning">Worksheet draft</Pill>}
        {j.stage !== "used" && j.lines.some((l) => !covered.has(l.id)) && <Pill tone="danger">Backorder</Pill>}
      </div>

      {note && <Alert tone="success" title={note} onDismiss={() => setNote(null)} />}
      {!mine && j.stage !== "used" && <Alert title={`Reserved by ${j.by}`}>Only {j.by} or an admin can change this job.</Alert>}

      <Card>
        <p className="cap">{j.lines.length === 1 ? "Fabric in this job" : `${j.lines.length} fabrics in this job`}</p>
        <div className="grid">
          {j.lines.map((l) => {
            const f = fabric(l.fabricId);
            return (
              <div key={l.id} className="grid gap-1 border-t border-line-subtle py-3 first:border-t-0">
                <div className="flex items-center justify-between gap-3">
                  <a href={`#/fabric/${l.fabricId}`} className="grid min-w-0">
                    <span className="body-2-semibold truncate text-fg underline decoration-line underline-offset-4">{f ? fabricName(f) : "Fabric"}</span>
                    <span className="body-3 text-fg-subtle">
                      {fmt(l.metres)}
                      {j.stage === "used" ? ` used${l.rolls?.length ? ` · rolls ${l.rolls.join(", ")}` : ""}` : covered.has(l.id) ? " · in stock" : " · backorder"}
                    </span>
                  </a>
                  {open4edit && <Button variant="secondary" size="sm" fullWidth={false} onClick={() => setOpen({ edit: l.id })}>Edit</Button>}
                </div>
                {l.rooms && (
                  <div className="lines">
                    {l.rooms.map((r, i) => <div key={i}><span>{j.wsNo}-{roomStart[l.id] + i + 1} · {r.name}</span><span className="num">{fmt(r.m)}</span></div>)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="lines"><div className="tot"><span>{j.stage === "used" ? "Used" : "Reserved"}</span><span className="num">{fmt(jobMetres(j))}</span></div></div>
        {open4edit && <Button variant="secondary" size="sm" className="mt-2" iconLeft={<Icon icon={Add} size={5} />} onClick={() => setOpen("add")}>Add another fabric</Button>}
      </Card>

      {draft && (
        <Card>
          <div className="grid gap-3">
            <div className="grid gap-1">
              <b className="body-2-semibold">WS {j.wsNo} is a draft</b>
              <span className="body-3 text-fg-subtle">Only sales can see it. The job still counts as Confirmed until you share it.</span>
            </div>
            {mine && (
              <>
                <Button onClick={() => onStatus("share")}>Share with factory</Button>
                <Button variant="secondary" onClick={() => setFlow("worksheet")}>Edit draft</Button>
              </>
            )}
          </div>
        </Card>
      )}

      <Card>
        <div className="grid gap-4">
          <dl className="meta">
            <div><dt>Reserved by</dt><dd>{j.by}</dd></div>
            {j.meta?.map(([k, v], i) => <div key={`${k}-${i}`}><dt>{k}</dt><dd>{v}</dd></div>)}
            {j.completed && <div><dt>Completed</dt><dd>{j.completed}</dd></div>}
          </dl>
          {j.stage !== "used" && (
            <div className="fld">
              <label className="cap" htmlFor="jd-ho">Est. handover date</label>
              {open4edit ? (
                <MonthYearPicker id="jd-ho" value={j.handover ?? ""} open={pickHo} onOpenChange={setPickHo}
                  onChange={(v) => setJobField(j.id, { handover: v || null })}
                  min={HANDOVER[0]} max={HANDOVER[HANDOVER.length - 1]} optional={j.stage === "proposal"} />
              ) : <span className="body-2">{j.handover ?? "Not set"}</span>}
            </div>
          )}
          {j.stage === "proposal" && (
            <div className="fld">
              <label className="cap" htmlFor="jd-like">How likely is the customer to confirm?</label>
              {mine ? (
                <Slider id="jd-like" stops={LIKELIHOODS} value={LIKELIHOODS.indexOf(j.likelihood ?? "Likely")} onChange={(i) => { if (LIKELIHOODS[i] !== j.likelihood) setJobField(j.id, { likelihood: LIKELIHOODS[i] }); }} />
              ) : <span className="body-2">{j.likelihood ?? "Likely"}</span>}
            </div>
          )}
        </div>
      </Card>

      {canMove && <Button onClick={() => setOpen("status")}>Update status</Button>}
      {open4edit && !draft && <Button variant="secondary" onClick={() => setOpen("merge")}>Merge with another reservation</Button>}

      <div className="log"><p className="cap">Updates</p>{j.log.map((l, i) => <p key={i}>{l}</p>)}</div>

      <UpdateStatusSheet job={j} open={open === "status"} onClose={() => setOpen(null)} onPick={onStatus} />
      <CancelDialog job={j} open={open === "cancel"} onClose={() => setOpen(null)} onCancelled={() => { setOpen(null); go("jobs"); }} />
      {open === "add" && <AddFabricSheet job={j} onClose={() => setOpen(null)} />}
      {open === "merge" && <MergeSheet job={j} onClose={() => setOpen(null)} />}
      {lineEdit && <EditLineSheet job={j} line={lineEdit} onClose={() => setOpen(null)} />}
      {flow === "confirm" && <ConfirmFlow job={j} onClose={() => setFlow(null)} onCreateWorksheet={() => setFlow("worksheet")} />}
      {flow === "worksheet" && <WorksheetFlow job={j} onClose={() => setFlow(null)} />}
    </>
  );
}
