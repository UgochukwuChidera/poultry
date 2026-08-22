import * as supabaseRepository from "@/lib/services/supabase-repository";
import {
  eggCollectionSchema,
  eggLossSchema,
  eggSaleSchema,
  expenseSchema,
  farmInputSchema,
  flockInputSchema,
} from "@/lib/domain/validation";

export async function getPrimaryFarm() {
  return supabaseRepository.getPrimaryFarmViaSupabase();
}

export async function createFarm(input: unknown) {
  const payload = farmInputSchema.parse(input);
  return supabaseRepository.createFarmViaSupabase(payload);
}

export async function updateFarm(id: string, input: unknown) {
  const payload = farmInputSchema.parse(input);
  return supabaseRepository.updateFarmViaSupabase(id, payload);
}

export async function listFlocks(farmId: string) {
  return supabaseRepository.listFlocksViaSupabase(farmId);
}

export async function createFlock(input: unknown) {
  const payload = flockInputSchema.parse(input);
  return supabaseRepository.createFlockViaSupabase(payload);
}

export async function getInventory(farmId: string) {
  return supabaseRepository.getInventoryViaSupabase(farmId);
}

export async function recordEggCollection(input: unknown) {
  const payload = eggCollectionSchema.parse(input);
  return supabaseRepository.recordEggCollectionViaSupabase(payload);
}

export async function recordEggSale(input: unknown) {
  const payload = eggSaleSchema.parse(input);
  return supabaseRepository.recordEggSaleViaSupabase(payload);
}

export async function recordEggLoss(input: unknown) {
  const payload = eggLossSchema.parse(input);
  return supabaseRepository.recordEggLossViaSupabase(payload);
}

export async function recordExpense(input: unknown) {
  const payload = expenseSchema.parse(input);
  return supabaseRepository.recordExpenseViaSupabase(payload);
}

export async function getDashboardMetrics(farmId: string, date: string) {
  return supabaseRepository.getDashboardMetricsViaSupabase(farmId, date);
}

export async function getPeriodSummary(farmId: string, startDate: string, endDate: string) {
  return supabaseRepository.getPeriodSummaryViaSupabase(farmId, startDate, endDate);
}

export async function getHistory(farmId: string, startDate: string, endDate: string) {
  return supabaseRepository.getHistoryViaSupabase(farmId, startDate, endDate);
}
