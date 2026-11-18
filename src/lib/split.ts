/** One person's share of the bill, in integer cents. */
export interface Share {
  name: string;
  cents: number;
}

/** The bill with the tip applied, rounded to the cent. */
export function totalWithTip(totalCents: number, tipPercent = 0): number {
  return Math.round(totalCents * (1 + tipPercent / 100));
}

/**
 * Splits a bill between people, tip included.
 * Amounts are integer cents so no floating-point drift reaches the UI.
 */
export function splitBill(totalCents: number, people: string[], tipPercent = 0): Share[] {
  if (people.length === 0) return [];
  const each = Math.round(totalWithTip(totalCents, tipPercent) / people.length);
  return people.map((name) => ({ name, cents: each }));
}
