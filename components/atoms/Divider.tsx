/** Thin separator line. Horizontal by default; `vertical` needs a parent with a height (e.g. a flex row). */
export function Divider({ vertical = false, className = "" }: { vertical?: boolean; className?: string }) {
  return vertical ? (
    <span role="separator" aria-orientation="vertical" className={`block w-px self-stretch bg-line-subtle ${className}`} />
  ) : (
    <hr className={`m-0 w-full border-0 border-t border-line-subtle ${className}`} />
  );
}
