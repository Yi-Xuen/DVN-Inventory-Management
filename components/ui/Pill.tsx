import type { HTMLAttributes } from "react";

export type PillProps = HTMLAttributes<HTMLSpanElement> & {
  /** neutral = outlined; soft = quiet outline; danger = filled danger */
  tone?: "neutral" | "soft" | "danger";
};

const TONES = {
  neutral: "border-line-strong text-fg",
  soft: "border-line text-fg-subtle",
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
