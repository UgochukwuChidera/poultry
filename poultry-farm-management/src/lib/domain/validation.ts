import { z } from "zod";

const nonNegativeInteger = z
  .number({ coerce: true })
  .int("Must be a whole number")
  .min(0, "Must be non-negative");

const positiveNumber = z
  .number({ coerce: true })
  .positive("Must be greater than zero")
  .finite("Must be a valid number");

const validDate = z.string().date("Invalid date");

export const farmInputSchema = z.object({
  name: z.string().trim().min(1, "Farm name is required"),
  location: z.string().trim().optional(),
});

export const flockInputSchema = z.object({
  farmId: z.string().uuid(),
  name: z.string().trim().min(1, "Flock name is required"),
  startDate: validDate,
  status: z.enum(["active", "resting", "sold", "closed"]),
  stage: z.string().trim().min(1, "Production stage is required"),
  notes: z.string().trim().optional(),
});

export const eggEventSchema = z.object({
  farmId: z.string().uuid(),
  date: validDate,
  crates: nonNegativeInteger,
  looseEggs: nonNegativeInteger,
});

export const eggCollectionSchema = eggEventSchema.extend({
  flockId: z.string().uuid(),
  note: z.string().trim().optional(),
});

export const eggSaleSchema = eggEventSchema.extend({
  customerType: z.enum(["retailer", "wholesaler"]),
  totalPrice: positiveNumber,
  note: z.string().trim().optional(),
});

export const eggLossSchema = eggEventSchema.extend({
  reason: z.string().trim().min(1, "Reason is required"),
});

export const expenseSchema = z.object({
  farmId: z.string().uuid(),
  expenseDate: validDate,
  category: z.enum([
    "feed",
    "feed-production materials",
    "vaccines",
    "drugs/medication",
    "production materials",
    "other",
  ]),
  amount: positiveNumber,
  notes: z.string().trim().optional(),
});
