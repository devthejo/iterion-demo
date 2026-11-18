import { describe, expect, it } from "vitest";
import { splitBill, totalWithTip } from "./split";

/** The three rules the bill split must obey, straight from the bug report. */
function expectFairSplit(shares: ReturnType<typeof splitBill>, totalCents: number, tipPercent: number) {
  const bill = totalWithTip(totalCents, tipPercent);

  // Rule 1: the shares add up to the bill, tip included, to the cent.
  const sum = shares.reduce((acc, share) => acc + share.cents, 0);
  expect(sum).toBe(bill);

  // Rule 3: no two shares differ by more than one cent.
  const cents = shares.map((share) => share.cents);
  const spread = Math.max(...cents) - Math.min(...cents);
  expect(spread).toBeLessThanOrEqual(1);

  // Rule 2: the leftover cents are handed out one by one, in guest order.
  // That is: base = floor(bill / n) for everyone, and the first (bill % n)
  // guests in the given order carry the extra cent.
  const base = Math.floor(bill / shares.length);
  const remainder = bill - base * shares.length;
  cents.forEach((cent, index) => {
    expect(cent).toBe(index < remainder ? base + 1 : base);
  });
}

describe("splitBill", () => {
  it("sums the shares to the exact bill for 100 € split three ways (100,00 € ≠ 99,99 €)", () => {
    expectFairSplit(splitBill(10000, ["Ana", "Bob", "Chloé"]), 10000, 0);
  });

  it("sums the shares to the exact bill for 100 € split six ways (100,00 € ≠ 100,02 €)", () => {
    expectFairSplit(splitBill(10000, ["Ana", "Bob", "Chloé", "Dave", "Elsa", "Farid"]), 10000, 0);
  });

  it("hands the extra cent to the first guests in order", () => {
    const shares = splitBill(10000, ["Ana", "Bob", "Chloé"]);
    expect(shares.map((share) => share.cents)).toEqual([3334, 3333, 3333]);
  });

  it("keeps the split exact when a tip is applied", () => {
    expectFairSplit(splitBill(10000, ["Ana", "Bob", "Chloé"], 15), 10000, 15);
  });

  it("keeps the split exact for every remainder at a fixed table size", () => {
    const people = ["Ana", "Bob", "Chloé", "Dave"];
    for (let cents = 1; cents <= 20000; cents += 7) {
      expectFairSplit(splitBill(cents, people), cents, 0);
    }
  });
});
