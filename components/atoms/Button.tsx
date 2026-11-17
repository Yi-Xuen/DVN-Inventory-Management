import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** primary = primary fill (default, one per view); secondary = outlined; tertiary = text only, lowest emphasis;
   *  danger = outlined in the danger colour; danger-solid = solid red, final destructive confirmation only */
  variant?: "primary" | "secondary" | "tertiary" | "danger" | "danger-solid";
  /** sm = 44px tall on phones and 40px from lg (label-3), md = 48px (label-2, default), lg = 56px (label-1) */
  size?: "sm" | "md" | "lg";
  /** Fills the width of its container (default). Set false for a button that hugs its label. */
  fullWidth?: boolean;
  /** Optional icons either side of the label. */
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  /** Shows a spinner, sets aria-busy and ignores clicks. Keeps full colour (unlike disabled). */
  loading?: boolean;
};

// Primary sits at shadow-1 and drops to none when pressed or disabled. Hover/pressed use the next two primary steps (bg-primary-hover, bg-primary-active); outlined and tertiary use bg-surface-hover and bg-surface-pressed.
const VARIANTS = {
  primary: "bg-primary text-fg-on-primary border-0 shadow-ds-1 disabled:bg-disabled disabled:text-fg-disabled disabled:shadow-none",
  secondary: "bg-transparent text-fg border border-line-strong disabled:border-line-subtle disabled:text-fg-disabled",
  tertiary: "bg-transparent text-fg-link border-0 disabled:text-fg-disabled",
  danger: "bg-transparent text-fg-danger border border-line-danger disabled:border-line-subtle disabled:text-fg-disabled",
  "danger-solid": "bg-danger-solid text-fg-on-danger border-0 disabled:bg-disabled disabled:text-fg-disabled",
};

const INTERACTIVE = {
  primary: "hover:bg-primary-hover active:bg-primary-active active:shadow-none",
  secondary: "hover:bg-hover active:bg-pressed",
  tertiary: "hover:bg-hover active:bg-pressed",
  danger: "hover:bg-danger-tint active:bg-danger-tint",
  "danger-solid": "hover:bg-danger-solid-hover active:bg-danger-solid-hover",
};

const SIZES = {
  sm: "label-3 min-h-11 px-3 py-2 lg:min-h-10",
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
      className={`inline-flex items-center justify-center gap-2 rounded-ds-2 text-center transition-colors focus-ring disabled:cursor-not-allowed ${
        fullWidth ? "w-full" : ""
      } ${loading ? "cursor-progress" : "cursor-pointer"} ${SIZES[size]} ${VARIANTS[variant]} ${
        interactive ? INTERACTIVE[variant] : ""
      } ${className}`}
      {...props}
    >
      {loading ? (
        <span aria-hidden="true" className="size-4 animate-spin rounded-full border-w-2 border-current border-t-transparent" />
      ) : (
        iconLeft
      )}
      {children}
      {iconRight}
    </button>
  );
}
