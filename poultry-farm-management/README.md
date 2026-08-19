# Poultry Farm Management System

Mobile-first poultry farm operations system for farm/flock setup, egg inventory, sales/income, expenses, history, and dashboard summaries.

## Stack
- Next.js (App Router) + TypeScript
- Supabase (backend infrastructure)
- PostgreSQL
- Drizzle ORM
- Tailwind CSS
- Vitest for domain tests

## Setup
1. Install dependencies:
   - `npm install`
2. Configure environment:
   - `SUPABASE_DB_URL=postgres://...`
   - `NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY=...`
   - `SUPABASE_SERVICE_ROLE_KEY=...` (server-side only)
3. Apply database migrations (Supabase-authoritative workflow):
   - `npm run db:migrate`
4. Run app:
   - `npm run dev`

## Database migration authority
- Supabase migrations in `supabase/migrations` are authoritative.
- Drizzle remains for schema/types and application-side queries.
- Do not run independent Drizzle and Supabase migration histories against the same database.
- Read `docs/adr/ADR-0006-supabase-backend.md` before backend/database changes.

## Quality checks
- `npm run typecheck`
- `npm run lint`
- `npm test`

## MVP coverage in this implementation
- Farm setup and updates
- Multi-flock management
- Egg collection recording by flock
- Egg inventory from collections/sales/losses
- Egg sales/income recording with inventory guardrails
- Expense tracking
- Transaction history with date filters
- Dashboard with daily stock/revenue/expense/profit metrics

See `docs/` for full product references and decisions.
