const euros = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" });

/** Formats integer cents as euros for display, e.g. 1250 → "12,50 €". */
export function formatCents(cents: number): string {
  return euros.format(cents / 100);
}

/**
 * Parses what a person types in the amount field ("12,50", "12.5", "12")
 * into integer cents. Returns null for anything that is not a positive amount.
 */
export function parseEuros(input: string): number | null {
  const normalized = input.trim().replace(",", ".");
  if (!/^\d+(\.\d{0,2})?$/.test(normalized)) return null;
  return Math.round(Number(normalized) * 100);
}
