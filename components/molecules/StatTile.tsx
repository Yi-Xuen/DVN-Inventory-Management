import { Card } from "../atoms/Card";

export type StatTileProps = {
  label: string;
  /** The one big figure, e.g. a count of fabrics or jobs. */
  value: number | string;
  /** Optional small note under the figure. The Stock tiles leave it out. */
  hint?: string;
  /** danger = the figure needs attention (shown in the danger colour when it is above zero). */
  tone?: "default" | "danger";
  /** Opens the list behind the figure. */
  href?: string;
  /** Makes the tile a toggle button that picks a view on the same page. Use with `selected`. */
  onClick?: () => void;
  /** The chosen tile: a light green tint, a light green ring and green text. The other tiles turn their text lighter. Only for tiles with `onClick`. */
  selected?: boolean;
};

/** Dashboard tile: a label and one big number. With `href` the whole tile is a link to the detail behind it; with `onClick` and `selected` it is a toggle that picks a view on the same page. Lay tiles out in a two-column grid. */
export function StatTile({ label, value, hint, tone = "default", href, onClick, selected = false }: StatTileProps) {
  const alert = tone === "danger" && value !== 0 && value !== "0";
  const body = (
    <div className="grid gap-0">
      <span className={`body-4-semibold ${selected ? "text-fg-primary-bright" : "text-fg-subtle"}`}>{label}</span>
      <span className={`heading-1 ${alert ? "text-fg-danger" : selected ? "text-fg-primary-bright" : onClick ? "text-fg-subtle" : "text-fg"}`}>{value}</span>
      {hint && <span className="body-4 text-fg-subtle">{hint}</span>}
    </div>
  );
  if (onClick) {
    return (
      <button
        type="button"
        aria-pressed={selected}
        onClick={onClick}
        className={`block w-full cursor-pointer rounded-ds-3 px-3 py-3 text-left outline-offset-2 transition-shadow focus-visible:outline-2 focus-visible:outline-fg-primary ${
          selected ? "bg-success-tint ring-2 ring-line-primary-subtle" : "bg-surface shadow-ds-1 active:bg-raised"
        }`}
      >
        {body}
      </button>
    );
  }
  return <Card href={href} className="px-3">{body}</Card>;
}
