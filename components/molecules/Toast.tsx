import { Alert, type AlertProps } from "./Alert";

/**
 * A floating Alert. Mobile-first:
 * - mobile: full width at the bottom, above the bottom navigation bar
 * - tablet and up (md): fixed width in the top-right corner
 */
export function Toast({ className = "", ...props }: AlertProps) {
  return (
    <div className={`fixed inset-x-4 bottom-[calc(var(--space-20)+env(safe-area-inset-bottom))] z-40 md:inset-x-auto md:bottom-auto md:right-6 md:top-6 md:w-96 ${className}`}>
      <Alert {...props} className="shadow-ds-3" />
    </div>
  );
}
