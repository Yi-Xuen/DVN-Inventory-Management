import { useId, type InputHTMLAttributes, type SelectHTMLAttributes } from "react";
import { ArrowDown2 } from "iconsax-react";
import { Label } from "./Label";

const BOX =
  "body-2 min-h-12 w-full rounded-ds-2 border bg-surface px-3 text-fg placeholder:text-fg-subtle focus-ring focus:border-line-focus enabled:hover:border-line-primary disabled:cursor-not-allowed disabled:bg-disabled disabled:text-fg-disabled";
const border = (invalid?: boolean, muted?: boolean) =>
  invalid ? "border-line-danger" : muted ? "border-transparent bg-raised body-2-semibold" : "border-line-strong";

export type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  /** Switches the border to the danger colour. */
  invalid?: boolean;
  /** Name of the field. Shown above the input, or used as its spoken name when `showLabel` is false. */
  label?: string;
  /** Show the label above the input (default). Set false to hide it; screen readers still read it. */
  showLabel?: boolean;
};

/** Single-line text input with its label. */
export function TextField({ invalid, label, showLabel = true, className = "", id, ...props }: TextFieldProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const visibleLabel = !!label && showLabel;
  const input = (
    <input
      id={inputId}
      aria-label={label && !showLabel ? label : undefined}
      aria-invalid={invalid || undefined}
      className={`${BOX} ${border(invalid)} ${className}`}
      {...props}
    />
  );
  if (!visibleLabel) return input;
  return (
    <div className="grid gap-1">
      <Label htmlFor={inputId} required={props.required}>{label}</Label>
      {input}
    </div>
  );
}

export type NumberInputProps = Omit<TextFieldProps, "type" | "label" | "showLabel"> & {
  /** Unit shown inside the box on the right. Defaults to "m" (metres). */
  suffix?: string;
};

/** Number input with a unit, for metres. Opens the decimal keypad on phones. */
export function NumberInput({ invalid, suffix = "m", className = "", min = 0, step = "0.01", ...props }: NumberInputProps) {
  return (
    <div className="relative">
      <input
        type="number"
        inputMode="decimal"
        min={min}
        step={step}
        aria-invalid={invalid || undefined}
        className={`${BOX} ${border(invalid)} pr-10 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none ${className}`}
        {...props}
      />
      <span aria-hidden="true" className="body-2-semibold pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-fg-subtle">
        {suffix}
      </span>
    </div>
  );
}

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & { invalid?: boolean; muted?: boolean };

/** Native select with an Iconsax chevron. `muted` is the quiet, pre-filled look. */
export function Select({ invalid, muted, className = "", children, ...props }: SelectProps) {
  return (
    <div className="relative">
      <select aria-invalid={invalid || undefined} className={`${BOX} ${border(invalid, muted)} appearance-none pr-10 ${className}`} {...props}>
        {children}
      </select>
      <ArrowDown2 size={16} color="currentColor" className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-icon" />
    </div>
  );
}
