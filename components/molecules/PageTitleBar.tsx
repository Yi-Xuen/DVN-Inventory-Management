import type { ReactNode } from "react";
import { ArrowLeft2 } from "iconsax-react";
import { Icon } from "../atoms/Icon";
import { IconButton } from "../atoms/IconButton";

export type PageTitleBarProps = {
  title: string;
  subtitle?: string;
  /** Shows a back arrow. */
  onBack?: () => void;
  /** One or two actions on the right, e.g. an IconButton. */
  actions?: ReactNode;
  className?: string;
};

/** Page heading with an optional back arrow and actions. The title steps up from H3 to H2 on desktop (lg). */
export function PageTitleBar({ title, subtitle, onBack, actions, className = "" }: PageTitleBarProps) {
  return (
    <header className={`flex min-h-14 items-center gap-2 ${className}`}>
      {onBack && (
        <IconButton aria-label="Back" onClick={onBack} className="-ml-2">
          <Icon icon={ArrowLeft2} />
        </IconButton>
      )}
      <div className="grid min-w-0 flex-1">
        <h1 className="heading-3 truncate text-fg lg:heading-2">{title}</h1>
        {subtitle && <p className="body-3 truncate text-fg-subtle">{subtitle}</p>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </header>
  );
}
