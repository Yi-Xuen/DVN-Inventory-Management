"use client";
import type { ReactNode } from "react";
import { Avatar } from "../atoms/Avatar";
import { PageTitleBar } from "../molecules/PageTitleBar";
import { SearchBar } from "../molecules/SearchBar";

export type AppHeaderProps = {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  /** Signed-in person's name. */
  user: string;
  /** Leave out `onSearchChange` to hide the search box. */
  search?: string;
  onSearchChange?: (value: string) => void;
  /** Extra controls next to the user (tablet and desktop only), e.g. the theme toggle. */
  actions?: ReactNode;
};

/**
 * Top of every page. Mobile-first:
 * - mobile: title row with a small avatar, search box on its own row below
 * - tablet (md): one row: title, search, avatar
 * - desktop (lg): same row, wider search, and the user's name beside the avatar
 */
export function AppHeader({ title, subtitle, onBack, user, search = "", onSearchChange, actions }: AppHeaderProps) {
  return (
    <div className="sticky top-0 z-10 flex flex-col gap-2 border-b border-line-subtle bg-page px-4 pb-3 pt-1 md:flex-row md:items-center md:gap-4 md:px-6 md:py-2 lg:px-8">
      <PageTitleBar
        title={title}
        subtitle={subtitle}
        onBack={onBack}
        className="md:min-w-0 md:flex-1"
        actions={<Avatar name={user} size="sm" className="md:hidden" />}
      />
      {onSearchChange && <SearchBar value={search} onChange={onSearchChange} className="md:w-72 lg:w-96" />}
      <div className="hidden shrink-0 items-center gap-3 md:flex">
        {actions}
        <Avatar name={user} />
        <span className="body-3-semibold hidden text-fg lg:block">{user}</span>
      </div>
    </div>
  );
}
