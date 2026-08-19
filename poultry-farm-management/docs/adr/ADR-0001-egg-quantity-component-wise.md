# ADR-0001 Egg quantity without crate conversion

## Context
The MVP must track inventory as crates plus loose eggs. Current requirements explicitly leave exact crate capacity as unknown.

## Decision
Store and validate egg quantities as two explicit components (`crates`, `looseEggs`) and enforce non-negative inventory component-wise.

Sales and losses are blocked if either requested crates or requested loose eggs exceed currently available crates or loose eggs.

## Alternatives considered
1. Convert all inventory to a single egg count using a fixed crate capacity.
   - Rejected because crate capacity is currently an unresolved requirement.
2. Allow cross-conversion between crates and loose eggs with an assumed capacity.
   - Rejected to avoid introducing undocumented business rules.

## Consequences
- Preserves transactional integrity without guessing crate size.
- Keeps the inventory model compatible with a future crate-capacity decision.
- Some real-world conversions (opening crates into loose eggs) remain deferred until capacity rules are defined.
