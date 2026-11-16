"use client";
import { useEffect, useState } from "react";
import { ArrowRight2 } from "iconsax-react";
import { Fabric, LIKELIHOODS, STATUS_LABEL, Status, fabricName } from "@/lib/data";
import { fmt, proposalLabel, useStore } from "@/lib/store";
import { back } from "@/lib/nav";
import { Button } from "../atoms/Button";
import { Card } from "../atoms/Card";
import { Pill } from "../atoms/Pill";
import { PageTitleBar } from "../molecules/PageTitleBar";
import { CalcSheet, ReserveSheet } from "../Sheets";
import { JobCard } from "./shared";

function Missing() {
  return (<><PageTitleBar title="Fabric not found" onBack={() => back("")} /><p className="sub">This fabric is not in the demo data.</p></>);
}

/* ---------- Fabric page: balance, where the metres are, and Reserve ---------- */
export function FabricOverview({ id }: { id: string }) {
  const { fabric, stats, jobs, balance, prefs, viewFabric } = useStore();
  const [calc, setCalc] = useState(false);
  const [reserving, setReserving] = useState(false);
  const f = fabric(id);
  useEffect(() => { if (f) viewFabric(f.id); }, [f, viewFabric]);
  if (!f) return <Missing />;

  const s = stats(id);
  const count = (st: Status) => jobs.filter((j) => j.stage === st && j.lines.some((l) => l.fabricId === id)).length;
  const n = (st: Status, one: string, many: string) => `${count(st)} ${count(st) === 1 ? one : many}`;

  // The chart only shows what the calculator takes away from stock.
  const propTaken = LIKELIHOODS.reduce((a, l) => a + (prefs.levels[l] ? s.levels[l] : 0), 0);
  const propPartial = proposalLabel(prefs).replace(/^proposal/, "").trim(); // e.g. "(very likely, likely)"
  const items = [
    ...(prefs.worksheet ? [{ key: "ws", label: "Worksheet", m: s.worksheet }] : []),
    ...(prefs.confirmed ? [{ key: "conf", label: "Confirmed", m: s.confirmed }] : []),
    ...(propTaken > 0 ? [{ key: "prop", label: propPartial ? `Proposal ${propPartial}` : "Proposal", m: propTaken }] : []),
  ];
  const demand = items.reduce((a, i) => a + i.m, 0);
  const short = Math.max(demand - s.onHand, 0);
  const free = Math.max(s.onHand - demand, 0);
  const total = Math.max(s.onHand, demand) || 1;
  const pct = (n: number) => `${(n / total) * 100}%`;
  let room = s.onHand; // fill the bar in order; whatever does not fit in stock becomes "out of stock"
  const segs = items.map((i) => { const inStock = Math.min(i.m, room); room -= inStock; return { ...i, inStock }; });

  const parts = ["On hand", ...(["worksheet", "confirmed"] as const).filter((k) => prefs[k]), ...(proposalLabel(prefs) ? [proposalLabel(prefs)] : [])];
  const bal = balance(id);
  const label =
    `On hand ${fmt(s.onHand)}: ` + items.map((i) => `${i.label.toLowerCase()} ${fmt(i.m)}`).join(", ") +
    (items.length ? ", " : "") + (short ? `${fmt(short)} out of stock.` : `${fmt(free)} available.`);

  return (
    <>
      <PageTitleBar title={fabricName(f)} subtitle={f.supplier} onBack={() => back("")} />

      <Card>
        <div className="bal-lab">Balance</div>
        <div className="bal-row">
          <span className={`bal-num ${bal < 0 ? "neg" : ""}`}>{bal < 0 ? "− " : ""}{fmt(Math.abs(bal))}</span>
          <button className="calc" type="button" aria-label="Choose how the balance is calculated" onClick={() => setCalc(true)}>
            <svg width="20" height="20" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><rect x="3" y="1.5" width="12" height="15" rx="2" /><path d="M6 5h6M6 9h.01M9 9h.01M12 9h.01M6 12.5h.01M9 12.5h.01M12 12.5h.01" strokeLinecap="round" /></svg>
          </button>
        </div>
        <div className="formula">{parts.join(" − ")}</div>
        <div className="bar" role="img" aria-label={label}>
          {segs.map((g) => g.inStock > 0 && <i key={g.key} className={`sw-${g.key}`} style={{ width: pct(g.inStock) }} />)}
          {short > 0 ? (
            <>
              <i className="short" style={{ width: pct(short) }} />
              <span className="oos" style={{ left: pct(s.onHand) }} aria-hidden="true" />
            </>
          ) : (
            free > 0 && <i className="sw-avail" style={{ width: pct(free) }} />
          )}
        </div>
        <div className="leg">
          {items.map((i) => (
            <div key={i.key}><i className={`sw sw-${i.key}`} /><span>{i.label}</span><span className="num">{fmt(i.m)}</span></div>
          ))}
          {short > 0 ? (
            <div><i className="sw sw-short" /><span>Out of stock</span><span className="num">{fmt(short)}</span></div>
          ) : (
            <div><i className="sw sw-avail" /><span>Available</span><span className="num">{fmt(free)}</span></div>
          )}
        </div>
        {bal < 0 && <div className="buy"><span>To buy</span><span className="num">{fmt(Math.abs(bal))}</span></div>}
      </Card>

      <NavCard to={`fabric/${id}/on-hand`} title="On hand" v={fmt(s.onHand)} small={`${s.rolls} ${s.rolls === 1 ? "roll" : "rolls"} in factory`} />
      <NavCard to={`fabric/${id}/worksheet`} title="Worksheet" v={fmt(s.worksheet)} small={n("worksheet", "job", "jobs")} />
      <NavCard to={`fabric/${id}/confirmed`} title="Confirmed" v={fmt(s.confirmed)} small={n("confirmed", "job", "jobs")} />
      <NavCard to={`fabric/${id}/proposal`} title="Proposal" v={fmt(s.proposal)} small={n("proposal", "quote", "quotes")} />
      <NavCard to={`fabric/${id}/used`} title="Used" v={fmt(s.used)} small={n("used", "worksheet completed", "worksheets completed")} />

      <div className="stickybtn"><Button onClick={() => setReserving(true)}>Reserve this fabric</Button></div>

      {calc && <CalcSheet fabricId={id} onClose={() => setCalc(false)} />}
      {reserving && <ReserveSheet fabricId={id} onClose={() => setReserving(false)} onDone={() => setReserving(false)} />}
    </>
  );
}

function NavCard({ to, title, v, small }: { to: string; title: string; v: string; small: string }) {
  return (
    <Card className="nav" href={`#/${to}`}>
      <b>{title}</b><span className="v inline-flex items-center gap-1">{v}<ArrowRight2 size={20} color="currentColor" aria-hidden="true" /></span><small>{small}</small>
    </Card>
  );
}

const useFabric = (id: string): Fabric | undefined => useStore().fabric(id);

/* ---------- Rolls of one fabric ---------- */
export function OnHand({ id }: { id: string }) {
  const { rollsOf, stats } = useStore();
  const f = useFabric(id);
  if (!f) return <Missing />;
  const rolls = rollsOf(id);
  const s = stats(id);
  return (
    <>
      <PageTitleBar title="On hand" subtitle={fabricName(f)} onBack={() => back(`fabric/${id}`)} />
      <div className="sum"><span className="v">{fmt(s.onHand)}</span><span>{rolls.length} {rolls.length === 1 ? "roll" : "rolls"} in factory</span></div>
      <p className="cap">Rolls</p>
      <div className="list">
        {rolls.map((r) => (
          <Card className="roll" key={r.code}>
            <span className="code">{r.code} {r.short && <Pill tone="danger">Short end</Pill>}</span>
            <span className="v">{fmt(r.left)}</span>
            <small>Received {r.month} · {fmt(r.received)}</small>
            <div className="rb"><i style={{ width: `${(r.left / r.received) * 100}%` }} /></div>
          </Card>
        ))}
        {rolls.length === 0 && <p className="sub">No rolls in the factory.</p>}
      </div>
      <p className="sub">Only the factory can change roll amounts.</p>
      <p className="sub">Roll codes: year and month received, then a letter. 2611-A is the first roll received in November 2026 (YYMM). The letter counts the rolls of that fabric received that month, starting at A and skipping I and O.</p>
      <p className="sub">Received {fmt(s.received)} in total.</p>
    </>
  );
}

/* ---------- Jobs that use one fabric, by stage ---------- */
export function FabricJobs({ id, status }: { id: string; status: Status }) {
  const { jobs, stats } = useStore();
  const f = useFabric(id);
  if (!f) return <Missing />;
  const list = jobs.filter((j) => j.stage === status && j.lines.some((l) => l.fabricId === id));
  const one = list.length === 1;
  const sub: Record<Status, string> = {
    worksheet: `${list.length} ${one ? "job" : "jobs"}`, confirmed: `${list.length} ${one ? "job" : "jobs"}`,
    proposal: `${list.length} ${one ? "quote" : "quotes"}`, used: `${list.length} ${one ? "worksheet" : "worksheets"} completed`,
  };
  return (
    <>
      <PageTitleBar title={STATUS_LABEL[status]} subtitle={fabricName(f)} onBack={() => back(`fabric/${id}`)} />
      <div className="sum"><span className="v">{fmt(stats(id)[status])}</span><span>{sub[status]}</span></div>
      {list.length === 0 && <p className="sub">Nothing here yet.</p>}
      <div className="list">
        {list.map((j) => <JobCard key={j.id} j={j} fabricId={id} />)}
      </div>
    </>
  );
}
