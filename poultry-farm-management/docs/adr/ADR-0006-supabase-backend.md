# ADR-0006 — Use Supabase as Backend Infrastructure

## Status

Accepted

## Context

The application requires a reliable PostgreSQL database and will likely require
authentication, backend services, and potentially file storage as the product
grows.

The project was initially planned around:

- Next.js
- PostgreSQL
- Drizzle ORM
- A simple application/API layer

The implementation is already using or may already be using Drizzle.

Supabase provides PostgreSQL together with authentication, database APIs,
storage, and other backend infrastructure.

## Decision

Use Supabase as the backend infrastructure provider.

The architecture becomes:

- Next.js — application/UI
- Supabase — backend infrastructure
- PostgreSQL — primary database
- Drizzle ORM — application-side database access and type-safe queries
- Supabase Auth — authentication when authentication is implemented
- Supabase Storage — future file/object storage where required

Drizzle remains part of the application architecture and should not be
removed merely because Supabase is introduced.

## Database migrations

Supabase migration files are the authoritative source of database schema
changes.

Do not maintain two independent migration histories that modify the same
database.

If Drizzle Kit migrations already exist, they should be reconciled with the
Supabase migration history rather than blindly running both systems against
the same database.

Future schema changes should follow the repository's established Supabase
migration workflow.

## Database access

Application code may use Drizzle for type-safe database queries.

Supabase's generated APIs/client may be used where they provide a clear
advantage, particularly for authentication and Supabase-specific services.

Do not introduce unnecessary duplication between direct database access and
Supabase APIs.

## Security

If Supabase Auth is introduced, row-level security (RLS) should be evaluated
and enabled where appropriate.

The application must never expose privileged database credentials to the
browser.

Server-side credentials must remain server-side.

## Consequences

### Benefits

- Managed PostgreSQL.
- Integrated authentication.
- Potential storage support.
- Good fit with Next.js.
- Drizzle can remain in place.
- Easier path to multi-user functionality later.

### Costs

- Increased dependency on Supabase.
- Supabase-specific concepts such as RLS and migration workflows must be
  understood.
- Care is required to avoid conflicting migration systems.

## Migration from the original architecture

No major product or domain changes are required.

The following remain unchanged:

- Farm → Flocks model.
- Egg collection and inventory model.
- Sales and income.
- Expenses.
- Derived profit.
- Historical transaction integrity.
- Mobile-first UI.

Only the infrastructure/backend implementation is adjusted to use Supabase.

Read docs/adr/ADR-0006-supabase-backend.md before making further database or backend changes. Reconcile any existing Drizzle migration setup with the ADR; do not create competing migration histories.

## Addendum (post-implementation)
Drizzle ORM and the direct PostgreSQL connection (`SUPABASE_DB_URL`/`DATABASE_URL`, `src/lib/db/*`) have since been removed from application code. All reads/writes now go through the Supabase REST API exclusively (see `src/lib/supabase/server.ts` and `src/lib/services/supabase-repository.ts`). Supabase migrations under `supabase/migrations` remain the sole, authoritative schema source. This section documents the change; the original decision record above is left intact.
