export type EggQuantity = {
  crates: number;
  looseEggs: number;
};

export type InventorySnapshot = EggQuantity;

export type PeriodSummary = {
  revenue: number;
  expenses: number;
  profit: number;
};
