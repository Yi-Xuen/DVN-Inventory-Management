import type { AnchorHTMLAttributes } from "react";
import type { Icon as IconsaxIcon } from "iconsax-react";
import { Icon } from "./Icon";

export type NavItemProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  icon: IconsaxIcon;
  label: string;
  /** Marks the current page: bold icon, primary colour, aria-current. */
  active?: boolean;
};

/**
 * One navigation destination. Mobile-first:
 * - mobile and tablet: icon above a small label (bottom bar, side rail)
 * - desktop (lg): icon beside the label (sidebar row)
 */
export function NavItem({ icon, label, active = false, className = "", ...props }: NavItemProps) {
  return (
    <a
      aria-current={active ? "page" : undefined}
      className={`body-4-semibold flex min-h-14 flex-1 cursor-pointer flex-col items-center justify-center gap-1 rounded-ds-2 px-1 transition-colors focus-ring md:w-full md:flex-none md:px-0 lg:body-3-semibold lg:min-h-12 lg:flex-row lg:justify-start lg:gap-3 lg:px-3 ${
        active ? "text-fg-primary lg:bg-primary-subtle" : "text-fg-subtle hover:text-fg lg:hover:bg-hover"
      } ${className}`}
      {...props}
    >
      <Icon icon={icon} bold={active} />
      <span className="max-w-full truncate">{label}</span>
    </a>
  );
}
