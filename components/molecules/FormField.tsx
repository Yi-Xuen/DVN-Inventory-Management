"use client";
import { useId, type ReactNode } from "react";
import { HelperText, Label } from "../atoms/Label";

/** Props to spread onto the input so the label, hint and error are linked to it. */
export type FieldControlProps = { id: string; "aria-describedby"?: string; invalid?: boolean; required?: boolean };

export type FormFieldProps = {
  label: string;
  /** Hint shown under the field. Replaced by `error` when there is one. */
  helper?: string;
  /** Error message. Also marks the input as invalid. */
  error?: string;
  required?: boolean;
  /** Render the input and spread the given props onto it: `{(field) => <TextField {...field} />}` */
  children: (field: FieldControlProps) => ReactNode;
  className?: string;
};

/** A label, one input and its hint or error, stacked and linked for screen readers. */
export function FormField({ label, helper, error, required, children, className = "" }: FormFieldProps) {
  const id = useId();
  const noteId = `${id}-note`;
  const note = error ?? helper;
  return (
    <div className={`grid gap-1 ${className}`}>
      <Label htmlFor={id} required={required}>{label}</Label>
      {children({ id, "aria-describedby": note ? noteId : undefined, invalid: !!error || undefined, required })}
      {note && <HelperText id={noteId} error={!!error}>{note}</HelperText>}
    </div>
  );
}
