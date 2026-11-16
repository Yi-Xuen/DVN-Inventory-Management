"use client";
import ThemeToggle from "./molecules/ThemeToggle";
import { useEffect, useState } from "react";
import { FABRIC, Job, LIKELIHOODS, ROLLS, RECEIVED_TOTAL, STATUS_LABEL, Status } from "@/lib/data";
import { ON_HAND, StoreProvider, fmt, proposalLabel, useStore } from "@/lib/store";
import { CalcSheet, ReserveSheet } from "./Sheets";
import { ArrowLeft2, ArrowRight2 } from "iconsax-react";
import { Button } from "./atoms/Button";
import { Card } from "./atoms/Card";
import { Pill } from "./atoms/Pill";

function useHash() {
  const [h, setH] = useState("");
  useEffect(() => {
    const read = () => { setH(window.location.hash.replace(/^#\/?/, "")); window.scrollTo(0, 0); };
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, []);
  return h;
}
const go = (to: string) => { window.location.hash = to ? `/${to}` : "/"; };

export default function App() {
  return (
    <StoreProvider>
      <Shell />
    </StoreProvider>
  );
}

function Shell() {
  const { ready, reset } = useStore();
  const hash = useHash();
  const [seg, id] = hash.split("/");
  return (
    <div className="shell">
      <div className="proto-bar">
        <span>Prototype · sample data</span>
        <ThemeToggle />
        <button onClick={() => { if (confirm("Reset the demo to its starting data?")) { reset(); go(""); } }}>Reset demo</button>
      </div>
      <main className="phone">
        {!ready ? null : seg === "job" ? <JobDetail id={id} />
          : seg === "on-hand" ? <OnHand />
          : seg === "worksheet" || seg === "confirmed" || seg === "proposal" || seg === "used" ? <JobList status={seg} />
          : <Overview />}
      </main>
    </div>
  );
}

function TopBar({ to, sup, title }: { to: string; sup: string; title: string }) {
  return (
    <>
      <div className="topbar"><a className="back" href={`#/${to}`} aria-label="Back"><ArrowLeft2 size={24} color="currentColor" /></a></div>
      <div><div className="sup">{sup}</div><h1 className="ttl">{title}</h1></div>
    </>
  );
}

/* ---------- 1. Overview ---------- */
function Overview() {
  const { sum, sumLevel, jobs, balance, prefs } = useStore();
  const [calc, setCalc] = useState(false);
  const [reserving, setReserving] = useState(false);
  const ws = sum("worksheet"), conf = sum("confirmed"), prop = sum("proposal"), used = sum("used");
  const count = (s: Status) => jobs.filter((j) => j.status === s).length;

  // The chart only shows what the calculator takes away from stock.
  const propTaken = LIKELIHOODS.reduce((a, l) => a + (prefs.levels[l] ? sumLevel(l) : 0), 0);
  const propPartial = proposalLabel(prefs).replace(/^proposal/, "").trim(); // e.g. "(very likely, likely)"
  const items = [
    ...(prefs.worksheet ? [{ key: "ws", label: "Worksheet", m: ws }] : []),
    ...(prefs.confirmed ? [{ key: "conf", label: "Confirmed", m: conf }] : []),
    ...(propTaken > 0 ? [{ key: "prop", label: propPartial ? `Proposal ${propPartial}` : "Proposal", m: propTaken }] : []),
  ];
  const demand = items.reduce((a, i) => a + i.m, 0);
  const short = Math.max(demand - ON_HAND, 0);
  const free = Math.max(ON_HAND - demand, 0);
  const total = Math.max(ON_HAND, demand) || 1;
  const pct = (n: number) => `${(n / total) * 100}%`;
  let room = ON_HAND; // fill the bar in order; whatever does not fit in stock becomes "out of stock"
  const segs = items.map((i) => { const inStock = Math.min(i.m, room); room -= inStock; return { ...i, inStock }; });

  const parts = ["On hand", ...(["worksheet", "confirmed"] as const).filter((k) => prefs[k]), ...(proposalLabel(prefs) ? [proposalLabel(prefs)] : [])];
  const bal = balance;
  const label =
    `On hand ${fmt(ON_HAND)}: ` + items.map((i) => `${i.label.toLowerCase()} ${fmt(i.m)}`).join(", ") +
    (items.length ? ", " : "") + (short ? `${fmt(short)} out of stock.` : `${fmt(free)} available.`);

  return (
    <>
      <div className="topbar" style={{ minHeight: 8 }} />
      <div><div className="sup">{FABRIC.brand}</div><h1 className="ttl">{FABRIC.name}</h1></div>

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
          {segs.map((g) => g.inStock > 0 && <i key={g.key} className={`sw-${g.key === "prop" ? "prop" : g.key}`} style={{ width: pct(g.inStock) }} />)}
          {short > 0 ? (
            <>
              <i className="short" style={{ width: pct(short) }} />
              <span className="oos" style={{ left: pct(ON_HAND) }} aria-hidden="true" />
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

      <NavCard to="on-hand" title="On hand" v={fmt(ON_HAND)} small={`${ROLLS.length} rolls in factory`} />
      <NavCard to="worksheet" title="Worksheet" v={fmt(ws)} small={`${count("worksheet")} jobs`} />
      <NavCard to="confirmed" title="Confirmed" v={fmt(conf)} small={`${count("confirmed")} jobs`} />
      <NavCard to="proposal" title="Proposal" v={fmt(prop)} small={`${count("proposal")} quotes`} />
      <NavCard to="used" title="Used" v={fmt(used)} small={`${count("used")} worksheets completed`} />

      <div className="stickybtn"><Button onClick={() => setReserving(true)}>Reserve this fabric</Button></div>

      {calc && <CalcSheet onClose={() => setCalc(false)} />}
      {reserving && (
        <ReserveSheet
          onClose={() => setReserving(false)}
          onDone={() => setReserving(false)}
        />
      )}
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

/* ---------- 2. On hand ---------- */
function OnHand() {
  return (
    <>
      <TopBar to="" sup={FABRIC.name} title="On hand" />
      <div className="sum"><span className="v">{fmt(ON_HAND)}</span><span>{ROLLS.length} rolls in factory</span></div>
      <p className="cap">Rolls</p>
      <div className="list">
        {ROLLS.map((r) => (
          <Card className="roll" key={r.code}>
            <span className="code">{r.code} {r.short && <Pill tone="danger">Short end</Pill>}</span>
            <span className="v">{fmt(r.left)}</span>
            <small>Received {r.month} · {fmt(r.received)}</small>
            <div className="rb"><i style={{ width: `${(r.left / r.received) * 100}%` }} /></div>
          </Card>
        ))}
      </div>
      <p className="sub">Only the factory can change roll amounts.</p>
      <p className="sub">Roll codes: year and month received, then a letter. 2611-A is the first roll received in November 2026 (YYMM). The letter counts the rolls of that fabric received that month, starting at A and skipping I and O.</p>
      <p className="sub">Received {fmt(RECEIVED_TOTAL)} in total.</p>
    </>
  );
}

/* ---------- 3-6. Lists ---------- */
function JobList({ status }: { status: Status }) {
  const { jobs, sum, inStockIds } = useStore();
  const list = jobs.filter((j) => j.status === status);
  const sub: Record<Status, string> = {
    worksheet: `${list.length} jobs`, confirmed: `${list.length} jobs`,
    proposal: `${list.length} quotes`, used: `${list.length} worksheets completed`,
  };
  return (
    <>
      <TopBar to="" sup={FABRIC.name} title={STATUS_LABEL[status]} />
      <div className="sum"><span className="v">{fmt(sum(status))}</span><span>{sub[status]}</span></div>
      {list.length === 0 && <p className="sub">Nothing here yet.</p>}
      <div className="list">
        {list.map((j) => <JobCard key={j.id} j={j} inStock={inStockIds.has(j.id)} />)}
      </div>
    </>
  );
}

function JobCard({ j, inStock }: { j: Job; inStock: boolean }) {
  const isUsed = j.status === "used";
  const body = (
    <>
      <div className="job-top"><b>{j.customer}, {j.location}</b><span className="v">{fmt(j.metres)}</span></div>
      {j.wsNo && <div className="job-ref">WS {j.wsNo}{j.rooms ? ` · ${j.rooms.length} ${j.rooms.length === 1 ? "room" : "rooms"}` : ""}{j.completed ? ` · completed ${j.completed}` : ""}</div>}
      {isUsed ? (
        <dl className="meta"><div><dt>From rolls</dt><dd className="num">{j.rolls?.join(", ")}</dd></div></dl>
      ) : (
        <dl className="meta">
          <div><dt>Reserved by</dt><dd>{j.by}</dd></div>
          <div><dt>Est. handover</dt><dd>{j.handover ?? "Not set"}</dd></div>
          {j.likelihood && <div><dt>Likely to confirm</dt><dd>{j.likelihood}</dd></div>}
        </dl>
      )}
      {!isUsed && (
        <div className="job-foot">
          {j.status === "worksheet" && <Pill tone={j.sewing === "Queued for sewing" ? "soft" : "neutral"}>{j.sewing}</Pill>}
          {j.status === "proposal" && <Pill tone={inStock ? "neutral" : "danger"}>{inStock ? "In stock" : "Backorder"}</Pill>}
          <span className="go inline-flex"><ArrowRight2 size={20} color="currentColor" aria-hidden="true" /></span>
        </div>
      )}
    </>
  );
  return isUsed ? <Card className="job">{body}</Card> : <Card className="job" href={`#/job/${j.id}`}>{body}</Card>;
}

/* ---------- 3b. Job detail ---------- */
function JobDetail({ id }: { id: string }) {
  const { jobs } = useStore();
  const j = jobs.find((x) => x.id === id);
  if (!j) return (<><TopBar to="" sup={FABRIC.name} title="Job not found" /><p className="sub">This job is no longer in the demo data.</p></>);
  return (
    <>
      <TopBar to={j.status} sup={j.wsNo ? `WS ${j.wsNo}` : STATUS_LABEL[j.status]} title={`${j.customer}, ${j.location}`} />
      <div><Pill tone={j.sewing === "Queued for sewing" ? "soft" : "neutral"}>{j.sewing ?? STATUS_LABEL[j.status]}</Pill></div>
      <Card>
        <dl className="meta">
          <div><dt>Reserved by</dt><dd>{j.by}</dd></div>
          <div><dt>Est. handover</dt><dd>{j.handover ?? "Not set"}</dd></div>
          {j.likelihood && <div><dt>Likely to confirm</dt><dd>{j.likelihood}</dd></div>}
          {j.meta?.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
        </dl>
      </Card>
      <Card>
        <p className="cap">{FABRIC.name}</p>
        <div className="lines">
          {j.rooms ? j.rooms.map((r) => <div key={r.ref}><span>{r.ref} · {r.name}</span><span className="num">{fmt(r.m)}</span></div>) : null}
          <div className="tot"><span>Reserved</span><span className="num">{fmt(j.metres)}</span></div>
        </div>
      </Card>
      {j.otherFabric?.map((f) => (
        <Card key={f.ref}>
          <p className="cap">{f.name}</p>
          <div className="lines">
            <div><span>{f.ref} · {f.room}</span><span className="num">TBC</span></div>
            <div className="tot"><span>Reserved</span><span className="num">TBC</span></div>
          </div>
        </Card>
      ))}
      <div className="log"><p className="cap">Updates</p>{j.log.map((l) => <p key={l}>{l}</p>)}</div>
    </>
  );
}
