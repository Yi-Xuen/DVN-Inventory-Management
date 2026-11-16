"use client";
import { useEffect, useRef, type InputHTMLAttributes } from "react";
import { Minus } from "iconsax-react";

/** Iconsax has no bare tick, so this matches its Linear style: 24px grid, 1.5 stroke, round caps. */
function Tick({ size = 20, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path d="M6.5 12.5L10 16L17.5 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  /** Mixed state, e.g. a parent whose children are only partly ticked. */
  indeterminate?: boolean;
  /** Marks the field as having an error (danger border). */
  invalid?: boolean;
  label?: React.ReactNode;
  description?: React.ReactNode;
};

/**
 * 24px checkbox (icon-size-6, radius-1). The native input stays in the tree for accessibility and
 * forms; the mark is drawn at 20px (icon-size-5) with a 1.5 stroke so it matches the other icons.
 */
export function Checkbox({ indeterminate = false, invalid, label, description, className = "", ...props }: CheckboxProps) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate]);

  const box = (
    <span className={`relative inline-flex size-6 shrink-0 ${className}`}>
      <input
        ref={ref}
        type="checkbox"
        aria-invalid={invalid || undefined}
        className="peer absolute inset-0 z-10 m-0 size-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
        {...props}
      />
      <span
        aria-hidden="true"
        className={`pointer-events-none size-full rounded-ds-1 border bg-surface peer-checked:border-transparent peer-checked:bg-brand peer-indeterminate:border-transparent peer-indeterminate:bg-brand peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-line-brand peer-disabled:opacity-35 ${
          invalid ? "border-line-danger" : "border-line-strong"
        }`}
      />
      <Tick size={20} className="pointer-events-none absolute inset-0 m-auto hidden text-fg-on-brand peer-checked:block peer-indeterminate:hidden peer-disabled:opacity-35" />
      <Minus size={20} color="currentColor" aria-hidden="true" className="pointer-events-none absolute inset-0 m-auto hidden text-fg-on-brand peer-indeterminate:block peer-disabled:opacity-35" />
    </span>
  );

  if (!label) return box;
  return (
    <label className="flex cursor-pointer items-start gap-3">
      {box}
      <span className="flex flex-col">
        <span className="body-2-semibold">{label}</span>
        {description && <span className="body-3 text-fg-subtle">{description}</span>}
      </span>
    </label>
  );
}
