"use client";
import { useEffect, useRef, useState } from "react";
import { FABRIC, LIKELIHOODS, STATUS_LABEL, Status, handoverOptions, RECEIVED_TOTAL, USED_TOTAL } from "@/lib/data";
import { CalcPrefs, ON_HAND, fmt, proposalLabel, useStore } from "@/lib/store";
import { ArrowRight2 } from "iconsax-react";
import { Button } from "./ui/Button";
import { Checkbox } from "./ui/Checkbox";
import { Card } from "./ui/Card";
import { Input, Select } from "./ui/Field";
import { SegmentedControl } from "./ui/SegmentedControl";

function useSheetBehaviour(onClose: () => void) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const key = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", key);
    const vv = window.visualViewport;
    const root = document.documentElement.style;
    const fit = () => {
      if (!vv) return;
      root.setProperty("--kb", `${Math.max(0, window.innerHeight - vv.height - vv.offsetTop)}px`);
      root.setProperty("--vvh", `${vv.height}px`);
      root.setProperty("--vvtop", `${vv.offsetTop}px`);
    };
    fit();
    vv?.addEventListener("resize", fit);
    vv?.addEventListener("scroll", fit);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", key);
      vv?.removeEventListener("resize", fit);
      vv?.removeEventListener("scroll", fit);
      root.removeProperty("--kb");
      root.removeProperty("--vvh");
      root.removeProperty("--vvtop");
    };
  }, [onClose]);
}

/* ---------- Balance calculator ---------- */
const LEVELS_DESC = [...LIKELIHOODS].reverse(); // Very likely, Likely, Unlikely

export function CalcSheet({ onClose }: { onClose: () => void }) {
  const { prefs, setPrefs, sum, sumLevel } = useStore();
  const [draft, setDraft] = useState<CalcPrefs>(prefs);
  useSheetBehaviour(onClose);

  const onCount = LEVELS_DESC.filter((l) => draft.levels[l]).length;

  const setAllLevels = (v: boolean) => setDraft({ ...draft, levels: { "Very likely": v, Likely: v, Unlikely: v } });
  const propTaken = LEVELS_DESC.reduce((a, l) => a + (draft.levels[l] ? sumLevel(l) : 0), 0);

  let bal = ON_HAND - (draft.worksheet ? sum("worksheet") : 0) - (draft.confirmed ? sum("confirmed") : 0) - propTaken;
  const parts = ["On hand", ...(["worksheet", "confirmed"] as const).filter((k) => draft[k]), ...(proposalLabel(draft) ? [proposalLabel(draft)] : [])];

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
        {([["worksheet", "Worksheet", "sw-ws", "queued or sewing"], ["confirmed", "Confirmed", "sw-conf", "no worksheet yet"]] as const).map(([k, label, sw, note]) => (
          <label className="opt" key={k}>
            <Checkbox checked={draft[k]} onChange={(e) => setDraft({ ...draft, [k]: e.target.checked })} aria-label={label} />
            <div><b><i className={`sw ${sw}`} />{label}</b><small>{note}</small></div>
            <span className="v">− {fmt(sum(k))}</span>
          </label>
        ))}
        <div className="opt-group">
          <label className="opt">
            <Checkbox indeterminate={onCount > 0 && onCount < 3} checked={onCount === 3} onChange={(e) => setAllLevels(e.target.checked)} aria-label="Proposal, all" />
            <div><b><i className="sw sw-prop" />Proposal</b><small>may be cancelled · pick by how likely</small></div>
            <span className="v">− {fmt(propTaken)}</span>
          </label>
          <div className="opt-children" role="group" aria-label="Proposal by likelihood">
            {LEVELS_DESC.map((l) => (
              <label className="opt child" key={l}>
                <Checkbox checked={draft.levels[l]} onChange={(e) => setDraft({ ...draft, levels: { ...draft.levels, [l]: e.target.checked } })} aria-label={l} />
                <div><b>{l}</b></div>
                <span className="v">− {fmt(sumLevel(l))}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="result">
          <b>Balance</b>
          <span className={`v ${bal < 0 ? "neg" : ""}`}>{bal < 0 ? "− " : ""}{fmt(Math.abs(bal))}</span>
          <small>{parts.join(" − ")}</small>
        </div>
        {bal < 0 && <div className="buy"><span>To buy</span><span className="num">{fmt(Math.abs(bal))}</span></div>}
        <Button onClick={() => { setPrefs(draft); onClose(); }}>Apply</Button>
      </div>
    </>
  );
}

/* ---------- Likelihood help ---------- */
const LIKELIHOOD_HELP: { label: string; when: string }[] = [
  { label: "Very likely", when: "Probably a returning customer." },
  { label: "Likely", when: "About 50/50. It could go either way." },
  { label: "Unlikely", when: "A walk-in customer who seems to be just comparing prices. Not likely to confirm." },
];

function LikelihoodHelp({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div className="scrim top" onClick={onClose} aria-hidden="true" />
      <div className="sheet top" role="dialog" aria-modal="true" aria-label="How to choose likelihood">
        <div className="grab" />
        <h2>How likely is the customer to confirm?</h2>
        <p className="sub">Pick the one that fits best when you quote.</p>
        <dl className="help">
          {LIKELIHOOD_HELP.map((h) => (
            <div key={h.label}><dt>{h.label}</dt><dd>{h.when}</dd></div>
          ))}
        </dl>
        <Button onClick={onClose}>Got it</Button>
      </div>
    </>
  );
}

/* ---------- Reserve flow ---------- */
type RStatus = Exclude<Status, "used">;
const TABS: RStatus[] = ["proposal", "confirmed", "worksheet"];

export function ReserveSheet({ onClose, onDone }: { onClose: () => void; onDone: (id: string, status: RStatus) => void }) {
  const { avail, reserve } = useStore();
  const [help, setHelp] = useState(false);
  useSheetBehaviour(() => (help ? setHelp(false) : onClose()));
  const [step, setStep] = useState<"amount" | "form" | "done">("amount");
  const [status, setStatus] = useState<RStatus>("proposal");
  const [amount, setAmount] = useState("0");
  const [customer, setCustomer] = useState("");
  const [location, setLocation] = useState("");
  const [handover, setHandover] = useState("");
  const MIDDLE = 1; // Likely is always the starting stop
  const [likeIdx, setLikeIdx] = useState(MIDDLE);
  const pickStatus = (t: RStatus) => { setStatus(t); if (t === "proposal") setLikeIdx(MIDDLE); };
  const [tryNext, setTryNext] = useState(false);
  const [doneJob, setDoneJob] = useState<{ id: string } | null>(null);

  const metres = parseInt(amount, 10) || 0;
  const needHandover = status !== "proposal";
  const over = metres > Math.max(avail, 0);

  const amountRef = useRef<HTMLInputElement>(null);
  useEffect(() => { if (step === "amount") amountRef.current?.focus(); }, [step]);
  const onAmount = (raw: string) => {
    let v = raw.replace(/\D/g, ""); // whole metres only
    if (v.length > 5) return;
    v = v.replace(/^0+(?=\d)/, ""); // "05" -> "5"
    setAmount(v === "" ? "0" : v);
  };

  const missing = !customer.trim() || !location.trim() || (needHandover && !handover);
  const submit = () => {
    setTryNext(true);
    if (missing || metres <= 0) return;
    const j = reserve({ status, metres, customer: customer.trim(), location: location.trim(), handover: handover || null, likelihood: status === "proposal" ? LIKELIHOODS[likeIdx] : undefined });
    setDoneJob({ id: j.id });
    setStep("done");
  };

  return (
    <>
      <div className="scrim" aria-hidden="true" />
      <div className="screen" role="dialog" aria-modal="true" aria-label="Reserve fabric">
        {step !== "done" && (
          <>
            <div className="screen-top">
              <h2>Reserve Fabric</h2>
              <button type="button" className="close" aria-label="Cancel reservation" onClick={onClose}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="M4 4l12 12M16 4L4 16" /></svg>
              </button>
            </div>
            <Card className="fabric-card" aria-label="Fabric being reserved">
              <span className="cap">Fabric</span>
              <span className="sup">{FABRIC.brand}</span>
              <b>{FABRIC.name}</b>
            </Card>
          </>
        )}
        {step === "amount" && (
          <>
            <SegmentedControl
              aria-label="Reserve as"
              options={TABS.map((v) => ({ value: v, label: STATUS_LABEL[v] }))}
              value={status}
              onChange={pickStatus}
            />
            <p className="q">How much do you want to reserve?</p>
            <div className="amt">
              <input
                ref={amountRef} className="amt-input num" type="text" inputMode="numeric" pattern="[0-9]*"
                enterKeyHint="next" autoComplete="off" aria-label="Metres to reserve" value={amount}
                style={{ width: `${amount.length + 0.6}ch` }}
                onChange={(e) => onAmount(e.target.value)}
                onFocus={(e) => e.currentTarget.select()}
                onKeyDown={(e) => { if (e.key === "Enter" && metres > 0) { setLikeIdx(MIDDLE); setStep("form"); } }}
              />
              <small>m</small>
            </div>
            <div className="screen-foot"><Button disabled={metres <= 0} onClick={() => { setLikeIdx(MIDDLE); setStep("form"); }}><span className="inline-flex items-center justify-center gap-2">Next <ArrowRight2 size={16} color="currentColor" aria-hidden="true" /></span></Button></div>
          </>
        )}

        {step === "form" && (
          <>
            <div className="fld">
              <label className="cap" htmlFor="rs-status">Reserve for</label>
              <Select id="rs-status" muted value={status} onChange={(e) => pickStatus(e.target.value as RStatus)}>
                {TABS.map((t) => <option key={t} value={t}>{STATUS_LABEL[t]}</option>)}
              </Select>
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
              <Input id="rs-cust" invalid={tryNext && !customer.trim()} placeholder="e.g. Mrs Tan" autoComplete="off" value={customer} onChange={(e) => setCustomer(e.target.value)} />
            </div>
            <div className="fld">
              <label className="cap" htmlFor="rs-loc">Location</label>
              <Input id="rs-loc" invalid={tryNext && !location.trim()} placeholder="e.g. Tanjung Bungah" autoComplete="off" value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>
            <div className="fld">
              <label className="cap" htmlFor="rs-ho">Est. handover date <em className={needHandover ? "req" : ""}>· {needHandover ? "Required" : "Optional"}</em></label>
              <Select id="rs-ho" invalid={tryNext && needHandover && !handover} value={handover} onChange={(e) => setHandover(e.target.value)}>
                <option value="">Month, year</option>
                {handoverOptions().map((o) => <option key={o} value={o}>{o}</option>)}
              </Select>
              {tryNext && needHandover && !handover && <span className="hint err">Choose a month and year to continue.</span>}
            </div>
            {status === "proposal" && (
              <div className="fld">
                <div className="cap-row">
                  <label className="cap" htmlFor="rs-like">How likely is the customer going to confirm?</label>
                  <button type="button" className="info" aria-label="When to choose each option" onClick={() => setHelp(true)}>
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><circle cx="9" cy="9" r="7.5" /><path d="M9 8v4.5" strokeLinecap="round" /><circle cx="9" cy="5.4" r="0.6" fill="currentColor" stroke="none" /></svg>
                  </button>
                </div>
                <input
                  id="rs-like" className="slider" type="range" min={0} max={2} step={1} value={likeIdx}
                  onChange={(e) => setLikeIdx(Number(e.target.value))}
                  aria-valuetext={LIKELIHOODS[likeIdx]}
                  style={{ ["--pos" as string]: `${likeIdx * 50}%` }}
                />
                <div className="stops" aria-hidden="true">
                  {LIKELIHOODS.map((l, i) => (
                    <button key={l} type="button" tabIndex={-1} className={i === likeIdx ? "on" : ""} onClick={() => setLikeIdx(i)}>{l}</button>
                  ))}
                </div>
              </div>
            )}
            <div className="screen-foot"><Button onClick={submit}>Reserve as {STATUS_LABEL[status]}</Button></div>
          </>
        )}

        {step === "done" && doneJob && (
          <>
            <div className="done">
              <div className="tick" aria-hidden="true"><svg width="30" height="30" viewBox="0 0 30 30" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M7 16l6 6 11-13" /></svg></div>
              <h2>Reserved</h2>
              <p className="sub">{fmt(metres)} of {FABRIC.name} is reserved as a {STATUS_LABEL[status]} {status === "proposal" ? "quote" : "job"}.</p>
            </div>
            <Card>
              <dl className="meta">
                <div><dt>Customer</dt><dd>{customer}</dd></div>
                <div><dt>Location</dt><dd>{location}</dd></div>
                <div><dt>Est. handover</dt><dd>{handover || "Not set"}</dd></div>
                <div><dt>Reserved by</dt><dd>Jason</dd></div>
                {status === "proposal" && <div><dt>Likely to confirm</dt><dd>{LIKELIHOODS[likeIdx]}</dd></div>}
              </dl>
            </Card>
            <div className="screen-foot"><Button onClick={() => onDone(doneJob.id, status)}>Back to fabric</Button></div>
          </>
        )}
      </div>
      {help && <LikelihoodHelp onClose={() => setHelp(false)} />}
    </>
  );
}
