export type SegmentedControlProps<T extends string> = {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  "aria-label": string;
};

/** Equal-width tab switcher on a raised track (radius-3 track, radius-2 segments). */
export function SegmentedControl<T extends string>({ options, value, onChange, "aria-label": label }: SegmentedControlProps<T>) {
  return (
    <div
      role="tablist"
      aria-label={label}
      className="grid gap-1 rounded-ds-3 bg-raised p-1"
      style={{ gridTemplateColumns: `repeat(${options.length}, 1fr)` }}
    >
      {options.map((o) => {
        const on = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="tab"
            aria-selected={on}
            onClick={() => onChange(o.value)}
            className={`label-3 min-h-11 cursor-pointer rounded-ds-2 border px-1 py-3 ${
              on ? "border-transparent bg-surface text-fg shadow-ds-1" : "border-transparent bg-transparent text-fg-subtle"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
