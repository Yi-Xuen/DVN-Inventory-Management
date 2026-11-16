import type { HTMLAttributes } from "react";

export type PillProps = HTMLAttributes<HTMLSpanElement> & {
  /**
   * Quiet status colours: every tone is a soft tint with coloured text and no outline or solid dark fill.
   * neutral and soft = grey tint (soft has lighter text); primary and primary-solid = green tint (kept as two names so existing uses still work);
   * success, warning and danger = tinted by meaning.
   */
  tone?: "neutral" | "soft" | "primary" | "primary-solid" | "success" | "warning" | "danger";
};

const TONES = {
  neutral: "bg-raised text-fg",
  soft: "bg-raised text-fg-subtle",
  primary: "bg-success-tint text-fg-primary-bright",
  "primary-solid": "bg-success-tint text-fg-primary-bright",
  success: "bg-success-tint text-fg-success",
  warning: "bg-warning-tint text-fg-warning",
  danger: "bg-danger-tint text-fg-danger",
};

/** Small status tag (body-4 semibold, radius-full): a soft tint with coloured text, no border. */
export function Pill({ tone = "neutral", className = "", ...props }: PillProps) {
  return (
    <span
      className={`body-4-semibold inline-block whitespace-nowrap rounded-full px-2 py-0.5 ${TONES[tone]} ${className}`}
      {...props}
    />
  );
}
