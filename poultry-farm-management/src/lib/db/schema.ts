import {
  date,
  integer,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const flockStatusEnum = pgEnum("flock_status", [
  "active",
  "resting",
  "sold",
  "closed",
]);

export const customerTypeEnum = pgEnum("customer_type", ["retailer", "wholesaler"]);

export const expenseCategoryEnum = pgEnum("expense_category", [
  "feed",
  "feed-production materials",
  "vaccines",
  "drugs/medication",
  "production materials",
  "other",
]);

export const farms = pgTable("farms", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  location: text("location"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const flocks = pgTable("flocks", {
  id: uuid("id").defaultRandom().primaryKey(),
  farmId: uuid("farm_id")
    .notNull()
    .references(() => farms.id),
  name: text("name").notNull(),
  startDate: date("start_date").notNull(),
  status: flockStatusEnum("status").notNull().default("active"),
  stage: text("stage").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const eggCollections = pgTable("egg_collections", {
  id: uuid("id").defaultRandom().primaryKey(),
  farmId: uuid("farm_id")
    .notNull()
    .references(() => farms.id),
  flockId: uuid("flock_id")
    .notNull()
    .references(() => flocks.id),
  collectionDate: date("collection_date").notNull(),
  crates: integer("crates").notNull(),
  looseEggs: integer("loose_eggs").notNull(),
  note: text("note"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const eggSales = pgTable("egg_sales", {
  id: uuid("id").defaultRandom().primaryKey(),
  farmId: uuid("farm_id")
    .notNull()
    .references(() => farms.id),
  saleDate: date("sale_date").notNull(),
  customerType: customerTypeEnum("customer_type").notNull(),
  crates: integer("crates").notNull(),
  looseEggs: integer("loose_eggs").notNull(),
  totalPrice: numeric("total_price", { precision: 12, scale: 2 }).notNull(),
  note: text("note"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const eggLosses = pgTable("egg_losses", {
  id: uuid("id").defaultRandom().primaryKey(),
  farmId: uuid("farm_id")
    .notNull()
    .references(() => farms.id),
  lossDate: date("loss_date").notNull(),
  crates: integer("crates").notNull(),
  looseEggs: integer("loose_eggs").notNull(),
  reason: text("reason").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const expenses = pgTable("expenses", {
  id: uuid("id").defaultRandom().primaryKey(),
  farmId: uuid("farm_id")
    .notNull()
    .references(() => farms.id),
  expenseDate: date("expense_date").notNull(),
  category: expenseCategoryEnum("category").notNull(),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
