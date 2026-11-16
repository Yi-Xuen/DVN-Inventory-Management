"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown2 } from "iconsax-react";
import { Button } from "../atoms/Button";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const ROW = 44; // px, must match .wheel-item height in globals.css

/** "Nov 2026" -> months since year 0, or null. */
function parse(v: string): number | null {
  const [m, y] = v.split(" ");
  const mi = MONTHS.indexOf(m);
  return mi < 0 || !y ? null : Number(y) * 12 + mi;
}
const format = (n: number) => `${MONTHS[n % 12]} ${Math.floor(n / 12)}`;

/** One scrolling column that snaps to a centred row. */
function Wheel({ items, index, onChange, label }: { items: string[]; index: number; onChange: (i: number) => void; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [live, setLive] = useState(index);
  const indexRef = useRef(index);
  indexRef.current = index;

  // Follow the controlled index (initial position, clamping, taps).
  useEffect(() => {
    setLive(index);
    const el = ref.current;
    if (el && Math.round(el.scrollTop / ROW) !== index) el.scrollTo({ top: index * ROW, behavior: el.dataset.ready ? "smooth" : "instant" });
    if (el) el.dataset.ready = "1";
  }, [index]);

  const onScroll = () => {
    const el = ref.current;
    if (!el) return;
    const i = Math.min(items.length - 1, Math.max(0, Math.round(el.scrollTop / ROW)));
    setLive(i);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      if (i !== indexRef.current) onChange(i);
      // The parent may clamp the choice; snap back to whatever it settled on.
      requestAnimationFrame(() => {
        const cur = ref.current;
        if (cur && Math.round(cur.scrollTop / ROW) !== indexRef.current) { cur.scrollTo({ top: indexRef.current * ROW, behavior: "smooth" }); setLive(indexRef.current); }
      });
    }, 90);
  };
  useEffect(() => () => clearTimeout(timer.current), []);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return;
    e.preventDefault();
    onChange(Math.min(items.length - 1, Math.max(0, index + (e.key === "ArrowDown" ? 1 : -1))));
  };

  return (
    <div ref={ref} className="wheel" role="listbox" aria-label={label} tabIndex={0} onScroll={onScroll} onKeyDown={onKey}>
      {items.map((it, i) => (
        <div key={it} role="option" aria-selected={i === live} className={`wheel-item${i === live ? " on" : ""}`} onClick={() => onChange(i)}>{it}</div>
      ))}
    </div>
  );
}

export type MonthYearPickerProps = {
  /** "Nov 2026", or "" when nothing is chosen. */
  value: string;
  onChange: (value: string) => void;
  /** Earliest and latest selectable month, e.g. "Nov 2026". */
  min: string;
  max: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  placeholder?: string;
  /** Shows a Clear button in the sheet. */
  optional?: boolean;
  invalid?: boolean;
  id?: string;
  title?: string;
};

/** Field that opens a bottom sheet with month and year dials. */
export function MonthYearPicker({ value, onChange, min, max, open, onOpenChange, placeholder = "Month, year", optional, invalid, id, title = "Est. handover date" }: MonthYearPickerProps) {
  const lo = parse(min) ?? 0;
  const hi = parse(max) ?? lo;
  const clamp = (n: number) => Math.min(hi, Math.max(lo, n));
  const [draft, setDraft] = useState(() => clamp(parse(value) ?? lo));
  useEffect(() => { if (open) setDraft(clamp(parse(value) ?? lo)); }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const years: string[] = [];
  for (let y = Math.floor(lo / 12); y <= Math.floor(hi / 12); y++) years.push(String(y));
  const y0 = Math.floor(lo / 12);
  const month = draft % 12;
  const year = Math.floor(draft / 12);
  const set = (m: number, y: number) => setDraft(clamp(y * 12 + m));

  return (
    <>
      <button
        type="button"
        id={id}
        aria-haspopup="dialog"
        aria-invalid={invalid || undefined}
        onClick={() => onOpenChange(true)}
        className={`body-2 relative flex min-h-12 w-full items-center rounded-ds-2 border bg-surface px-3 pr-10 text-left ${invalid ? "border-line-danger" : "border-line-strong"} ${value ? "text-fg" : "text-fg-subtle"}`}
      >
        {value || placeholder}
        <ArrowDown2 size={16} color="currentColor" className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-icon" />
      </button>
      {open && (
        <>
          <div className="scrim top" onClick={() => onOpenChange(false)} aria-hidden="true" />
          <div className="sheet top" role="dialog" aria-modal="true" aria-label={title}>
            <div className="grab" />
            <h2>{title}</h2>
            <div className="wheels">
              <div className="wheel-band" aria-hidden="true" />
              <Wheel label="Month" items={MONTHS} index={month} onChange={(m) => set(m, year)} />
              <Wheel label="Year" items={years} index={year - y0} onChange={(i) => set(month, y0 + i)} />
            </div>
            <Button onClick={() => { onChange(format(draft)); onOpenChange(false); }}>Done</Button>
            {optional && value && (
              <Button variant="secondary" onClick={() => { onChange(""); onOpenChange(false); }}>Clear</Button>
            )}
          </div>
        </>
      )}
    </>
  );
}
