"use server";

import { revalidatePath } from "next/cache";
import {
  createFarm,
  createFlock,
  recordEggCollection,
  recordEggLoss,
  recordEggSale,
  recordExpense,
  updateFarm,
} from "@/lib/services/poultry-service";

function requiredText(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function optionalText(formData: FormData, key: string) {
  const value = String(formData.get(key) ?? "").trim();
  return value.length > 0 ? value : undefined;
}

export async function createFarmAction(formData: FormData) {
  await createFarm({
    name: requiredText(formData, "name"),
    location: optionalText(formData, "location"),
  });

  revalidatePath("/");
  revalidatePath("/farm");
}

export async function updateFarmAction(formData: FormData) {
  const farmId = requiredText(formData, "farmId");
  await updateFarm(farmId, {
    name: requiredText(formData, "name"),
    location: optionalText(formData, "location"),
  });

  revalidatePath("/");
  revalidatePath("/farm");
}

export async function createFlockAction(formData: FormData) {
  await createFlock({
    farmId: requiredText(formData, "farmId"),
    name: requiredText(formData, "name"),
    startDate: requiredText(formData, "startDate"),
    status: requiredText(formData, "status"),
    stage: requiredText(formData, "stage"),
    notes: optionalText(formData, "notes"),
  });

  revalidatePath("/farm");
}

export async function recordCollectionAction(formData: FormData) {
  await recordEggCollection({
    farmId: requiredText(formData, "farmId"),
    flockId: requiredText(formData, "flockId"),
    date: requiredText(formData, "date"),
    crates: requiredText(formData, "crates"),
    looseEggs: requiredText(formData, "looseEggs"),
    note: optionalText(formData, "note"),
  });

  revalidatePath("/");
  revalidatePath("/eggs");
  revalidatePath("/history");
}

export async function recordSaleAction(formData: FormData) {
  await recordEggSale({
    farmId: requiredText(formData, "farmId"),
    date: requiredText(formData, "date"),
    customerType: requiredText(formData, "customerType"),
    crates: requiredText(formData, "crates"),
    looseEggs: requiredText(formData, "looseEggs"),
    totalPrice: requiredText(formData, "totalPrice"),
    note: optionalText(formData, "note"),
  });

  revalidatePath("/");
  revalidatePath("/eggs");
  revalidatePath("/money");
  revalidatePath("/history");
}

export async function recordLossAction(formData: FormData) {
  await recordEggLoss({
    farmId: requiredText(formData, "farmId"),
    date: requiredText(formData, "date"),
    crates: requiredText(formData, "crates"),
    looseEggs: requiredText(formData, "looseEggs"),
    reason: requiredText(formData, "reason"),
  });

  revalidatePath("/");
  revalidatePath("/eggs");
  revalidatePath("/history");
}

export async function recordExpenseAction(formData: FormData) {
  await recordExpense({
    farmId: requiredText(formData, "farmId"),
    expenseDate: requiredText(formData, "expenseDate"),
    category: requiredText(formData, "category"),
    amount: requiredText(formData, "amount"),
    notes: optionalText(formData, "notes"),
  });

  revalidatePath("/");
  revalidatePath("/money");
  revalidatePath("/history");
}
