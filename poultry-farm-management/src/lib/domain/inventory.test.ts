import { describe, expect, it } from "vitest";
import {
  addQuantity,
  canSubtractQuantity,
  computeInventory,
  subtractQuantity,
  zeroQuantity,
} from "@/lib/domain/inventory";

describe("inventory math", () => {
  it("starts at zero", () => {
    expect(zeroQuantity()).toEqual({ crates: 0, looseEggs: 0 });
  });

  it("adds quantities by crates and loose eggs", () => {
    expect(addQuantity({ crates: 2, looseEggs: 10 }, { crates: 1, looseEggs: 3 })).toEqual({
      crates: 3,
      looseEggs: 13,
    });
  });

  it("prevents negative stock", () => {
    expect(canSubtractQuantity({ crates: 1, looseEggs: 5 }, { crates: 2, looseEggs: 0 })).toBe(false);
    expect(() => subtractQuantity({ crates: 0, looseEggs: 2 }, { crates: 0, looseEggs: 3 })).toThrow();
  });

  it("computes stock from event records", () => {
    const stock = computeInventory(
      [
        { crates: 10, looseEggs: 15 },
        { crates: 1, looseEggs: 3 },
      ],
      [{ crates: 4, looseEggs: 5 }],
      [{ crates: 1, looseEggs: 2 }],
    );

    expect(stock).toEqual({ crates: 6, looseEggs: 11 });
  });
});
