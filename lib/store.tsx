"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { ADMIN_USER, CURRENT_USER, FABRICS, Fabric, INCOMING, Job, LIKELIHOODS, Likelihood, ROLLS, Roll, Room, SEED_JOBS, TODAY } from "./data";

export type CalcPrefs = { worksheet: boolean; confirmed: boolean; levels: Record<Likelihood, boolean> };
const DEFAULT_PREFS: CalcPrefs = { worksheet: true, confirmed: true, levels: { "Very likely": false, Likely: false, Unlikely: false } };
const KEY = "dvn-proto-v4";

/** Text for the formula line, e.g. "proposal (very likely, likely)". Empty when no proposal group is ticked. */
export function proposalLabel(p: CalcPrefs): string {
  const on = [...LIKELIHOODS].reverse().filter((l) => p.levels[l]);
  if (on.length === 0) return "";
  return on.length === 3 ? "proposal" : `proposal (${on.map((l) => l.toLowerCase()).join(", ")})`;
}

export const fmt = (n: number) => `${Number.isInteger(n) ? n : n.toFixed(2).replace(/0$/, "")} m`;
export const jobMetres = (j: Job) => j.lines.reduce((a, l) => a + l.metres, 0);

/** Every figure the screens need for one fabric. `avail` = on hand − worksheet − confirmed; `short` is how far below zero it is. */
export type FabricStats = {
  onHand: number; rolls: number; received: number;
  worksheet: number; confirmed: number; proposal: number; used: number;
  avail: number; short: number; levels: Record<Likelihood, number>;
  /** Metres on rolls that can be cut (short ends left out), and metres on short ends. */
  usable: number; shortEnds: number;
  /** How far all demand (worksheet, confirmed and proposals) is above what is on hand. */
  gap: number;
  /** Metres on the way, and when the first shipment is due. */
  incoming: number; eta: string | null;
};
const EMPTY: FabricStats = { usable: 0, shortEnds: 0, gap: 0, incoming: 0, eta: null, onHand: 0, rolls: 0, received: 0, worksheet: 0, confirmed: 0, proposal: 0, used: 0, avail: 0, short: 0, levels: { Unlikely: 0, Likely: 0, "Very likely": 0 } };

export type StockSort = "shortage" | "availability" | "updated";
export type StockView = { supplier: string; collection: string; sort: StockSort };
const DEFAULT_VIEW: StockView = { supplier: "", collection: "", sort: "shortage" };

export type NewReservation = {
  fabricId: string; status: "proposal" | "confirmed" | "worksheet"; metres: number;
  customer: string; location: string; handover: string | null; likelihood?: Likelihood;
};

type Ctx = {
  ready: boolean;
  jobs: Job[];
  fabrics: Fabric[];
  prefs: CalcPrefs;
  setPrefs: (p: CalcPrefs) => void;
  reset: () => void;
  fabric: (id: string) => Fabric | undefined;
  rollsOf: (fabricId: string) => Roll[];
  stats: (fabricId: string) => FabricStats;
  /** Balance of one fabric using the calculator ticks (or the ticks passed in). */
  balance: (fabricId: string, p?: CalcPrefs) => number;
  /** Line ids that stock can cover, first come first served: worksheets, then confirmed, then proposals. */
  covered: Set<string>;
  recents: string[];
  viewFabric: (id: string) => void;
  stockView: StockView;
  setStockView: (v: StockView) => void;
  /** Only the salesperson who made a job, or an admin, may change it. */
  canEdit: (j: Job) => boolean;
  reserve: (r: NewReservation) => Job;
  setJobField: (id: string, patch: { likelihood?: Likelihood; handover?: string | null }) => void;
  confirmJob: (id: string, metres: Record<string, number>, handover: string) => void;
  cancelJob: (id: string, reason: string) => void;
  saveDraft: (id: string, rooms: Record<string, Room[]>) => void;
  shareWorksheet: (id: string) => void;
  editLine: (jobId: string, lineId: string, fabricId: string, metres: number) => void;
  removeLine: (jobId: string, lineId: string) => void;
  addLine: (jobId: string, fabricId: string, metres: number) => void;
  mergeJobs: (targetId: string, otherIds: string[]) => void;
};

const StoreCtx = createContext<Ctx | null>(null);
export const useStore = () => {
  const c = useContext(StoreCtx);
  if (!c) throw new Error("StoreProvider missing");
  return c;
};

const stamp = (what: string) => `${TODAY} · ${CURRENT_USER} ${what}`;
const nextSeq = (js: Job[]) => Math.max(0, ...js.flatMap((j) => j.lines.map((l) => l.seq))) + 1;
const nextWsNo = (js: Job[]) => Math.max(1045, ...js.map((j) => j.wsNo ?? 0)) + 1;
const uid = (p: string) => `${p}${Date.now().toString(36)}${Math.round(Math.random() * 1e4).toString(36)}`;
const RANK = { worksheet: 0, confirmed: 1, proposal: 2 } as const;

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [jobs, setJobs] = useState<Job[]>(SEED_JOBS);
  const [prefs, setPrefsState] = useState<CalcPrefs>(DEFAULT_PREFS);
  const [recents, setRecents] = useState<string[]>([]);
  const [stockView, setStockView] = useState<StockView>(DEFAULT_VIEW);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const d = JSON.parse(raw);
        if (Array.isArray(d.jobs) && d.jobs.every((j: Job) => Array.isArray(j.lines))) setJobs(d.jobs);
        if (d.prefs) setPrefsState({ ...DEFAULT_PREFS, ...d.prefs, levels: { ...DEFAULT_PREFS.levels, ...d.prefs.levels } });
        if (Array.isArray(d.recents)) setRecents(d.recents);
      }
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(KEY, JSON.stringify({ jobs, prefs, recents })); } catch {}
  }, [jobs, prefs, recents, ready]);

  const allStats = useMemo(() => {
    const m = new Map<string, FabricStats>();
    for (const f of FABRICS) {
      const rs = ROLLS.filter((r) => r.fabricId === f.id);
      m.set(f.id, { ...EMPTY, levels: { ...EMPTY.levels }, usable: rs.filter((r) => !r.short).reduce((a, r) => a + r.left, 0), shortEnds: rs.filter((r) => r.short).reduce((a, r) => a + r.left, 0), onHand: rs.reduce((a, r) => a + r.left, 0), rolls: rs.filter((r) => r.left > 0).length, received: rs.reduce((a, r) => a + r.received, 0) });
    }
    for (const j of jobs) {
      if (j.stage === "cancelled") continue;
      for (const l of j.lines) {
        const s = m.get(l.fabricId);
        if (!s) continue;
        s[j.stage] += l.metres;
        if (j.stage === "proposal") s.levels[j.likelihood ?? "Likely"] += l.metres;
      }
    }
    for (const sh of INCOMING) { const s = m.get(sh.fabricId); if (s) { s.incoming += sh.metres; s.eta = s.eta ?? sh.eta; } }
    for (const s of m.values()) {
      s.avail = s.onHand - s.worksheet - s.confirmed;
      s.short = Math.max(0, -s.avail);
      s.gap = Math.max(0, s.worksheet + s.confirmed + s.proposal - s.onHand);
    }
    return m;
  }, [jobs]);

  const covered = useMemo(() => {
    const set = new Set<string>();
    for (const f of FABRICS) {
      let left = allStats.get(f.id)?.onHand ?? 0;
      let blocked = false; // once one job does not fit, the ones behind it wait too
      jobs
        .flatMap((j) => (j.stage in RANK ? j.lines.filter((l) => l.fabricId === f.id).map((l) => ({ l, r: RANK[j.stage as keyof typeof RANK] })) : []))
        .sort((a, b) => a.r - b.r || a.l.seq - b.l.seq)
        .forEach(({ l }) => {
          if (!blocked && l.metres <= left + 1e-9) { set.add(l.id); left -= l.metres; } else blocked = true;
        });
    }
    return set;
  }, [jobs, allStats]);

  const stats = useCallback((id: string) => allStats.get(id) ?? EMPTY, [allStats]);
  const update = useCallback((id: string, fn: (j: Job, all: Job[]) => Job) => setJobs((js) => js.map((j) => (j.id === id ? fn(j, js) : j))), []);

  const value = useMemo<Ctx>(() => ({
    ready, jobs, fabrics: FABRICS, prefs, covered, recents, stockView, setStockView, stats,
    setPrefs: setPrefsState,
    reset: () => { setJobs(SEED_JOBS); setPrefsState(DEFAULT_PREFS); setRecents([]); setStockView(DEFAULT_VIEW); },
    fabric: (id) => FABRICS.find((f) => f.id === id),
    rollsOf: (id) => ROLLS.filter((r) => r.fabricId === id && r.left > 0),
    balance: (id, p = prefs) => {
      const s = stats(id);
      const prop = LIKELIHOODS.reduce((a, l) => a + (p.levels[l] ? s.levels[l] : 0), 0);
      return s.onHand - (p.worksheet ? s.worksheet : 0) - (p.confirmed ? s.confirmed : 0) - prop;
    },
    viewFabric: (id) => setRecents((r) => (r[0] === id ? r : [id, ...r.filter((x) => x !== id)].slice(0, 5))),
    canEdit: (j) => j.by === CURRENT_USER || CURRENT_USER === ADMIN_USER,
    reserve: (r) => {
      const verb = r.status === "proposal" ? "quoted" : r.status === "confirmed" ? "confirmed" : "created the worksheet";
      const job: Job = {
        id: uid("n"), stage: r.status, customer: r.customer, location: r.location, by: CURRENT_USER, handover: r.handover,
        likelihood: r.status === "proposal" ? r.likelihood : undefined,
        wsNo: r.status === "worksheet" ? nextWsNo(jobs) : undefined,
        ws: r.status === "worksheet" ? "queued" : undefined,
        lines: [{ id: uid("l"), fabricId: r.fabricId, metres: r.metres, seq: nextSeq(jobs) }],
        meta: [[r.status === "proposal" ? "Quoted" : r.status === "confirmed" ? "Confirmed" : "Worksheet shared", TODAY]],
        log: [stamp(verb)],
      };
      setJobs((js) => [...js, job]);
      return job;
    },
    setJobField: (id, patch) => update(id, (j) => ({
      ...j, ...patch,
      log: [stamp(patch.likelihood ? `changed likelihood to ${patch.likelihood.toLowerCase()}` : `changed handover to ${patch.handover ?? "not set"}`), ...j.log],
    })),
    confirmJob: (id, metres, handover) => update(id, (j) => ({
      ...j, stage: "confirmed", likelihood: undefined, handover,
      lines: j.lines.map((l) => ({ ...l, metres: metres[l.id] ?? l.metres })),
      meta: [...(j.meta ?? []), ["Confirmed", TODAY]],
      log: [stamp("confirmed"), ...j.log],
    })),
    cancelJob: (id, reason) => update(id, (j) => ({ ...j, stage: "cancelled", ws: undefined, log: [stamp(`cancelled${reason ? `: ${reason}` : ""}`), ...j.log] })),
    saveDraft: (id, rooms) => update(id, (j, all) => ({
      ...j, ws: "draft", wsNo: j.wsNo ?? nextWsNo(all),
      // the rooms are the detailed figure, so the fabric's confirmed metres follow their total
      lines: j.lines.map((l) => (rooms[l.id] ? { ...l, rooms: rooms[l.id], metres: rooms[l.id].reduce((a, r) => a + r.m, 0) } : l)),
      log: [stamp(j.ws === "draft" ? "updated the worksheet draft" : "saved a worksheet draft"), ...j.log],
    })),
    shareWorksheet: (id) => update(id, (j) => ({
      ...j, stage: "worksheet", ws: "queued",
      meta: [...(j.meta ?? []), ["Worksheet shared", TODAY]],
      log: [stamp("shared the worksheet with the factory"), ...j.log],
    })),
    editLine: (jobId, lineId, fabricId, metres) => update(jobId, (j, all) => ({
      ...j,
      lines: j.lines.map((l) => {
        if (l.id !== lineId) return l;
        const swapped = l.fabricId !== fabricId; // a new fabric joins the back of that fabric's queue
        return { ...l, fabricId, metres, seq: swapped ? nextSeq(all) : l.seq, rooms: undefined };
      }),
      log: [stamp("changed a fabric in this job"), ...j.log],
    })),
    removeLine: (jobId, lineId) => update(jobId, (j) => ({ ...j, lines: j.lines.filter((l) => l.id !== lineId), log: [stamp("removed a fabric from this job"), ...j.log] })),
    addLine: (jobId, fabricId, metres) => update(jobId, (j, all) => ({
      ...j, lines: [...j.lines, { id: uid("l"), fabricId, metres, seq: nextSeq(all) }], log: [stamp("added a fabric to this job"), ...j.log],
    })),
    mergeJobs: (targetId, otherIds) => setJobs((js) => {
      const others = js.filter((j) => otherIds.includes(j.id));
      return js.filter((j) => !otherIds.includes(j.id)).map((j) => (j.id !== targetId ? j : {
        ...j, lines: [...j.lines, ...others.flatMap((o) => o.lines)], // each fabric keeps its own place in the queue
        log: [stamp(`merged ${others.length} reservation${others.length === 1 ? "" : "s"} into this job`), ...j.log],
      }));
    }),
  }), [ready, jobs, prefs, covered, recents, stockView, stats, update]);

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}
