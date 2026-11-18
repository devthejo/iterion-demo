import { describe, expect, it } from "vitest";
import { splitBill, totalWithTip, type Share } from "./split";

function sumCents(shares: Share[]): number {
  return shares.reduce((acc, share) => acc + share.cents, 0);
}

describe("splitBill — the shares must add up to the cent", () => {
  it("splits 100 € between three people without losing a cent", () => {
    const shares = splitBill(10000, ["Ana", "Bob", "Chloé"]);
    expect(shares.map((share) => share.cents)).toEqual([3334, 3333, 3333]);
    expect(sumCents(shares)).toBe(totalWithTip(10000, 0));
  });

  it("splits 100 € between six people without overcharging", () => {
    const shares = splitBill(10000, ["Ana", "Bob", "Chloé", "Dan", "Eve", "Fred"]);
    expect(shares.map((share) => share.cents)).toEqual([1667, 1667, 1667, 1667, 1666, 1666]);
    expect(sumCents(shares)).toBe(totalWithTip(10000, 0));
  });

  it("hands out the leftover cents one by one, in the order of the guests", () => {
    // 50,03 € for four: 1250 each, 3 cents left for the first three guests.
    const shares = splitBill(5003, ["Ana", "Bob", "Chloé", "Dan"]);
    expect(shares.map((share) => share.cents)).toEqual([1251, 1251, 1251, 1250]);
  });

  it("keeps the tip inside the exact total", () => {
    // 33,33 € + 15 % = 38,33 € for two: 1917 + 1916.
    const shares = splitBill(3333, ["Ana", "Bob"], 15);
    expect(sumCents(shares)).toBe(totalWithTip(3333, 15));
    expect(shares.map((share) => share.cents)).toEqual([1917, 1916]);
  });

  it("never lets two shares differ by more than one cent", () => {
    for (let guests = 2; guests <= 8; guests++) {
      for (let cents = 1; cents <= 400; cents++) {
        const names = Array.from({ length: guests }, (_, index) => `Convive ${index + 1}`);
        const shares = splitBill(cents, names);
        expect(sumCents(shares)).toBe(cents);
        const amounts = shares.map((share) => share.cents);
        expect(Math.max(...amounts) - Math.min(...amounts)).toBeLessThanOrEqual(1);
      }
    }
  });
});
