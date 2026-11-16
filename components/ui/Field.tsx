import type { InputHTMLAttributes, SelectHTMLAttributes } from "react";
import { ArrowDown2 } from "iconsax-react";

const BOX = "body-2 min-h-12 w-full rounded-ds-2 border bg-surface px-3 text-fg";
const border = (invalid?: boolean, muted?: boolean) =>
  invalid ? "border-line-danger" : muted ? "border-transparent bg-raised body-2-semibold" : "border-line-strong";

export type InputProps = InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean };

/** Text input. `invalid` switches the border to the danger colour. */
export function Input({ invalid, className = "", ...props }: InputProps) {
  return <input aria-invalid={invalid || undefined} className={`${BOX} ${border(invalid)} ${className}`} {...props} />;
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
