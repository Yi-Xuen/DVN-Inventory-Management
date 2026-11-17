import type { ButtonHTMLAttributes } from "react";
import { ScanBarcode } from "iconsax-react";
import { Icon } from "../atoms/Icon";

export type ScanButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  /**
   * - fab: round floating button for the centre of the mobile bottom bar
   * - rail: icon only, for the tablet side rail
   * - full: icon and label, for the desktop sidebar or header
   */
  variant?: "fab" | "rail" | "full";
  label?: string;
};

const VARIANTS = {
  fab: "size-14 rounded-full shadow-ds-3",
  rail: "size-12 rounded-ds-2",
  full: "label-2 min-h-12 w-full gap-2 rounded-ds-2 px-3",
};

/** The main action of the app: scan a fabric's QR code. Always primary-filled so it stands out. */
export function ScanButton({ variant = "fab", label = "Scan QR", className = "", type = "button", ...props }: ScanButtonProps) {
  return (
    <button
      type={type}
      aria-label={variant === "full" ? undefined : label}
      className={`inline-flex shrink-0 cursor-pointer items-center justify-center bg-primary text-fg-on-primary transition-colors hover:bg-primary-hover focus-ring active:bg-primary-active ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      <Icon icon={ScanBarcode} size={variant === "fab" ? 8 : 6} />
      {variant === "full" && label}
    </button>
  );
}
