"use client";
import { useState } from "react";
import { Add, ArrowRight2, Trash } from "iconsax-react";
import { CURRENT_USER, Fabric, Job, Line, Room, fabricName, handoverOptions } from "@/lib/data";
import { fmt, jobMetres, useStore } from "@/lib/store";
import { Button } from "./atoms/Button";
import { Card } from "./atoms/Card";
import { Checkbox } from "./atoms/Checkbox";
import { Icon } from "./atoms/Icon";
import { IconButton } from "./atoms/IconButton";
import { NumberInput, Select, TextField } from "./atoms/TextField";
import { Alert } from "./molecules/Alert";
import { MonthYearPicker } from "./molecules/MonthYearPicker";
import { SearchBar } from "./molecules/SearchBar";
import { ConfirmDialog } from "./organisms/ConfirmDialog";
import { Sheet } from "./organisms/Sheet";
import { useSheetBehaviour } from "./Sheets";
import { matchFabric } from "./screens/shared";

const CloseX = ({ onClick, label }: { onClick: () => void; label: string }) => (
  <button type="button" className="close" aria-label={label} onClick={onClick}>
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="M4 4l12 12M16 4L4 16" /></svg>
  </button>
);
const Tick = () => (
  <div className="tick" aria-hidden="true"><svg width="30" height="30" viewBox="0 0 30 30" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M7 16l6 6 11-13" /></svg></div>
);

/* ---------- Update status: only the moves that make sense for this stage ---------- */
export type StatusAction = "confirm" | "worksheet" | "share" | "cancel";

function Option({ title, note, onClick, danger }: { title: string; note: string; onClick: () => void; danger?: boolean }) {
  return (
    <button type="button" onClick={onClick} className="flex min-h-14 w-full cursor-pointer items-center justify-between gap-3 rounded-ds-2 border border-line px-3 py-2 text-left active:bg-raised">
      <span className="grid min-w-0">
        <span className={`body-2-semibold ${danger ? "text-fg-danger" : "text-fg"}`}>{title}</span>
        <span className="body-3 text-fg-subtle">{note}</span>
      </span>
      <Icon icon={ArrowRight2} size={5} className="text-icon-subtle" />
    </button>
  );
}

export function UpdateStatusSheet({ job, open, onClose, onPick }: { job: Job; open: boolean; onClose: () => void; onPick: (a: StatusAction) => void }) {
  const sewing = job.stage === "worksheet" && job.ws === "sewing";
  return (
    <Sheet open={open} onClose={onClose} title="Update status">
      <div className="grid gap-2">
        <p className="sub">{job.customer}, {job.location}</p>
        {job.stage === "proposal" && <Option title="Confirm" note="The customer said yes. A handover month is needed." onClick={() => onPick("confirm")} />}
        {job.stage === "confirmed" && job.ws !== "draft" && <Option title="Create worksheet" note="Split by room. Saved as a draft first." onClick={() => onPick("worksheet")} />}
        {job.stage === "confirmed" && job.ws === "draft" && <Option title="Share with factory" note={`Puts WS ${job.wsNo} on the factory's Ready to sew list.`} onClick={() => onPick("share")} />}
        {sewing
          ? <Alert tone="warning" title="Sewing has started">Only the factory can change or cancel this job now.</Alert>
          : <Option danger title="Cancel" note="Frees the metres. Nothing is deleted." onClick={() => onPick("cancel")} />}
      </div>
    </Sheet>
  );
}

/* ---------- Cancel ---------- */
export function CancelDialog({ job, open, onClose, onCancelled }: { job: Job; open: boolean; onClose: () => void; onCancelled: () => void }) {
  const { cancelJob } = useStore();
  const [reason, setReason] = useState("");
  return (
    <ConfirmDialog open={open} danger title="Cancel this job?" confirmLabel="Yes, cancel job" cancelLabel="No, keep it" onCancel={onClose}
      onConfirm={() => { cancelJob(job.id, reason.trim()); onCancelled(); }}>
      <div className="grid gap-3">
        <p>{job.customer}&apos;s {fmt(jobMetres(job))} is free for others straight away. The job stays in the history.</p>
        <TextField label="Reason (optional)" placeholder="e.g. Customer chose another fabric" value={reason} onChange={(e) => setReason(e.target.value)} autoComplete="off" />
      </div>
    </ConfirmDialog>
  );
}

/* ---------- Edit one fabric of a job: change the amount, or swap the fabric ---------- */
export function EditLineSheet({ job, line, onClose }: { job: Job; line: Line; onClose: () => void }) {
  const { fabrics, editLine, removeLine } = useStore();
  const [fabricId, setFabricId] = useState(line.fabricId);
  const [m, setM] = useState(String(line.metres));
  const metres = Number(m) || 0;
  const swapped = fabricId !== line.fabricId;
  return (
    <Sheet open onClose={onClose} title="Edit fabric"
      footer={
        <div className="grid gap-2">
          <Button disabled={metres <= 0} onClick={() => { editLine(job.id, line.id, fabricId, metres); onClose(); }}>Save</Button>
          {job.lines.length > 1 && <Button variant="danger" onClick={() => { removeLine(job.id, line.id); onClose(); }}>Remove this fabric from the job</Button>}
        </div>
      }>
      <div className="grid gap-4">
        <div className="fld">
          <label className="cap" htmlFor="el-fabric">Fabric</label>
          <Select id="el-fabric" value={fabricId} onChange={(e) => setFabricId(e.target.value)}>
            {fabrics.map((f) => <option key={f.id} value={f.id}>{fabricName(f)}</option>)}
          </Select>
        </div>
        <div className="fld">
          <label className="cap" htmlFor="el-m">Metres</label>
          <NumberInput id="el-m" value={m} onChange={(e) => setM(e.target.value)} invalid={metres <= 0} />
        </div>
        {swapped
          ? <Alert tone="warning" title="A different fabric joins the back of that fabric's line">Jobs reserved earlier for it are served first.</Alert>
          : <p className="hint">A new amount keeps the same place in line. The change is logged.</p>}
      </div>
    </Sheet>
  );
}

/* ---------- Add another fabric to the same job ---------- */
export function AddFabricSheet({ job, onClose }: { job: Job; onClose: () => void }) {
  const { fabrics, stats, addLine } = useStore();
  const [q, setQ] = useState("");
  const [pick, setPick] = useState<Fabric | null>(null);
  const [m, setM] = useState("");
  const metres = Number(m) || 0;
  const list = fabrics.filter((f) => matchFabric(f, q));
  return (
    <Sheet open onClose={onClose} title="Add a fabric"
      footer={<Button disabled={!pick || metres <= 0} onClick={() => { if (pick) addLine(job.id, pick.id, metres); onClose(); }}>Add to this job</Button>}>
      <div className="grid gap-3">
        <p className="sub">{job.customer}, {job.location}</p>
        <SearchBar value={q} onChange={setQ} placeholder="Supplier, collection, colour" />
        <div className="grid gap-2" role="radiogroup" aria-label="Fabric">
          {list.map((f) => {
            const on = pick?.id === f.id;
            return (
              <button key={f.id} type="button" role="radio" aria-checked={on} onClick={() => setPick(f)}
                className={`flex min-h-14 cursor-pointer items-center justify-between gap-3 rounded-ds-2 border px-3 py-2 text-left ${on ? "border-line-primary bg-raised" : "border-line"}`}>
                <span className="grid min-w-0">
                  <span className="body-2-semibold truncate text-fg">{fabricName(f)}</span>
                  <span className="body-3 truncate text-fg-subtle">{f.supplier}</span>
                </span>
                <span className="body-3-semibold shrink-0 whitespace-nowrap text-fg-subtle">{stats(f.id).short > 0 ? `Short ${fmt(stats(f.id).short)}` : `${fmt(stats(f.id).avail)} free`}</span>
              </button>
            );
          })}
          {list.length === 0 && <p className="sub">No fabric matches that search.</p>}
        </div>
        <div className="fld">
          <label className="cap" htmlFor="af-m">Metres</label>
          <NumberInput id="af-m" value={m} onChange={(e) => setM(e.target.value)} placeholder="0" />
        </div>
        <p className="hint">Each fabric in a job has its own balance and its own place in line.</p>
      </div>
    </Sheet>
  );
}

/* ---------- Merge: bring other reservations of mine into this job ---------- */
export function MergeSheet({ job, onClose }: { job: Job; onClose: () => void }) {
  const { jobs, fabric, mergeJobs } = useStore();
  const [ticked, setTicked] = useState<string[]>([]);
  const others = jobs.filter((j) => j.id !== job.id && j.stage === job.stage && j.by === CURRENT_USER && j.ws !== "draft");
  const same = (j: Job) => j.customer.trim().toLowerCase() === job.customer.trim().toLowerCase();
  const sorted = [...others].sort((a, b) => Number(same(b)) - Number(same(a)));
  const toggle = (id: string) => setTicked((t) => (t.includes(id) ? t.filter((x) => x !== id) : [...t, id]));
  return (
    <Sheet open onClose={onClose} title="Merge reservations"
      footer={<Button disabled={ticked.length === 0} onClick={() => { mergeJobs(job.id, ticked); onClose(); }}>
        {ticked.length === 0 ? "Choose a reservation" : `Merge ${ticked.length} ${ticked.length === 1 ? "reservation" : "reservations"}`}
      </Button>}>
      <div className="grid gap-3">
        <p className="sub">Bring another of your {job.stage === "proposal" ? "proposals" : "confirmed jobs"} into {job.customer}&apos;s job. The result is one job with several fabrics, and each fabric keeps its own date in line.</p>
        {sorted.length === 0 && <Alert title="Nothing to merge">You have no other {job.stage === "proposal" ? "proposals" : "confirmed jobs"}.</Alert>}
        {sorted.map((j) => (
          <div key={j.id} className="rounded-ds-2 border border-line px-3 py-3">
            <Checkbox
              checked={ticked.includes(j.id)}
              onChange={() => toggle(j.id)}
              label={`${j.customer}, ${j.location}${same(j) ? " · same customer" : ""}`}
              description={j.lines.map((l) => { const f = fabric(l.fabricId); return `${f ? fabricName(f) : ""} · ${fmt(l.metres)}`; }).join(", ")}
            />
          </div>
        ))}
      </div>
    </Sheet>
  );
}

/* ---------- Confirm: review the amounts, then a success screen ---------- */
export function ConfirmFlow({ job, onClose, onCreateWorksheet }: { job: Job; onClose: () => void; onCreateWorksheet: () => void }) {
  const { fabric, stats, confirmJob } = useStore();
  const HANDOVER = handoverOptions();
  const [step, setStep] = useState<"review" | "done">("review");
  const [m, setM] = useState<Record<string, string>>(() => Object.fromEntries(job.lines.map((l) => [l.id, String(l.metres)])));
  const [handover, setHandover] = useState(job.handover ?? "");
  const [pickHo, setPickHo] = useState(false);
  const [tried, setTried] = useState(false);
  useSheetBehaviour(() => (pickHo ? setPickHo(false) : onClose()));

  const val = (id: string) => Number(m[id]) || 0;
  const total = job.lines.reduce((a, l) => a + val(l.id), 0);
  const wanted = (fabricId: string) => job.lines.filter((l) => l.fabricId === fabricId).reduce((a, l) => a + val(l.id), 0);
  const bad = job.lines.some((l) => val(l.id) <= 0) || !handover;
  const submit = () => {
    setTried(true);
    if (bad) return;
    confirmJob(job.id, Object.fromEntries(job.lines.map((l) => [l.id, val(l.id)])), handover);
    setStep("done");
  };

  return (
    <>
      <div className="scrim" aria-hidden="true" />
      <div className="screen" role="dialog" aria-modal="true" aria-label="Confirm job">
        {step === "review" && (
          <>
            <div className="screen-top"><h2>Confirm job</h2><CloseX onClick={onClose} label="Close without confirming" /></div>
            <Card className="fabric-card" aria-label="Customer"><span className="sup">Customer</span><b>{job.customer}, {job.location}</b></Card>
            <p className="sub">Check each amount and change it if needed.</p>
            {job.lines.map((l) => {
              const f = fabric(l.fabricId);
              const free = Math.max(stats(l.fabricId).avail, 0);
              const after = stats(l.fabricId).avail - wanted(l.fabricId);
              return (
                <div className="fld" key={l.id}>
                  <label className="cap" htmlFor={`cf-${l.id}`}>{f ? fabricName(f) : "Fabric"}</label>
                  <NumberInput id={`cf-${l.id}`} value={m[l.id]} onChange={(e) => setM({ ...m, [l.id]: e.target.value })} invalid={tried && val(l.id) <= 0} />
                  {after < 0
                    ? <p className="warn">Only {fmt(free)} is free. You can still confirm. The job is tagged Backorder and this fabric shows To buy {fmt(-after)}.</p>
                    : <span className="hint">{fmt(free)} is free now. {fmt(after)} left after this job.</span>}
                </div>
              );
            })}
            <div className="fld">
              <label className="cap" htmlFor="cf-ho">Est. handover date <em className="req">· Required</em></label>
              <MonthYearPicker id="cf-ho" value={handover} onChange={setHandover} open={pickHo} onOpenChange={setPickHo}
                min={HANDOVER[0]} max={HANDOVER[HANDOVER.length - 1]} invalid={tried && !handover} />
              {tried && !handover && <span className="hint err">Choose a month and year to continue.</span>}
            </div>
            <div className="screen-foot"><Button onClick={submit}>Confirm {fmt(total)}</Button></div>
          </>
        )}

        {step === "done" && (
          <>
            <div className="done">
              <Tick />
              <h2>Confirmed</h2>
              <p className="sub">{fmt(total)} is confirmed for {job.customer}.</p>
            </div>
            <Card>
              <dl className="meta">
                <div><dt>Customer</dt><dd>{job.customer}, {job.location}</dd></div>
                <div><dt>Est. handover</dt><dd>{handover}</dd></div>
                {[...new Set(job.lines.map((l) => l.fabricId))].map((id) => {
                  const f = fabric(id);
                  const s = stats(id);
                  return <div key={id}><dt>{f ? fabricName(f) : ""}</dt><dd>{s.short > 0 ? `To buy ${fmt(s.short)}` : `${fmt(s.avail)} free now`}</dd></div>;
                })}
              </dl>
            </Card>
            <div className="screen-foot grid gap-2">
              <Button onClick={onClose}>Back to job</Button>
              <Button variant="secondary" onClick={onCreateWorksheet}>Create worksheet now</Button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

/* ---------- Worksheet: split each fabric by room, save as a draft ---------- */
type RoomDraft = { name: string; m: string };

export function WorksheetFlow({ job, onClose }: { job: Job; onClose: () => void }) {
  const { fabric, saveDraft } = useStore();
  const [rooms, setRooms] = useState<Record<string, RoomDraft[]>>(() =>
    Object.fromEntries(job.lines.map((l) => [l.id, (l.rooms ?? [{ name: "", m: l.metres }]).map((r) => ({ name: r.name, m: String(r.m) }))])));
  const [tried, setTried] = useState(false);
  useSheetBehaviour(onClose);

  const set = (lineId: string, i: number, patch: Partial<RoomDraft>) =>
    setRooms((r) => ({ ...r, [lineId]: r[lineId].map((x, k) => (k === i ? { ...x, ...patch } : x)) }));
  const sum = (lineId: string) => rooms[lineId].reduce((a, r) => a + (Number(r.m) || 0), 0);
  const bad = job.lines.some((l) => rooms[l.id].some((r) => !r.name.trim() || (Number(r.m) || 0) <= 0));
  const save = () => {
    setTried(true);
    if (bad) return;
    const parsed: Record<string, Room[]> = Object.fromEntries(job.lines.map((l) => [l.id, rooms[l.id].map((r) => ({ name: r.name.trim(), m: Number(r.m) }))]));
    saveDraft(job.id, parsed);
    onClose();
  };

  return (
    <>
      <div className="scrim" aria-hidden="true" />
      <div className="screen" role="dialog" aria-modal="true" aria-label="Worksheet">
        <div className="screen-top"><h2>{job.ws === "draft" ? `Edit WS ${job.wsNo} draft` : "Create worksheet"}</h2><CloseX onClick={onClose} label="Close without saving" /></div>
        <Card className="fabric-card" aria-label="Customer"><span className="sup">Customer</span><b>{job.customer}, {job.location}</b></Card>
        <p className="sub">One line per room. The factory sees nothing until you share the worksheet.</p>

        {job.lines.map((l) => {
          const f = fabric(l.fabricId);
          const total = sum(l.id);
          return (
            <Card key={l.id}>
              <div className="grid gap-3">
                <div className="flex items-baseline justify-between gap-2">
                  <b className="body-2-semibold">{f ? fabricName(f) : "Fabric"}</b>
                  <span className="body-3 whitespace-nowrap text-fg-subtle">Confirmed {fmt(l.metres)}</span>
                </div>
                {rooms[l.id].map((r, i) => (
                  <div key={i} className="grid grid-cols-[minmax(0,1fr)_5.5rem_auto] items-end gap-2">
                    <TextField label="Room" showLabel={i === 0} placeholder="e.g. Living room" autoComplete="off" value={r.name}
                      invalid={tried && !r.name.trim()} onChange={(e) => set(l.id, i, { name: e.target.value })} />
                    <div className="grid gap-1">
                      {i === 0 && <span className="label-3 text-fg">Metres</span>}
                      <NumberInput aria-label={`Metres for room ${i + 1}`} value={r.m} invalid={tried && (Number(r.m) || 0) <= 0} onChange={(e) => set(l.id, i, { m: e.target.value })} />
                    </div>
                    <IconButton aria-label={`Remove room ${i + 1}`} disabled={rooms[l.id].length === 1} className="size-12"
                      onClick={() => setRooms((x) => ({ ...x, [l.id]: x[l.id].filter((_, k) => k !== i) }))}>
                      <Icon icon={Trash} size={5} />
                    </IconButton>
                  </div>
                ))}
                <Button variant="secondary" size="sm" iconLeft={<Icon icon={Add} size={5} />} onClick={() => setRooms((x) => ({ ...x, [l.id]: [...x[l.id], { name: "", m: "" }] }))}>Add a room</Button>
                {total === l.metres
                  ? <span className="hint">Rooms add up to {fmt(total)} of {fmt(l.metres)} confirmed.</span>
                  : <p className="warn">Rooms add up to {fmt(total)}, not {fmt(l.metres)}. Saving changes the confirmed amount to {fmt(total)}.</p>}
              </div>
            </Card>
          );
        })}
        {tried && bad && <span className="hint err">Give every room a name and its metres.</span>}
        <div className="screen-foot"><Button onClick={save}>Save draft</Button></div>
      </div>
    </>
  );
}
