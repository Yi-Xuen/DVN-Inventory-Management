import type { ReactNode } from "react";
import type { Icon as IconsaxIcon } from "iconsax-react";
import { Icon } from "../atoms/Icon";

export type EmptyStateProps = {
  icon: IconsaxIcon;
  title: string;
  description?: string;
  /** Usually one Button. */
  action?: ReactNode;
  className?: string;
};

/** Shown when a list has nothing in it. Padding grows from tablet up. */
export function EmptyState({ icon, title, description, action, className = "" }: EmptyStateProps) {
  return (
    <div className={`grid justify-items-center gap-2 px-4 py-8 text-center md:py-12 ${className}`}>
      <Icon icon={icon} size={10} className="text-icon-subtle" />
      <p className="heading-4 text-fg">{title}</p>
      {description && <p className="body-3 max-w-sm text-fg-subtle">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
