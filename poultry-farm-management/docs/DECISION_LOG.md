# Decision Log

## D001 — Model flocks inside a farm
**Decision:** A farm contains multiple flocks rather than treating each flock as a separate project.

**Reason:** The owner needs both farm-wide totals and flock-level performance. This avoids mixing young and mature birds while avoiding fragmented management.

## D002 — Inventory from events
**Decision:** Egg stock is derived from collection, sales, and loss events.

**Reason:** Avoid inconsistent manually maintained totals.

## D003 — Record crates and loose eggs
**Decision:** Inventory and transactions support both full crates and leftover individual eggs.

**Reason:** This matches the actual farm workflow.

## D004 — Sale price per transaction
**Decision:** Store price on each sale.

**Reason:** Price is usually fixed but varies by customer.

## D005 — Keep future scope separate
**Decision:** Future features live in a roadmap rather than being silently implemented in MVP.

**Reason:** Keeps autonomous development agents focused.

## D006 — Inventory quantity handled as components
**Decision:** During MVP, inventory checks operate on `crates` and `loose eggs` as separate components without crate-to-egg conversion.

**Reason:** Crate capacity is currently an unresolved requirement, so conversion assumptions would introduce undocumented rules.
