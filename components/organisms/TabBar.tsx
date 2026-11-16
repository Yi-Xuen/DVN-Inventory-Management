import type { Icon as IconsaxIcon } from "iconsax-react";
import { Icon } from "../atoms/Icon";

export type TabBarItem = { key: string; label: string; icon: IconsaxIcon; href: string };

export type TabBarProps = {
  /** Up to five destinations, in order. */
  items: TabBarItem[];
  /** Key of the current tab. */
  activeKey: string;
};

/**
 * Bottom tab bar for the phone-sized prototype shell: icon above a small label, five equal tabs.
 * It is fixed to the bottom and stays as wide as the phone column at every screen size, so give the
 * page content matching space underneath (`pb-24`). The full app uses AppNav, which also has tablet and desktop layouts.
 */
export function TabBar({ items, activeKey }: TabBarProps) {
  return (
    <nav
      aria-label="Main"
      className="fixed bottom-0 left-1/2 z-20 flex w-full max-w-[430px] -translate-x-1/2 gap-1 border-t border-line-subtle bg-surface px-2 pb-[env(safe-area-inset-bottom)]"
    >
      {items.map((item) => {
        const active = item.key === activeKey;
        return (
          <a
            key={item.key}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`body-4-semibold flex min-h-14 min-w-0 flex-1 cursor-pointer flex-col items-center justify-center gap-1 rounded-ds-2 px-1 outline-offset-2 transition-colors focus-visible:outline-2 focus-visible:outline-fg-primary ${
              active ? "text-fg-primary-bright" : "text-fg-subtle hover:text-fg"
            }`}
          >
            <Icon icon={item.icon} bold={active} />
            <span className="max-w-full truncate">{item.label}</span>
          </a>
        );
      })}
    </nav>
  );
}
