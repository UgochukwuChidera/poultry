import type { PeriodSummary } from "@/lib/domain/types";

export function sumAmounts(values: number[]): number {
  return values.reduce((acc, value) => acc + value, 0);
}

export function computePeriodSummary(revenueValues: number[], expenseValues: number[]): PeriodSummary {
  const revenue = sumAmounts(revenueValues);
  const expenses = sumAmounts(expenseValues);

  return {
    revenue,
    expenses,
    profit: revenue - expenses,
  };
}
