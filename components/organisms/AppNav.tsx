import type { ReactNode } from "react";
import type { Icon as IconsaxIcon } from "iconsax-react";
import { NavItem } from "../atoms/NavItem";
import { ScanButton } from "../molecules/ScanButton";

export type AppNavItem = { key: string; label: string; icon: IconsaxIcon; href: string };

export type AppNavProps = {
  /** Destinations in order. Use 2 or 4 so the scan button sits in the centre of the mobile bar. */
  items: AppNavItem[];
  /** Key of the current destination. */
  activeKey: string;
  /** Leave out to hide the scan button. */
  onScan?: () => void;
  /** Logo or app name. Shown on tablet and desktop only. */
  brand?: ReactNode;
  /** Bottom of the rail or sidebar (user, theme toggle). Tablet and desktop only. */
  footer?: ReactNode;
};

/**
 * Main navigation. One component, three layouts:
 * - mobile (base): bar fixed to the bottom, scan button raised in the centre
 * - tablet (md): narrow icon rail on the left
 * - desktop (lg): sidebar with icons and labels
 *
 * It is fixed to the screen, so give the page content matching space:
 * `pb-20 md:pb-0 md:pl-20 lg:pl-60`.
 */
export function AppNav({ items, activeKey, onScan, brand, footer }: AppNavProps) {
  const half = Math.ceil(items.length / 2);
  const link = (item: AppNavItem) => <NavItem key={item.key} icon={item.icon} label={item.label} href={item.href} active={item.key === activeKey} />;
  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-20 border-t border-line-subtle bg-surface px-2 pb-[env(safe-area-inset-bottom)] md:inset-y-0 md:right-auto md:flex md:w-20 md:flex-col md:items-center md:gap-4 md:border-r md:border-t-0 md:px-1 md:py-4 lg:w-60 lg:items-stretch lg:px-3"
    >
      {brand && <div className="hidden md:block lg:px-3">{brand}</div>}
      {onScan && (
        <>
          <div className="hidden md:block lg:hidden"><ScanButton variant="rail" onClick={onScan} /></div>
          <div className="hidden lg:block"><ScanButton variant="full" onClick={onScan} /></div>
        </>
      )}
      <div className="flex items-center gap-1 md:w-full md:flex-col md:items-stretch">
        {items.slice(0, half).map(link)}
        {onScan && <ScanButton variant="fab" onClick={onScan} className="mx-2 -mt-6 md:hidden" />}
        {items.slice(half).map(link)}
      </div>
      {footer && <div className="mt-auto hidden md:block lg:px-3">{footer}</div>}
    </nav>
  );
}
