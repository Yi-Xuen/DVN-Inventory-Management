import type { ReactNode } from "react";
import { CloseCircle, Danger, InfoCircle, TickCircle, Warning2 } from "iconsax-react";
import { Icon } from "../atoms/Icon";

const TONES = {
  info: { icon: InfoCircle, box: "bg-raised border-line", text: "text-fg", glyph: "text-icon" },
  success: { icon: TickCircle, box: "bg-success-tint border-line-success", text: "text-fg-success", glyph: "text-icon-success" },
  warning: { icon: Warning2, box: "bg-warning-tint border-line-warning", text: "text-fg-warning", glyph: "text-icon-warning" },
  danger: { icon: Danger, box: "bg-danger-tint border-line-danger", text: "text-fg-danger", glyph: "text-icon-danger" },
};

export type AlertProps = {
  tone?: keyof typeof TONES;
  title: ReactNode;
  /** Optional detail under the title. */
  children?: ReactNode;
  /** Shows a close button. */
  onDismiss?: () => void;
  className?: string;
};

/** Inline message with an icon: cut blocked, line promoted from waiting, and so on. */
export function Alert({ tone = "info", title, children, onDismiss, className = "" }: AlertProps) {
  const t = TONES[tone];
  return (
    <div role="alert" className={`flex items-start gap-3 rounded-ds-2 border p-4 ${t.box} ${t.text} ${className}`}>
      <Icon icon={t.icon} bold className={t.glyph} />
      <div className="grid min-w-0 flex-1 gap-1">
        <p className="body-2-semibold">{title}</p>
        {children && <div className="body-3">{children}</div>}
      </div>
      {onDismiss && (
        <button type="button" aria-label="Dismiss" onClick={onDismiss} className="-m-2 inline-grid size-10 shrink-0 cursor-pointer place-items-center rounded-ds-2">
          <Icon icon={CloseCircle} size={5} />
        </button>
      )}
    </div>
  );
}
