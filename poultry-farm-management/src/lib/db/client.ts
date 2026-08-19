import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const globalForDb = globalThis as unknown as {
  pool?: Pool;
};

function resolveDatabaseUrl() {
  return process.env.SUPABASE_DB_URL ?? process.env.DATABASE_URL;
}

function getPool() {
  const databaseUrl = resolveDatabaseUrl();

  if (!databaseUrl) {
    throw new Error("SUPABASE_DB_URL (or DATABASE_URL) is required");
  }

  if (!globalForDb.pool) {
    globalForDb.pool = new Pool({ connectionString: databaseUrl });
  }

  return globalForDb.pool;
}

export function getDb() {
  return drizzle(getPool());
}
