import { describe, expect, it } from "vitest";
import { eggSaleSchema, expenseSchema } from "@/lib/domain/validation";

describe("domain validation", () => {
  it("rejects negative quantities", () => {
    expect(() =>
      eggSaleSchema.parse({
        farmId: "550e8400-e29b-41d4-a716-446655440000",
        date: "2026-08-19",
        customerType: "retailer",
        crates: -1,
        looseEggs: 0,
        totalPrice: 25000,
      }),
    ).toThrow();
  });

  it("requires positive expense amount", () => {
    expect(() =>
      expenseSchema.parse({
        farmId: "550e8400-e29b-41d4-a716-446655440000",
        expenseDate: "2026-08-19",
        category: "feed",
        amount: 0,
      }),
    ).toThrow();
  });
});
