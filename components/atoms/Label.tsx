import type { HTMLAttributes, LabelHTMLAttributes } from "react";

export type LabelProps = LabelHTMLAttributes<HTMLLabelElement> & {
  /** Adds a danger-coloured asterisk. */
  required?: boolean;
};

/** Field label (label-3). Link it to its input with `htmlFor`. */
export function Label({ required, className = "", children, ...props }: LabelProps) {
  return (
    <label className={`label-3 text-fg ${className}`} {...props}>
      {children}
      {required && <span aria-hidden="true" className="text-fg-danger"> *</span>}
    </label>
  );
}

export type HelperTextProps = HTMLAttributes<HTMLParagraphElement> & {
  /** Shows the text as an error (danger colour, announced to screen readers). */
  error?: boolean;
};

/** Small hint or error message under a field (body-4). */
export function HelperText({ error, className = "", ...props }: HelperTextProps) {
  return <p role={error ? "alert" : undefined} className={`body-4 ${error ? "text-fg-danger" : "text-fg-subtle"} ${className}`} {...props} />;
}
