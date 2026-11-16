import type { Icon as IconsaxIcon } from "iconsax-react";

// Full class names so Tailwind can find them. Each maps to an --icon-size-* token.
const SIZES = {
  4: "size-[var(--icon-size-4)]",
  5: "size-[var(--icon-size-5)]",
  6: "size-[var(--icon-size-6)]",
  8: "size-[var(--icon-size-8)]",
  10: "size-[var(--icon-size-10)]",
  12: "size-[var(--icon-size-12)]",
};

export type IconProps = {
  /** Any icon from iconsax-react, e.g. `icon={Box1}`. */
  icon: IconsaxIcon;
  /** Icon size token: 4 = 16px, 5 = 20px, 6 = 24px (default), 8 = 32px, 10 = 40px, 12 = 48px. */
  size?: keyof typeof SIZES;
  /** Bold (filled) style for active or selected states. Linear is the default. */
  bold?: boolean;
  /** Spoken name. Leave out when the icon sits next to text that already says it. */
  label?: string;
  /** Colour comes from a text or icon colour class, e.g. `text-icon-subtle`. */
  className?: string;
};

/** Iconsax icon locked to the design system: Linear or Bold only, token sizes, colour from the current text colour. */
export function Icon({ icon: Glyph, size = 6, bold = false, label, className = "" }: IconProps) {
  return (
    <Glyph
      variant={bold ? "Bold" : "Linear"}
      color="currentColor"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={`shrink-0 ${SIZES[size]} ${className}`}
    />
  );
}
