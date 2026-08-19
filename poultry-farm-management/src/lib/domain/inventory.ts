import type { EggQuantity } from "@/lib/domain/types";

export function zeroQuantity(): EggQuantity {
  return { crates: 0, looseEggs: 0 };
}

export function addQuantity(a: EggQuantity, b: EggQuantity): EggQuantity {
  return {
    crates: a.crates + b.crates,
    looseEggs: a.looseEggs + b.looseEggs,
  };
}

export function canSubtractQuantity(source: EggQuantity, amount: EggQuantity): boolean {
  return source.crates >= amount.crates && source.looseEggs >= amount.looseEggs;
}

export function subtractQuantity(source: EggQuantity, amount: EggQuantity): EggQuantity {
  if (!canSubtractQuantity(source, amount)) {
    throw new Error("Insufficient egg inventory for this operation");
  }

  return {
    crates: source.crates - amount.crates,
    looseEggs: source.looseEggs - amount.looseEggs,
  };
}

export function computeInventory(
  collections: EggQuantity[],
  sales: EggQuantity[],
  losses: EggQuantity[],
): EggQuantity {
  const collected = collections.reduce(addQuantity, zeroQuantity());
  const sold = sales.reduce(addQuantity, zeroQuantity());
  const lost = losses.reduce(addQuantity, zeroQuantity());

  return subtractQuantity(subtractQuantity(collected, sold), lost);
}
