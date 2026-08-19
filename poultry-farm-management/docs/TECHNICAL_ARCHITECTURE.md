# Technical Architecture

## Proposed stack
- Next.js
- TypeScript
- PostgreSQL
- Drizzle ORM
- Tailwind CSS
- shadcn/ui

## Architecture principles
- Mobile-first UI.
- Server-side business operations where appropriate.
- Database is the source of truth.
- Domain rules should be testable independently of UI.
- Keep presentation, domain logic, and persistence concerns separated.
- Prefer small modules over a giant service layer.

## Data strategy
Use transaction/event records as the source of truth.

Derived values:
- Current egg stock
- Revenue
- Expenses by period
- Profit
- Production trends

should be calculated from recorded events.

## API/application boundary
Validate all externally supplied values before persistence:
- quantities
- prices
- dates
- IDs/relationships
- transaction ownership

## Authentication
Start with a simple authenticated farm owner account. Keep the model extensible for workers/managers later.

## Storage
Database for structured data. Object storage may be introduced later for receipt images or attachments.

## Deployment
Choose a managed PostgreSQL provider and a managed Next.js deployment platform appropriate to the final environment. Keep provider-specific code isolated.
