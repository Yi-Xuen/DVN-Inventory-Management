import type { ButtonHTMLAttributes } from "react";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** primary = brand fill (default); secondary = outlined */
  variant?: "primary" | "secondary";
  /** Shows a spinner, sets aria-busy and ignores clicks. Keeps full colour (unlike disabled). */
  loading?: boolean;
};

// Hover/active tints are mixed from existing tokens (no dedicated state tokens yet), so they work in light and dark.
const VARIANTS = {
  primary: "bg-brand text-fg-on-brand border-0",
  secondary: "bg-transparent text-fg border border-line-strong",
};

const INTERACTIVE = {
  primary:
    "hover:bg-[color-mix(in_srgb,var(--bg-brand),var(--text-on-brand)_12%)] active:bg-[color-mix(in_srgb,var(--bg-brand),var(--text-on-brand)_22%)]",
  secondary:
    "hover:bg-[color-mix(in_srgb,transparent,var(--text-default)_6%)] active:bg-[color-mix(in_srgb,transparent,var(--text-default)_12%)]",
};

/** Full-width action button. Uses label-2 (16/16 semibold), radius-2 and spacing tokens. */
export function Button({
  variant = "primary",
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
      className={`label-2 block min-h-12 w-full rounded-ds-2 p-3 text-center outline-offset-2 transition-colors focus-visible:outline-2 focus-visible:outline-fg-brand disabled:cursor-not-allowed disabled:opacity-35 ${
        loading ? "cursor-progress" : "cursor-pointer"
      } ${VARIANTS[variant]} ${interactive ? INTERACTIVE[variant] : ""} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="inline-flex items-center justify-center gap-2">
          <span
            aria-hidden="true"
            className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          />
          {children}
        </span>
      ) : (
        children
      )}
    </button>
  );
}
