import type { ReactNode } from "react";
import { ArrowRight2 } from "iconsax-react";
import { Icon } from "../atoms/Icon";

export type ListRowProps = {
  title: ReactNode;
  /** Second line under the title. */
  subtitle?: ReactNode;
  /** Anything before the title: an avatar, an icon, a queue number. */
  leading?: ReactNode;
  /** Right-hand value, usually metres. */
  value?: ReactNode;
  /** Badge or button. Sits under the text on mobile and at the right from tablet up. */
  trailing?: ReactNode;
  /** Makes the whole row a link and adds a chevron. */
  href?: string;
  className?: string;
};

/**
 * One row in a list. Mobile-first: text and value on the first line with `trailing` wrapped below;
 * from tablet (md) everything sits on a single line.
 */
export function ListRow({ title, subtitle, leading, value, trailing, href, className = "" }: ListRowProps) {
  const body = (
    <>
      {leading && <span className="shrink-0">{leading}</span>}
      <span className="grid min-w-0 flex-1 gap-0">
        <span className="body-2-semibold truncate text-fg">{title}</span>
        {subtitle && <span className="body-3 truncate text-fg-subtle">{subtitle}</span>}
      </span>
      {value && <span className="body-2-semibold shrink-0 whitespace-nowrap text-fg">{value}</span>}
      {trailing && <span className="order-last flex w-full shrink-0 items-center gap-2 md:order-none md:w-auto">{trailing}</span>}
      {href !== undefined && <Icon icon={ArrowRight2} size={5} className="text-icon-subtle" />}
    </>
  );
  const base = `flex min-h-14 flex-wrap items-center gap-x-3 gap-y-2 py-3 md:flex-nowrap ${className}`;
  return href !== undefined ? (
    <a href={href} className={`${base} cursor-pointer focus-ring hover:bg-hover active:bg-pressed`}>{body}</a>
  ) : (
    <div className={base}>{body}</div>
  );
}
