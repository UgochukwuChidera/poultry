import { and, asc, desc, eq, gte, lte } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import { eggCollections, eggLosses, eggSales, expenses, farms, flocks } from "@/lib/db/schema";
import { canSubtractQuantity, computeInventory } from "@/lib/domain/inventory";
import { computePeriodSummary, sumAmounts } from "@/lib/domain/metrics";
import {
  eggCollectionSchema,
  eggLossSchema,
  eggSaleSchema,
  expenseSchema,
  farmInputSchema,
  flockInputSchema,
} from "@/lib/domain/validation";

export async function getPrimaryFarm() {
  const db = getDb();
  const rows = await db.select().from(farms).orderBy(asc(farms.createdAt)).limit(1);
  return rows[0] ?? null;
}

export async function createFarm(input: unknown) {
  const db = getDb();
  const payload = farmInputSchema.parse(input);
  const [result] = await db
    .insert(farms)
    .values({
      name: payload.name,
      location: payload.location || null,
    })
    .returning();

  return result;
}

export async function updateFarm(id: string, input: unknown) {
  const db = getDb();
  const payload = farmInputSchema.parse(input);

  const [result] = await db
    .update(farms)
    .set({
      name: payload.name,
      location: payload.location || null,
      updatedAt: new Date(),
    })
    .where(eq(farms.id, id))
    .returning();

  return result;
}

export async function listFlocks(farmId: string) {
  const db = getDb();
  return db
    .select()
    .from(flocks)
    .where(eq(flocks.farmId, farmId))
    .orderBy(desc(flocks.startDate), desc(flocks.createdAt));
}

export async function createFlock(input: unknown) {
  const db = getDb();
  const payload = flockInputSchema.parse(input);
  const [result] = await db
    .insert(flocks)
    .values({
      farmId: payload.farmId,
      name: payload.name,
      startDate: payload.startDate,
      status: payload.status,
      stage: payload.stage,
      notes: payload.notes || null,
    })
    .returning();

  return result;
}

export async function getInventory(farmId: string) {
  const db = getDb();
  const [collections, sales, losses] = await Promise.all([
    db
      .select({ crates: eggCollections.crates, looseEggs: eggCollections.looseEggs })
      .from(eggCollections)
      .where(eq(eggCollections.farmId, farmId)),
    db
      .select({ crates: eggSales.crates, looseEggs: eggSales.looseEggs })
      .from(eggSales)
      .where(eq(eggSales.farmId, farmId)),
    db
      .select({ crates: eggLosses.crates, looseEggs: eggLosses.looseEggs })
      .from(eggLosses)
      .where(eq(eggLosses.farmId, farmId)),
  ]);

  return computeInventory(collections, sales, losses);
}

export async function recordEggCollection(input: unknown) {
  const db = getDb();
  const payload = eggCollectionSchema.parse(input);
  const [result] = await db
    .insert(eggCollections)
    .values({
      farmId: payload.farmId,
      flockId: payload.flockId,
      collectionDate: payload.date,
      crates: payload.crates,
      looseEggs: payload.looseEggs,
      note: payload.note || null,
    })
    .returning();

  return result;
}

export async function recordEggSale(input: unknown) {
  const db = getDb();
  const payload = eggSaleSchema.parse(input);
  const currentInventory = await getInventory(payload.farmId);

  if (!canSubtractQuantity(currentInventory, { crates: payload.crates, looseEggs: payload.looseEggs })) {
    throw new Error("Sale exceeds available inventory");
  }

  const [result] = await db
    .insert(eggSales)
    .values({
      farmId: payload.farmId,
      saleDate: payload.date,
      customerType: payload.customerType,
      crates: payload.crates,
      looseEggs: payload.looseEggs,
      totalPrice: payload.totalPrice.toFixed(2),
      note: payload.note || null,
    })
    .returning();

  return result;
}

export async function recordEggLoss(input: unknown) {
  const db = getDb();
  const payload = eggLossSchema.parse(input);
  const currentInventory = await getInventory(payload.farmId);

  if (!canSubtractQuantity(currentInventory, { crates: payload.crates, looseEggs: payload.looseEggs })) {
    throw new Error("Loss exceeds available inventory");
  }

  const [result] = await db
    .insert(eggLosses)
    .values({
      farmId: payload.farmId,
      lossDate: payload.date,
      crates: payload.crates,
      looseEggs: payload.looseEggs,
      reason: payload.reason,
    })
    .returning();

  return result;
}

export async function recordExpense(input: unknown) {
  const db = getDb();
  const payload = expenseSchema.parse(input);
  const [result] = await db
    .insert(expenses)
    .values({
      farmId: payload.farmId,
      expenseDate: payload.expenseDate,
      category: payload.category,
      amount: payload.amount.toFixed(2),
      notes: payload.notes || null,
    })
    .returning();

  return result;
}

export async function getDashboardMetrics(farmId: string, date: string) {
  const db = getDb();
  const [inventory, todayCollections, todaySales, todayExpenses] = await Promise.all([
    getInventory(farmId),
    db
      .select({ crates: eggCollections.crates, looseEggs: eggCollections.looseEggs })
      .from(eggCollections)
      .where(and(eq(eggCollections.farmId, farmId), eq(eggCollections.collectionDate, date))),
    db
      .select({ amount: eggSales.totalPrice })
      .from(eggSales)
      .where(and(eq(eggSales.farmId, farmId), eq(eggSales.saleDate, date))),
    db
      .select({ amount: expenses.amount })
      .from(expenses)
      .where(and(eq(expenses.farmId, farmId), eq(expenses.expenseDate, date))),
  ]);

  const todayCollection = todayCollections.reduce(
    (acc, item) => ({ crates: acc.crates + item.crates, looseEggs: acc.looseEggs + item.looseEggs }),
    { crates: 0, looseEggs: 0 },
  );

  const revenue = sumAmounts(todaySales.map((row) => Number(row.amount)));
  const expenseTotal = sumAmounts(todayExpenses.map((row) => Number(row.amount)));

  return {
    inventory,
    todayCollection,
    revenue,
    expenses: expenseTotal,
    profit: revenue - expenseTotal,
  };
}

export async function getPeriodSummary(farmId: string, startDate: string, endDate: string) {
  const db = getDb();
  const [salesRows, expenseRows] = await Promise.all([
    db
      .select({ amount: eggSales.totalPrice })
      .from(eggSales)
      .where(
        and(
          eq(eggSales.farmId, farmId),
          gte(eggSales.saleDate, startDate),
          lte(eggSales.saleDate, endDate),
        ),
      ),
    db
      .select({ amount: expenses.amount })
      .from(expenses)
      .where(
        and(
          eq(expenses.farmId, farmId),
          gte(expenses.expenseDate, startDate),
          lte(expenses.expenseDate, endDate),
        ),
      ),
  ]);

  return computePeriodSummary(
    salesRows.map((row) => Number(row.amount)),
    expenseRows.map((row) => Number(row.amount)),
  );
}

export async function getHistory(farmId: string, startDate: string, endDate: string) {
  const db = getDb();
  const [collections, sales, lossRows, expenseRows] = await Promise.all([
    db
      .select({
        id: eggCollections.id,
        date: eggCollections.collectionDate,
        crates: eggCollections.crates,
        looseEggs: eggCollections.looseEggs,
        flockId: eggCollections.flockId,
        createdAt: eggCollections.createdAt,
      })
      .from(eggCollections)
      .where(
        and(
          eq(eggCollections.farmId, farmId),
          gte(eggCollections.collectionDate, startDate),
          lte(eggCollections.collectionDate, endDate),
        ),
      ),
    db
      .select({
        id: eggSales.id,
        date: eggSales.saleDate,
        crates: eggSales.crates,
        looseEggs: eggSales.looseEggs,
        customerType: eggSales.customerType,
        amount: eggSales.totalPrice,
        createdAt: eggSales.createdAt,
      })
      .from(eggSales)
      .where(
        and(eq(eggSales.farmId, farmId), gte(eggSales.saleDate, startDate), lte(eggSales.saleDate, endDate)),
      ),
    db
      .select({
        id: eggLosses.id,
        date: eggLosses.lossDate,
        crates: eggLosses.crates,
        looseEggs: eggLosses.looseEggs,
        reason: eggLosses.reason,
        createdAt: eggLosses.createdAt,
      })
      .from(eggLosses)
      .where(
        and(eq(eggLosses.farmId, farmId), gte(eggLosses.lossDate, startDate), lte(eggLosses.lossDate, endDate)),
      ),
    db
      .select({
        id: expenses.id,
        date: expenses.expenseDate,
        category: expenses.category,
        amount: expenses.amount,
        createdAt: expenses.createdAt,
      })
      .from(expenses)
      .where(
        and(eq(expenses.farmId, farmId), gte(expenses.expenseDate, startDate), lte(expenses.expenseDate, endDate)),
      ),
  ]);

  const typed = [
    ...collections.map((row) => ({ ...row, type: "collection" as const })),
    ...sales.map((row) => ({ ...row, type: "sale" as const })),
    ...lossRows.map((row) => ({ ...row, type: "loss" as const })),
    ...expenseRows.map((row) => ({ ...row, type: "expense" as const })),
  ];

  return typed.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}
