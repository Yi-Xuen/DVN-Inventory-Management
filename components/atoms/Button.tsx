import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** primary = primary fill (default); secondary = outlined; danger = outlined in the danger colour */
  variant?: "primary" | "secondary" | "danger";
  /** sm = 40px tall (label-3), md = 48px (label-2, default), lg = 56px (label-1) */
  size?: "sm" | "md" | "lg";
  /** Fills the width of its container (default). Set false for a button that hugs its label. */
  fullWidth?: boolean;
  /** Optional icons either side of the label. */
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  /** Shows a spinner, sets aria-busy and ignores clicks. Keeps full colour (unlike disabled). */
  loading?: boolean;
};

// Primary sits at shadow-1 and drops to none when pressed or disabled. Hover/pressed use the next two primary steps (bg-primary-hover, bg-primary-active); the outlined tints are mixed from the text colour.
const VARIANTS = {
  primary: "bg-primary text-fg-on-primary border-0 shadow-ds-1 disabled:bg-disabled disabled:text-fg-disabled disabled:shadow-none",
  secondary: "bg-transparent text-fg border border-line-strong disabled:border-line-subtle disabled:text-fg-disabled",
  danger: "bg-transparent text-fg-danger border border-line-danger disabled:border-line-subtle disabled:text-fg-disabled",
};

const INTERACTIVE = {
  primary: "hover:bg-primary-hover active:bg-primary-active active:shadow-none",
  secondary:
    "hover:bg-[color-mix(in_srgb,transparent,var(--text-default)_6%)] active:bg-[color-mix(in_srgb,transparent,var(--text-default)_12%)]",
  danger: "hover:bg-danger-tint active:bg-danger-tint",
};

const SIZES = {
  sm: "label-3 min-h-10 px-3 py-2",
  md: "label-2 min-h-12 p-3",
  lg: "label-1 min-h-14 px-5 py-4",
};

/** Action button. Sizes use the label styles (L3, L2, L1), radius-2 and spacing tokens. */
export function Button({
  variant = "primary",
  size = "md",
  fullWidth = true,
  iconLeft,
  iconRight,
  loading = false,
  className = "",
  type = "button",
  disabled,
  onClick,
  children,
  ...props
}: ButtonProps) {
  const interactive = !disabled && !loading;
  return (
    <button
      type={type}
      disabled={disabled}
      aria-busy={loading || undefined}
      onClick={loading ? undefined : onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-ds-2 text-center outline-offset-2 transition-colors focus-visible:outline-2 focus-visible:outline-fg-primary disabled:cursor-not-allowed ${
        fullWidth ? "w-full" : ""
      } ${loading ? "cursor-progress" : "cursor-pointer"} ${SIZES[size]} ${VARIANTS[variant]} ${
        interactive ? INTERACTIVE[variant] : ""
      } ${className}`}
      {...props}
    >
      {loading ? (
        <span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        iconLeft
      )}
      {children}
      {iconRight}
    </button>
  );
}
