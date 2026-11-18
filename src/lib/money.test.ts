import { describe, expect, it } from "vitest";
import { parseEuros } from "./money";

describe("parseEuros", () => {
  it("reads a comma or a dot as the decimal separator", () => {
    expect(parseEuros("12,50")).toBe(1250);
    expect(parseEuros("12.5")).toBe(1250);
  });

  it("reads whole euros", () => {
    expect(parseEuros("100")).toBe(10000);
  });

  it("refuses what is not an amount", () => {
    expect(parseEuros("")).toBeNull();
    expect(parseEuros("douze")).toBeNull();
    expect(parseEuros("-5")).toBeNull();
    expect(parseEuros("1,234")).toBeNull();
  });
});
