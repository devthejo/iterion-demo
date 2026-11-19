import { describe, expect, it } from "vitest";
import { splitBill, totalWithTip } from "./split";

describe("splitBill", () => {
  it("splits evenly when the bill divides", () => {
    const shares = splitBill(9000, ["Ana", "Bob", "Chloé"]);
    expect(shares.map((s) => s.cents)).toEqual([3000, 3000, 3000]);
  });

  it("applies the tip before splitting", () => {
    const shares = splitBill(10000, ["Ana", "Bob"], 10);
    expect(shares.map((s) => s.cents)).toEqual([5500, 5500]);
  });

  it("keeps everyone, in order", () => {
    const shares = splitBill(6000, ["Ana", "Bob", "Chloé"]);
    expect(shares.map((s) => s.name)).toEqual(["Ana", "Bob", "Chloé"]);
  });

  it("makes the shares add up to the bill when it does not divide", () => {
    const shares = splitBill(10000, ["Ana", "Bob", "Chloé"]);
    expect(shares.map((s) => s.cents)).toEqual([3334, 3333, 3333]);
    expect(shares.reduce((sum, s) => sum + s.cents, 0)).toBe(10000);
  });

  it("returns no share when nobody is at the table", () => {
    expect(splitBill(5000, [])).toEqual([]);
  });
});

describe("totalWithTip", () => {
  it("rounds the tipped total to the cent", () => {
    expect(totalWithTip(1999, 15)).toBe(2299);
  });
});
