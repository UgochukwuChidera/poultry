# Style Adoption Plan

This plan clarifies how to borrow useful dashboard ideas from the reference image without changing the product identity or expanding scope beyond the poultry farm MVP.

## Intent
- Keep the product identity as a simple, reliable, mobile-first poultry farm management system.
- Use the reference image only as visual inspiration for clearer hierarchy, calmer spacing, and dashboard organization.
- Do not rename the app to match the reference brand.
- Do not introduce inventory, accounting, or chart features unless they are supported by the existing domain model or promoted through the roadmap.

## Source-of-truth documents
Implementation decisions must continue to follow:
- `AGENTS.md` for mission, non-negotiables, domain integrity, and UX rules.
- `README.md` for the current stack, setup, migration authority, and MVP coverage.
- `docs/UI_UX_SPEC.md` for mobile-first navigation, practical visual direction, and accessibility.
- `docs/TECHNICAL_ARCHITECTURE.md` for separation of presentation, domain logic, and persistence.
- `docs/adr/ADR-0006-supabase-backend.md` for Supabase migration authority and backend direction.

## What to borrow from the reference
- Stronger page hierarchy: clear dashboard heading, short context text, and grouped summary areas.
- Desktop/tablet sidebar treatment that mirrors the existing mobile information architecture.
- Consistent card styling for the existing dashboard metrics.
- Calm neutral surfaces, readable contrast, and practical spacing.
- Optional top utility area on larger screens if it helps navigation without adding fake features.

## What not to borrow yet
- Do not add unsupported inventory management concepts such as stock SKUs, product categories, suppliers, or warehouse-style counts.
- Do not add accounting modules beyond current sales, expenses, revenue, and profit behavior.
- Do not add decorative charts before chart data is derived from recorded events.
- Do not replace the app name, domain language, or poultry-focused workflows.
- Do not add a large UI dependency solely to imitate the image.

## Implementation sequence
1. Create small shared UI primitives for cards, sections, buttons, and form fields to reduce repeated Tailwind classes.
2. Restyle the shell responsively while preserving mobile bottom navigation and existing routes.
3. Refresh the dashboard using only current MVP metrics: egg stock, collection, revenue, expenses, and profit.
4. Improve empty, success, and error states for farm operators.
5. Revisit Supabase client usage separately as an architecture task, keeping migrations under `supabase/migrations` authoritative.
6. Add trend or chart views only after domain aggregation functions and tests exist.

## Acceptance criteria
- The app still feels like Poultry Farm Management, not a clone of the reference dashboard.
- The mobile experience remains the primary experience.
- Existing routes and workflows remain understandable and fast.
- Derived totals continue to be calculated from event records rather than stored as source-of-truth values.
- Any new architecture or dependency choice is documented before or with the implementation.
