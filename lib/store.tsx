"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { CURRENT_USER, Job, ROLLS, SEED_JOBS, Status, TODAY } from "./data";

export type CalcPrefs = { worksheet: boolean; confirmed: boolean; proposal: boolean };
const DEFAULT_PREFS: CalcPrefs = { worksheet: true, confirmed: true, proposal: false };
const KEY = "dvn-proto-v1";

export const ON_HAND = ROLLS.reduce((s, r) => s + r.left, 0);
export const fmt = (n: number) => `${Number.isInteger(n) ? n : n.toFixed(2).replace(/0$/, "")} m`;

type NewReservation = { status: Exclude<Status, "used">; metres: number; customer: string; location: string; handover: string | null };

type Ctx = {
  ready: boolean;
  jobs: Job[];
  prefs: CalcPrefs;
  setPrefs: (p: CalcPrefs) => void;
  reserve: (r: NewReservation) => Job;
  reset: () => void;
  sum: (s: Status) => number;
  avail: number; // on hand - worksheet - confirmed
  balance: number; // using prefs
  inStockIds: Set<string>; // proposals covered by available stock, first come first served
};

const StoreCtx = createContext<Ctx | null>(null);
export const useStore = () => {
  const c = useContext(StoreCtx);
  if (!c) throw new Error("StoreProvider missing");
  return c;
};

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [jobs, setJobs] = useState<Job[]>(SEED_JOBS);
  const [prefs, setPrefsState] = useState<CalcPrefs>(DEFAULT_PREFS);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const d = JSON.parse(raw);
        if (Array.isArray(d.jobs)) setJobs(d.jobs);
        if (d.prefs) setPrefsState({ ...DEFAULT_PREFS, ...d.prefs });
      }
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(KEY, JSON.stringify({ jobs, prefs })); } catch {}
  }, [jobs, prefs, ready]);

  const sum = useCallback((s: Status) => jobs.filter((j) => j.status === s).reduce((a, j) => a + j.metres, 0), [jobs]);

  const value = useMemo<Ctx>(() => {
    const ws = sum("worksheet"), conf = sum("confirmed"), prop = sum("proposal");
    const avail = ON_HAND - ws - conf;
    const balance = ON_HAND - (prefs.worksheet ? ws : 0) - (prefs.confirmed ? conf : 0) - (prefs.proposal ? prop : 0);
    let left = Math.max(avail, 0);
    const inStockIds = new Set<string>();
    let blocked = false; // first come, first served: once a quote does not fit, later ones wait behind it
    jobs.filter((j) => j.status === "proposal").forEach((j) => {
      if (!blocked && j.metres <= left + 1e-9) { inStockIds.add(j.id); left -= j.metres; }
      else blocked = true;
    });
    return {
      ready, jobs, prefs, sum, avail, balance, inStockIds,
      setPrefs: setPrefsState,
      reset: () => { setJobs(SEED_JOBS); setPrefsState(DEFAULT_PREFS); },
      reserve: (r) => {
        const wsNo = r.status === "worksheet" ? Math.max(1045, ...jobs.map((j) => j.wsNo ?? 0)) + 1 : undefined;
        const verb = r.status === "proposal" ? "quoted" : r.status === "confirmed" ? "confirmed" : "created the worksheet";
        const job: Job = {
          id: `n${Date.now()}`, status: r.status, customer: r.customer, location: r.location, metres: r.metres,
          by: CURRENT_USER, handover: r.handover, wsNo,
          sewing: r.status === "worksheet" ? "Queued for sewing" : undefined,
          meta: [[r.status === "proposal" ? "Quoted" : r.status === "confirmed" ? "Confirmed" : "Worksheet created", TODAY]],
          log: [`${TODAY} · ${CURRENT_USER} ${verb}`],
        };
        setJobs((js) => [...js, job]);
        return job;
      },
    };
  }, [ready, jobs, prefs, sum]);

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}
