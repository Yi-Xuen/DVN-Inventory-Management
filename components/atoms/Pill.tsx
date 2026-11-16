import type { HTMLAttributes } from "react";

export type PillProps = HTMLAttributes<HTMLSpanElement> & {
  /** neutral = outlined; soft = quiet outline; primary = primary outline; primary-solid = primary fill; success and warning = tinted; danger = filled danger */
  tone?: "neutral" | "soft" | "primary" | "primary-solid" | "success" | "warning" | "danger";
};

const TONES = {
  neutral: "border-line-strong text-fg",
  soft: "border-line text-fg-subtle",
  primary: "border-line-primary text-fg-primary",
  "primary-solid": "border-transparent bg-primary text-fg-on-primary",
  success: "border-transparent bg-success-tint text-fg-success",
  warning: "border-transparent bg-warning-tint text-fg-warning",
  danger: "border-fg-danger bg-fg-danger text-surface",
};

/** Small status tag (body-4 semibold, radius-full). */
export function Pill({ tone = "neutral", className = "", ...props }: PillProps) {
  return (
    <span
      className={`body-4-semibold inline-block whitespace-nowrap rounded-full border px-2 ${TONES[tone]} ${className}`}
      {...props}
    />
  );
}
