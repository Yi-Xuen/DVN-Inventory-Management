import { useId } from "react";

export type SliderProps = {
  /** Labels for each stop, left to right. The slider snaps between them. */
  stops: readonly string[];
  /** Index of the selected stop. */
  value: number;
  onChange: (index: number) => void;
  "aria-label"?: string;
  id?: string;
};

/**
 * Stepped slider with a label under every stop (tap a label to jump to it).
 * Fill and thumb use the primary button colour (--bg-primary).
 */
export function Slider({ stops, value, onChange, "aria-label": label, id }: SliderProps) {
  const autoId = useId();
  const max = stops.length - 1;
  return (
    <div>
      <input
        id={id ?? autoId}
        className="slider"
        type="range"
        min={0}
        max={max}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
        aria-valuetext={stops[value]}
        style={{ ["--pos" as string]: `${(value / max) * 100}%` }}
      />
      <div className="stops" aria-hidden="true">
        {stops.map((s, i) => (
          <button key={s} type="button" tabIndex={-1} className={i === value ? "on" : ""} onClick={() => onChange(i)}>
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
