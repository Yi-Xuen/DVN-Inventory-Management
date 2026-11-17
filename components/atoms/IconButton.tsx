import type { ButtonHTMLAttributes } from "react";

export type IconButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "aria-label"> & {
  /** Required: an icon-only button needs a spoken name. */
  "aria-label": string;
  /** ghost = no border (default); outlined = bordered; primary = primary fill */
  variant?: "ghost" | "outlined" | "primary";
  /** md = 44px (default, comfortable touch target); sm = 44px on phones, 40px from lg */
  size?: "sm" | "md";
};

const VARIANTS = {
  ghost: "bg-transparent text-icon hover:bg-hover active:bg-pressed",
  outlined: "bg-surface text-icon border border-line-strong hover:bg-hover active:bg-pressed",
  primary: "bg-primary text-fg-on-primary hover:bg-primary-hover active:bg-primary-active",
};

/** Square button that holds one icon. Pass the icon as children. */
export function IconButton({ variant = "ghost", size = "md", className = "", type = "button", ...props }: IconButtonProps) {
  return (
    <button
      type={type}
      className={`inline-grid shrink-0 cursor-pointer place-items-center rounded-ds-2 transition-colors focus-ring disabled:cursor-not-allowed disabled:text-fg-disabled ${
        size === "sm" ? "size-11 lg:size-10" : "size-11"
      } ${VARIANTS[variant]} ${className}`}
      {...props}
    />
  );
}
