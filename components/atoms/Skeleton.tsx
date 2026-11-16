/** Grey placeholder shown while content loads. Set its size with classes, e.g. `h-6 w-32`. */
export function Skeleton({ className = "h-4 w-full" }: { className?: string }) {
  return <span aria-hidden="true" className={`block animate-pulse rounded-ds-2 bg-raised motion-reduce:animate-none ${className}`} />;
}
