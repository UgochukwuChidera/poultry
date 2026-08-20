import { canSubtractQuantity, computeInventory } from "@/lib/domain/inventory";
import { computePeriodSummary, sumAmounts } from "@/lib/domain/metrics";
import { supabaseRest } from "@/lib/supabase/server";

type FarmRow = { id: string; name: string; location: string | null; created_at: string; updated_at: string };
type FlockRow = { id: string; farm_id: string; name: string; start_date: string; status: string; stage: string; notes: string | null; created_at: string; updated_at: string };
type QuantityRow = { crates: number; loose_eggs: number };
type AmountRow = { amount?: string; total_price?: string };
type CollectionHistoryRow = QuantityRow & { id: string; collection_date: string; flock_id: string; created_at: string };
type SaleHistoryRow = QuantityRow & { id: string; sale_date: string; customer_type: string; total_price: string; created_at: string };
type LossHistoryRow = QuantityRow & { id: string; loss_date: string; reason: string; created_at: string };
type ExpenseHistoryRow = { id: string; expense_date: string; category: string; amount: string; created_at: string };

function dateFrom(value: string) {
  return new Date(value);
}

function mapFarm(row: FarmRow) {
  return { id: row.id, name: row.name, location: row.location, createdAt: dateFrom(row.created_at), updatedAt: dateFrom(row.updated_at) };
}

function mapFlock(row: FlockRow) {
  return {
    id: row.id,
    farmId: row.farm_id,
    name: row.name,
    startDate: row.start_date,
    status: row.status,
    stage: row.stage,
    notes: row.notes,
    createdAt: dateFrom(row.created_at),
    updatedAt: dateFrom(row.updated_at),
  };
}

export async function getPrimaryFarmViaSupabase() {
  const rows = await supabaseRest<FarmRow[]>("farms", { query: { select: "*", order: "created_at.asc", limit: 1 } });
  return rows[0] ? mapFarm(rows[0]) : null;
}

export async function createFarmViaSupabase(payload: { name: string; location?: string }) {
  const rows = await supabaseRest<FarmRow[]>("farms", { method: "POST", body: { name: payload.name, location: payload.location || null } });
  return mapFarm(rows[0]);
}

export async function updateFarmViaSupabase(id: string, payload: { name: string; location?: string }) {
  const rows = await supabaseRest<FarmRow[]>("farms", { method: "PATCH", query: { id: `eq.${id}` }, body: { name: payload.name, location: payload.location || null, updated_at: new Date().toISOString() } });
  return mapFarm(rows[0]);
}

export async function listFlocksViaSupabase(farmId: string) {
  const rows = await supabaseRest<FlockRow[]>("flocks", { query: { select: "*", farm_id: `eq.${farmId}`, order: "start_date.desc,created_at.desc" } });
  return rows.map(mapFlock);
}

export async function createFlockViaSupabase(payload: { farmId: string; name: string; startDate: string; status: string; stage: string; notes?: string }) {
  const rows = await supabaseRest<FlockRow[]>("flocks", { method: "POST", body: { farm_id: payload.farmId, name: payload.name, start_date: payload.startDate, status: payload.status, stage: payload.stage, notes: payload.notes || null } });
  return mapFlock(rows[0]);
}

export async function getInventoryViaSupabase(farmId: string) {
  const [collections, sales, losses] = await Promise.all([
    supabaseRest<QuantityRow[]>("egg_collections", { query: { select: "crates,loose_eggs", farm_id: `eq.${farmId}` } }),
    supabaseRest<QuantityRow[]>("egg_sales", { query: { select: "crates,loose_eggs", farm_id: `eq.${farmId}` } }),
    supabaseRest<QuantityRow[]>("egg_losses", { query: { select: "crates,loose_eggs", farm_id: `eq.${farmId}` } }),
  ]);

  return computeInventory(
    collections.map((row) => ({ crates: row.crates, looseEggs: row.loose_eggs })),
    sales.map((row) => ({ crates: row.crates, looseEggs: row.loose_eggs })),
    losses.map((row) => ({ crates: row.crates, looseEggs: row.loose_eggs })),
  );
}

export async function recordEggCollectionViaSupabase(payload: { farmId: string; flockId: string; date: string; crates: number; looseEggs: number; note?: string }) {
  return supabaseRest<unknown[]>("egg_collections", { method: "POST", body: { farm_id: payload.farmId, flock_id: payload.flockId, collection_date: payload.date, crates: payload.crates, loose_eggs: payload.looseEggs, note: payload.note || null } });
}

export async function recordEggSaleViaSupabase(payload: { farmId: string; date: string; customerType: string; crates: number; looseEggs: number; totalPrice: number; note?: string }) {
  const currentInventory = await getInventoryViaSupabase(payload.farmId);
  if (!canSubtractQuantity(currentInventory, { crates: payload.crates, looseEggs: payload.looseEggs })) throw new Error("Sale exceeds available inventory");
  return supabaseRest<unknown[]>("egg_sales", { method: "POST", body: { farm_id: payload.farmId, sale_date: payload.date, customer_type: payload.customerType, crates: payload.crates, loose_eggs: payload.looseEggs, total_price: payload.totalPrice.toFixed(2), note: payload.note || null } });
}

export async function recordEggLossViaSupabase(payload: { farmId: string; date: string; crates: number; looseEggs: number; reason: string }) {
  const currentInventory = await getInventoryViaSupabase(payload.farmId);
  if (!canSubtractQuantity(currentInventory, { crates: payload.crates, looseEggs: payload.looseEggs })) throw new Error("Loss exceeds available inventory");
  return supabaseRest<unknown[]>("egg_losses", { method: "POST", body: { farm_id: payload.farmId, loss_date: payload.date, crates: payload.crates, loose_eggs: payload.looseEggs, reason: payload.reason } });
}

export async function recordExpenseViaSupabase(payload: { farmId: string; expenseDate: string; category: string; amount: number; notes?: string }) {
  return supabaseRest<unknown[]>("expenses", { method: "POST", body: { farm_id: payload.farmId, expense_date: payload.expenseDate, category: payload.category, amount: payload.amount.toFixed(2), notes: payload.notes || null } });
}

export async function getDashboardMetricsViaSupabase(farmId: string, date: string) {
  const [inventory, collections, sales, expenses] = await Promise.all([
    getInventoryViaSupabase(farmId),
    supabaseRest<QuantityRow[]>("egg_collections", { query: { select: "crates,loose_eggs", farm_id: `eq.${farmId}`, collection_date: `eq.${date}` } }),
    supabaseRest<AmountRow[]>("egg_sales", { query: { select: "total_price", farm_id: `eq.${farmId}`, sale_date: `eq.${date}` } }),
    supabaseRest<AmountRow[]>("expenses", { query: { select: "amount", farm_id: `eq.${farmId}`, expense_date: `eq.${date}` } }),
  ]);
  const todayCollection = collections.reduce((acc, row) => ({ crates: acc.crates + row.crates, looseEggs: acc.looseEggs + row.loose_eggs }), { crates: 0, looseEggs: 0 });
  const revenue = sumAmounts(sales.map((row) => Number(row.total_price)));
  const expenseTotal = sumAmounts(expenses.map((row) => Number(row.amount)));
  return { inventory, todayCollection, revenue, expenses: expenseTotal, profit: revenue - expenseTotal };
}

export async function getPeriodSummaryViaSupabase(farmId: string, startDate: string, endDate: string) {
  const [sales, expenses] = await Promise.all([
    supabaseRest<AmountRow[]>("egg_sales", { query: { select: "total_price", farm_id: `eq.${farmId}`, sale_date: `gte.${startDate}`, and: `(sale_date.lte.${endDate})` } }),
    supabaseRest<AmountRow[]>("expenses", { query: { select: "amount", farm_id: `eq.${farmId}`, expense_date: `gte.${startDate}`, and: `(expense_date.lte.${endDate})` } }),
  ]);
  return computePeriodSummary(sales.map((row) => Number(row.total_price)), expenses.map((row) => Number(row.amount)));
}

export async function getHistoryViaSupabase(farmId: string, startDate: string, endDate: string) {
  const [collections, sales, losses, expenseRows] = await Promise.all([
    supabaseRest<CollectionHistoryRow[]>("egg_collections", { query: { select: "id,collection_date,crates,loose_eggs,flock_id,created_at", farm_id: `eq.${farmId}`, collection_date: `gte.${startDate}`, and: `(collection_date.lte.${endDate})` } }),
    supabaseRest<SaleHistoryRow[]>("egg_sales", { query: { select: "id,sale_date,crates,loose_eggs,customer_type,total_price,created_at", farm_id: `eq.${farmId}`, sale_date: `gte.${startDate}`, and: `(sale_date.lte.${endDate})` } }),
    supabaseRest<LossHistoryRow[]>("egg_losses", { query: { select: "id,loss_date,crates,loose_eggs,reason,created_at", farm_id: `eq.${farmId}`, loss_date: `gte.${startDate}`, and: `(loss_date.lte.${endDate})` } }),
    supabaseRest<ExpenseHistoryRow[]>("expenses", { query: { select: "id,expense_date,category,amount,created_at", farm_id: `eq.${farmId}`, expense_date: `gte.${startDate}`, and: `(expense_date.lte.${endDate})` } }),
  ]);
  return [
    ...collections.map((row) => ({ id: row.id, date: row.collection_date, crates: row.crates, looseEggs: row.loose_eggs, flockId: row.flock_id, createdAt: dateFrom(row.created_at), type: "collection" as const })),
    ...sales.map((row) => ({ id: row.id, date: row.sale_date, crates: row.crates, looseEggs: row.loose_eggs, customerType: row.customer_type, amount: row.total_price, createdAt: dateFrom(row.created_at), type: "sale" as const })),
    ...losses.map((row) => ({ id: row.id, date: row.loss_date, crates: row.crates, looseEggs: row.loose_eggs, reason: row.reason, createdAt: dateFrom(row.created_at), type: "loss" as const })),
    ...expenseRows.map((row) => ({ id: row.id, date: row.expense_date, category: row.category, amount: row.amount, createdAt: dateFrom(row.created_at), type: "expense" as const })),
  ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}
