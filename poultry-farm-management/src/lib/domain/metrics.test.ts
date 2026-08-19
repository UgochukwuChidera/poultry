import { describe, expect, it } from "vitest";
import { computePeriodSummary, sumAmounts } from "@/lib/domain/metrics";

describe("financial summaries", () => {
  it("sums amounts safely", () => {
    expect(sumAmounts([10, 2.5, 7.5])).toBe(20);
    expect(sumAmounts([])).toBe(0);
  });

  it("derives profit from revenue and expenses", () => {
    expect(computePeriodSummary([120000, 50000], [20000, 15000])).toEqual({
      revenue: 170000,
      expenses: 35000,
      profit: 135000,
    });
  });
});
