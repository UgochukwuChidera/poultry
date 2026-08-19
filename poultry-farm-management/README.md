# Poultry Farm Management System

Mobile-first poultry farm operations system for farm/flock setup, egg inventory, sales/income, expenses, history, and dashboard summaries.

## Stack
- Next.js (App Router) + TypeScript
- PostgreSQL
- Drizzle ORM
- Tailwind CSS
- Vitest for domain tests

## Setup
1. Install dependencies:
   - `npm install`
2. Configure environment:
   - `DATABASE_URL=postgres://...`
3. Apply database migration:
   - `npm run db:migrate`
4. Run app:
   - `npm run dev`

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
