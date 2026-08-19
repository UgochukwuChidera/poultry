# Business Rules

## Farm and flock
- One farm can contain multiple flocks.
- A flock represents birds managed together, especially where age/acquisition/production stage differs.
- Farm-level reporting may aggregate flock-level data.
- Flock-level reporting should remain available.

## Egg inventory
- Inventory is represented using full crates and loose eggs.
- Collection increases available inventory.
- Sale decreases available inventory.
- A recorded loss/breakage event decreases available inventory.
- Inventory must never become negative.
- Historical transactions are immutable in meaning; corrections should be explicit rather than silently overwriting history.

## Sales
- Customer type supports retailer and wholesaler initially.
- Price can vary by customer/sale.
- Revenue is calculated from sale transactions.
- Do not store a manually entered profit total as the source of truth.

## Expenses
- Expenses are transaction records with date, category, amount, and optional notes.
- Amount must be positive.
- Categories can expand without changing the underlying transaction model.

## Profit
For a selected period:

Revenue = sum of recorded sales

Profit = Revenue - sum of recorded expenses

This is an operational profit measure, not a full accounting statement.

## Production measurement
- Historical production is measured from actual records.
- Expected production should eventually use a rolling average or other statistical baseline rather than a single unusually high period.
- Different flock ages/stages should not automatically be compared as though they were equivalent.

## Unknowns
The following require later validation:
- Exact crate capacity.
- Whether egg grades/sizes matter.
- Exact handling of broken/damaged eggs.
- Whether collection happens once or multiple times daily.
- Whether customers buy on credit.
- Payment status/cash vs outstanding.
- Exact feed formulation/cost allocation rules.
