import type { ComponentPropsWithoutRef } from "react";

export type CardProps = ComponentPropsWithoutRef<"div"> & {
  /** Renders the card as a tappable link. */
  href?: string;
};

const BASE = "block w-full rounded-ds-3 border border-line-subtle bg-surface px-4 py-3 text-left shadow-ds-1";

/** Bordered container (radius-3, shadow-1). Pass `href` to render a link card. */
export function Card({ href, className = "", ...rest }: CardProps) {
  if (href !== undefined) {
    return <a href={href} className={`${BASE} active:bg-raised ${className}`} {...(rest as ComponentPropsWithoutRef<"a">)} />;
  }
  return <div className={`${BASE} ${className}`} {...rest} />;
}
