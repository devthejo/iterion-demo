import { describe, expect, it } from "vitest";
import { splitBill, totalWithTip } from "./split";

const sumOf = (shares: { cents: number }[]) => shares.reduce((acc, s) => acc + s.cents, 0);

const spreadOf = (shares: { cents: number }[]) =>
  Math.max(...shares.map((s) => s.cents)) - Math.min(...shares.map((s) => s.cents));

describe("splitBill keeps the account exact", () => {
  it("splits 100 € between three guests without losing a cent", () => {
    const shares = splitBill(10000, ["Ana", "Bob", "Chloé"]);
    expect(sumOf(shares)).toBe(totalWithTip(10000, 0));
  });

  it("splits 100 € between six guests without charging two cents too many", () => {
    const shares = splitBill(10000, ["Ana", "Bob", "Chloé", "Dan", "Eva", "Fred"]);
    expect(sumOf(shares)).toBe(totalWithTip(10000, 0));
  });

  it("hands out the leftover cents one by one, in the guests' order", () => {
    const shares = splitBill(10000, ["Ana", "Bob", "Chloé"]);
    expect(shares.map((s) => s.cents)).toEqual([3334, 3333, 3333]);
  });

  it("never lets two shares differ by more than one cent", () => {
    const shares = splitBill(10000, ["Ana", "Bob", "Chloé", "Dan", "Eva", "Fred"]);
    expect(spreadOf(shares)).toBeLessThanOrEqual(1);
  });

  it("stays exact to the cent once the tip is applied", () => {
    const shares = splitBill(10000, ["Ana", "Bob", "Chloé"], 15);
    expect(sumOf(shares)).toBe(totalWithTip(10000, 15));
  });
});
