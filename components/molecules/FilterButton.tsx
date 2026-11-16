import { Filter } from "iconsax-react";
import { Icon } from "../atoms/Icon";
import { IconButton } from "../atoms/IconButton";

export type FilterButtonProps = {
  /** How many filters and sorts are changed from their defaults. The badge is hidden at 0. */
  count?: number;
  onClick: () => void;
  className?: string;
};

/** One button for every filter and sort. A small number on it says how many are on, so the choices need no row of chips. */
export function FilterButton({ count = 0, onClick, className = "" }: FilterButtonProps) {
  return (
    <span className={`relative inline-flex ${className}`}>
      <IconButton variant="field" aria-label={count > 0 ? `Filter and sort, ${count} on` : "Filter and sort"} onClick={onClick} className="size-12">
        <Icon icon={Filter} />
      </IconButton>
      {count > 0 && (
        <span aria-hidden="true" className="body-4-semibold pointer-events-none absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-primary text-fg-on-primary">
          {count}
        </span>
      )}
    </span>
  );
}
