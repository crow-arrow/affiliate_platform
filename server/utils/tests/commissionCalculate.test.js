import { describe, test, expect } from "vitest";
import { getCommission } from "../commissionCalculate.js";

describe("getCommission", () => {
  test("should return correct commission for Bronze level", () => {
    expect(getCommission("BRONZE", 1000)).toBe(70);
  });

  test("should return correct commission for Silver level", () => {
    expect(getCommission("SILVER", 1000)).toBe(100);
  });

  test("should return correct commission for Gold level", () => {
    expect(getCommission("GOLD", 1000)).toBe(120);
  });

  test("should return correct value with decimal totalPrice", () => {
    expect(getCommission("SILVER", 1234.56)).toBeCloseTo(123.46, 2);
  });

  test("should throw error for unknown level", () => {
    expect(() => getCommission("Platinum", 1000)).toThrow(
      "Unknown level: Platinum"
    );
  });
});
