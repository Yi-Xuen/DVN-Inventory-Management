const SIZES = { sm: "size-8 body-4-semibold", md: "size-10 body-3-semibold" };

/** First letters of the first and last word: "Mei Ling Tan" becomes "MT". */
const initials = (name: string) => {
  const words = name.trim().split(/\s+/).filter(Boolean);
  return ((words[0]?.[0] ?? "") + (words.length > 1 ? words[words.length - 1][0] : "")).toUpperCase();
};

/** Round badge with a person's initials (salesperson, cutter). */
export function Avatar({ name, size = "md", className = "" }: { name: string; size?: keyof typeof SIZES; className?: string }) {
  return (
    <span role="img" aria-label={name} className={`inline-grid shrink-0 place-items-center rounded-full bg-raised text-fg ${SIZES[size]} ${className}`}>
      {initials(name)}
    </span>
  );
}
