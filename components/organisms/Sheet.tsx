"use client";
import { useEffect, useId, useRef, type ReactNode } from "react";
import { CloseCircle } from "iconsax-react";
import { Icon } from "../atoms/Icon";
import { IconButton } from "../atoms/IconButton";

export type SheetProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  /** Sticks to the bottom of the sheet: the action buttons. */
  footer?: ReactNode;
};

/**
 * Overlay for forms and confirmations. One component, two shapes:
 * - mobile (base): a sheet that rises from the bottom, full width, with a grab handle
 * - tablet and desktop (md, lg): a dialog centred on the screen (wider on desktop)
 * Closes on Escape, on the close button and on a tap outside.
 */
export function Sheet({ open, onClose, title, children, footer }: SheetProps) {
  const titleId = useId();
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const key = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", key);
    panel.current?.focus();
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", key);
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-30 flex items-end justify-center md:items-center md:p-6">
      <div aria-hidden="true" onClick={onClose} className="absolute inset-0 bg-[var(--color-overlay)]" />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="relative flex max-h-[90dvh] w-full flex-col rounded-t-ds-6 bg-surface shadow-ds-5 outline-none md:max-w-lg md:rounded-ds-4 lg:max-w-xl"
      >
        <span aria-hidden="true" className="mx-auto mt-2 block h-1 w-10 shrink-0 rounded-full bg-line md:hidden" />
        <div className="flex shrink-0 items-center justify-between gap-3 px-4 pb-2 pt-2 md:px-6 md:pt-4">
          <h2 id={titleId} className="heading-3 text-fg">{title}</h2>
          <IconButton aria-label="Close" onClick={onClose} className="-mr-2">
            <Icon icon={CloseCircle} />
          </IconButton>
        </div>
        <div className="overflow-y-auto overscroll-contain px-4 pb-4 md:px-6">{children}</div>
        {footer && (
          <div className="shrink-0 border-t border-line-subtle px-4 pb-[calc(var(--space-3)+env(safe-area-inset-bottom))] pt-3 md:px-6 md:pb-4">{footer}</div>
        )}
      </div>
    </div>
  );
}
