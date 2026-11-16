import type { ButtonHTMLAttributes } from "react";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** primary = brand fill (default); secondary = outlined */
  variant?: "primary" | "secondary";
};

const VARIANTS = {
  primary: "bg-brand text-fg-on-brand border-0",
  secondary: "bg-transparent text-fg border border-line-strong",
};

/** Full-width action button. Uses label-2 (16/16 semibold), radius-2 and spacing tokens. */
export function Button({ variant = "primary", className = "", type = "button", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={`label-2 block min-h-12 w-full cursor-pointer rounded-ds-2 p-3 text-center disabled:cursor-not-allowed disabled:opacity-35 ${VARIANTS[variant]} ${className}`}
      {...props}
    />
  );
}
