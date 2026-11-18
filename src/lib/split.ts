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
 *
 * The split is exact: everyone pays the same base amount (the bill rounded
 * down to a whole share), and the leftover cents are handed out one by one
 * to the first guests in the given order, so no two shares differ by more
 * than a cent and the shares always sum back to the bill.
 */
export function splitBill(totalCents: number, people: string[], tipPercent = 0): Share[] {
  if (people.length === 0) return [];
  const bill = totalWithTip(totalCents, tipPercent);
  const base = Math.floor(bill / people.length);
  const remainder = bill - base * people.length;
  return people.map((name, index) => ({
    name,
    cents: index < remainder ? base + 1 : base,
  }));
}
