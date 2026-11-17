const SIZES = { sm: "size-4", md: "size-6", lg: "size-8" };

/** Loading spinner. Takes the current text colour. */
export function Spinner({ size = "md", label = "Loading", className = "" }: { size?: keyof typeof SIZES; label?: string; className?: string }) {
  return (
    <span
      role="status"
      aria-label={label}
      className={`inline-block animate-spin rounded-full border-w-2 border-current border-t-transparent motion-reduce:animate-none ${SIZES[size]} ${className}`}
    />
  );
}
