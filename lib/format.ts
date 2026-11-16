/** Formats metres for display: whole numbers stay whole, decimals keep up to 2 places, negatives use a true minus sign. */
export const metres = (n: number) => {
  const abs = Math.abs(n);
  const text = Number.isInteger(abs) ? String(abs) : abs.toFixed(2).replace(/0$/, "");
  return `${n < 0 ? "−" : ""}${text} m`;
};
