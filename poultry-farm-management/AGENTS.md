# AGENTS.md

## Mission
Build a reliable, simple, mobile-first poultry farm management system. Optimize for correctness and ease of daily use over feature volume.

## Non-negotiables
1. Do not invent business rules. If the specification is silent, inspect existing decisions/docs before choosing.
2. Never store derived totals as the source of truth when they can be calculated from recorded events.
3. Preserve financial and inventory integrity. Never silently discard or mutate historical transactions.
4. Use strict TypeScript. Avoid `any` unless explicitly justified.
5. Keep domain/business logic separate from presentation components.
6. Validate quantities, prices, dates, and relationships at the application boundary.
7. Every new feature must include appropriate tests.
8. Do not introduce dependencies without a clear reason.
9. Keep the MVP small. Do not implement Future Vision items unless a task explicitly promotes them into scope.
10. Update documentation/ADRs when an architectural decision changes.

## Product model
A farm contains multiple flocks. A flock is a group of birds managed together and may differ in age, production stage, and performance.

Egg inventory is represented by crates and loose eggs. Collections increase stock; sales and recorded losses decrease stock.

Revenue is derived from sales. Profit is revenue minus recorded expenses for the selected period.

## UX rules
- Mobile-first.
- Common daily actions should be fast and obvious.
- Prefer one focused task per screen.
- Use plain language suitable for a non-technical farm operator.
- Avoid unnecessary fields.
- Always show confirmation/error states for important transactions.

## Definition of done
- Requirement implemented.
- Validation included.
- Relevant tests pass.
- No unrelated regressions.
- Documentation updated when behavior or architecture changes.
