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
  const total = totalWithTip(totalCents, tipPercent);
  const base = Math.floor(total / people.length);
  const leftover = total - base * people.length;
  // The leftover cents go to the first people, one each: the shares add up to the bill.
  return people.map((name, index) => ({ name, cents: base + (index < leftover ? 1 : 0) }));
}
