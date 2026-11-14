"use client";
import { useEffect, useState } from "react";
import { FABRIC, STATUS_LABEL, Status, handoverOptions, RECEIVED_TOTAL, USED_TOTAL } from "@/lib/data";
import { CalcPrefs, ON_HAND, fmt, useStore } from "@/lib/store";

function useSheetBehaviour(onClose: () => void) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const key = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", key);
    return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", key); };
  }, [onClose]);
}

/* ---------- Balance calculator ---------- */
export function CalcSheet({ onClose }: { onClose: () => void }) {
  const { prefs, setPrefs, sum } = useStore();
  const [draft, setDraft] = useState<CalcPrefs>(prefs);
  useSheetBehaviour(onClose);

  const rows: { k: keyof CalcPrefs; label: string; sw: string; note: string }[] = [
    { k: "worksheet", label: "Worksheet", sw: "sw-ws", note: "queued or sewing" },
    { k: "confirmed", label: "Confirmed", sw: "sw-conf", note: "no worksheet yet" },
    { k: "proposal", label: "Proposal", sw: "sw-prop", note: "may be cancelled" },
  ];
  let bal = ON_HAND;
  const parts = ["On hand"];
  rows.forEach((r) => { if (draft[r.k]) { bal -= sum(r.k); parts.push(r.k); } });

  return (
    <>
      <div className="scrim" onClick={onClose} aria-hidden="true" />
      <div className="sheet" role="dialog" aria-modal="true" aria-label="Calculate balance">
        <div className="grab" />
        <h2>Calculate balance</h2>
        <p className="sub">Tick what to take away from the stock on hand.</p>
        <div className="fixed-row">
          <div><b>On hand</b><small>Received {RECEIVED_TOTAL} m − used {USED_TOTAL} m</small></div>
          <span className="v">{fmt(ON_HAND)}</span>
        </div>
        {rows.map((r) => (
          <label className="opt" key={r.k}>
            <input type="checkbox" checked={draft[r.k]} onChange={(e) => setDraft({ ...draft, [r.k]: e.target.checked })} />
            <div><b><i className={`sw ${r.sw}`} />{r.label}</b><small>{r.note}</small></div>
            <span className="v">− {fmt(sum(r.k))}</span>
          </label>
        ))}
        <div className="result">
          <b>Balance</b>
          <span className={`v ${bal < 0 ? "neg" : ""}`}>{bal < 0 ? "− " : ""}{fmt(Math.abs(bal))}</span>
          <small>{parts.join(" − ")}</small>
        </div>
        {bal < 0 && <div className="buy"><span>To buy</span><span className="num">{fmt(Math.abs(bal))}</span></div>}
        <button className="btn" onClick={() => { setPrefs(draft); onClose(); }}>Apply</button>
      </div>
    </>
  );
}

/* ---------- Reserve flow ---------- */
type RStatus = Exclude<Status, "used">;
const TABS: RStatus[] = ["proposal", "confirmed", "worksheet"];

export function ReserveSheet({ onClose, onDone }: { onClose: () => void; onDone: (id: string, status: RStatus) => void }) {
  const { avail, reserve } = useStore();
  useSheetBehaviour(onClose);
  const [step, setStep] = useState<"amount" | "form" | "done">("amount");
  const [status, setStatus] = useState<RStatus>("proposal");
  const [amount, setAmount] = useState("15");
  const [touched, setTouched] = useState(false);
  const [customer, setCustomer] = useState("");
  const [location, setLocation] = useState("");
  const [handover, setHandover] = useState("");
  const [tryNext, setTryNext] = useState(false);
  const [doneJob, setDoneJob] = useState<{ id: string } | null>(null);

  const metres = parseFloat(amount) || 0;
  const needHandover = status !== "proposal";
  const over = metres > Math.max(avail, 0);

  const press = (k: string) => {
    let next: string;
    if (k === "⌫") next = amount.slice(0, -1);
    else {
      const cur = touched ? amount : ""; // first tap replaces the sample value
      if (k === ".") { if (cur.includes(".")) return; next = (cur || "0") + "."; }
      else next = cur === "0" ? k : cur + k;
      if (next.length > 6 || /\.\d{3}/.test(next)) return;
    }
    setTouched(true);
    setAmount(next);
  };

  const missing = !customer.trim() || !location.trim() || (needHandover && !handover);
  const submit = () => {
    setTryNext(true);
    if (missing || metres <= 0) return;
    const j = reserve({ status, metres, customer: customer.trim(), location: location.trim(), handover: handover || null });
    setDoneJob({ id: j.id });
    setStep("done");
  };

  const Header = (
    <>
      <div className="grab" />
      <div><h2>Reserve</h2><p className="sub">{FABRIC.name}</p></div>
    </>
  );

  return (
    <>
      <div className="scrim" onClick={step === "done" ? undefined : onClose} aria-hidden="true" />
      <div className="sheet" role="dialog" aria-modal="true" aria-label="Reserve fabric">
        {step === "amount" && (
          <>
            {Header}
            <div className="seg" role="tablist" aria-label="Reserve as">
              {TABS.map((t) => (
                <button key={t} role="tab" aria-selected={status === t} className={status === t ? "on" : ""} onClick={() => setStatus(t)}>{STATUS_LABEL[t]}</button>
              ))}
            </div>
            <p className="q">How much do you want to reserve?</p>
            <div className="amt" aria-live="polite"><span className="num">{amount || "0"}</span> <small>m</small></div>
            <div className="pad" role="group" aria-label="Number pad">
              {["1","2","3","4","5","6","7","8","9",".","0","⌫"].map((k) => (
                <button key={k} type="button" aria-label={k === "⌫" ? "Delete" : k === "." ? "Decimal point" : k} onClick={() => press(k)}>{k}</button>
              ))}
            </div>
            <button className="btn" disabled={metres <= 0} onClick={() => setStep("form")}>Next →</button>
          </>
        )}

        {step === "form" && (
          <>
            {Header}
            <div className="fld">
              <label className="cap" htmlFor="rs-status">Reserve for</label>
              <select id="rs-status" className="box pre" value={status} onChange={(e) => setStatus(e.target.value as RStatus)}>
                {TABS.map((t) => <option key={t} value={t}>{STATUS_LABEL[t]}</option>)}
              </select>
            </div>
            <div className="fld">
              <span className="cap">Reservation amount</span>
              <div className="box pre"><span className="num">{fmt(metres)}</span><button type="button" onClick={() => setStep("amount")}>Edit</button></div>
              {over && (
                <p className="warn">
                  {status === "proposal"
                    ? `Only ${fmt(Math.max(avail, 0))} is available, so this quote will be tagged Backorder.`
                    : `More than the ${fmt(Math.max(avail, 0))} available. The extra will count as out of stock.`}
                </p>
              )}
            </div>
            <div className="fld">
              <label className="cap" htmlFor="rs-cust">Customer name</label>
              <input id="rs-cust" className={`box ${tryNext && !customer.trim() ? "err" : ""}`} placeholder="e.g. Mrs Tan" autoComplete="off" value={customer} onChange={(e) => setCustomer(e.target.value)} />
            </div>
            <div className="fld">
              <label className="cap" htmlFor="rs-loc">Location</label>
              <input id="rs-loc" className={`box ${tryNext && !location.trim() ? "err" : ""}`} placeholder="e.g. Tanjung Bungah" autoComplete="off" value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>
            <div className="fld">
              <label className="cap" htmlFor="rs-ho">Est. handover date <em className={needHandover ? "req" : ""}>· {needHandover ? "Required" : "Optional"}</em></label>
              <select id="rs-ho" className={`box ${tryNext && needHandover && !handover ? "err" : ""}`} value={handover} onChange={(e) => setHandover(e.target.value)}>
                <option value="">Month, year</option>
                {handoverOptions().map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
              {tryNext && needHandover && !handover && <span className="hint err">Choose a month and year to continue.</span>}
            </div>
            <button className="btn" onClick={submit}>Reserve as {STATUS_LABEL[status]}</button>
          </>
        )}

        {step === "done" && doneJob && (
          <>
            <div className="grab" />
            <div className="done">
              <div className="tick" aria-hidden="true"><svg width="30" height="30" viewBox="0 0 30 30" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M7 16l6 6 11-13" /></svg></div>
              <h2>Reserved</h2>
              <p className="sub">{fmt(metres)} of {FABRIC.name} is reserved as a {STATUS_LABEL[status]} {status === "proposal" ? "quote" : "job"}.</p>
            </div>
            <div className="card">
              <dl className="meta">
                <div><dt>Customer</dt><dd>{customer}</dd></div>
                <div><dt>Location</dt><dd>{location}</dd></div>
                <div><dt>Est. handover</dt><dd>{handover || "Not set"}</dd></div>
                <div><dt>Reserved by</dt><dd>Jason</dd></div>
              </dl>
            </div>
            <button className="btn" onClick={() => onDone(doneJob.id, status)}>Back to fabric</button>
          </>
        )}
      </div>
    </>
  );
}
