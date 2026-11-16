"use client";
import { CloseCircle, SearchNormal1 } from "iconsax-react";
import { Icon } from "../atoms/Icon";

export type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  /** Called when the user presses Enter. */
  onSubmit?: (value: string) => void;
  placeholder?: string;
  /** Spoken name for the search box. */
  label?: string;
  className?: string;
};

/** Search box with a search icon and a clear button. Full width; the parent decides how wide it is. */
export function SearchBar({ value, onChange, onSubmit, placeholder = "Search fabric code or name", label = "Search fabrics", className = "" }: SearchBarProps) {
  return (
    <form
      role="search"
      className={`relative ${className}`}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.(value);
      }}
    >
      <Icon icon={SearchNormal1} size={5} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-icon-subtle" />
      <input
        type="search"
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="body-2 min-h-12 w-full rounded-ds-2 border border-line-strong bg-surface px-10 text-fg placeholder:text-fg-subtle focus:border-line-primary [&::-webkit-search-cancel-button]:appearance-none"
      />
      {value && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => onChange("")}
          className="absolute right-0 top-1/2 inline-grid size-11 -translate-y-1/2 cursor-pointer place-items-center rounded-ds-2 text-icon-subtle hover:text-fg"
        >
          <Icon icon={CloseCircle} size={5} />
        </button>
      )}
    </form>
  );
}
