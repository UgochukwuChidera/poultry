# Task Breakdown

Each implementation task should contain:
- Objective
- Context/spec references
- Dependencies
- Expected files/modules
- Acceptance criteria
- Tests
- Definition of done

## Initial tasks

### T01 — Project foundation
Acceptance:
- App runs locally.
- TypeScript, lint, and tests run.
- Database connection configured.
- Base UI system installed.

### T02 — Farm/flock model
Acceptance:
- Farm can be created.
- Two or more flocks can exist.
- Flocks have identifiable lifecycle information.

### T03 — Egg collection
Acceptance:
- Collection can be recorded against a flock.
- Crates and loose eggs are stored.
- Invalid quantities rejected.

### T04 — Egg sales
Acceptance:
- Sale records customer type, quantity, date, and price.
- Sale cannot exceed available stock.
- Revenue is calculated.

### T05 — Expenses
Acceptance:
- Expense records date, category, amount, notes.
- Amount validation works.
- Expense history is queryable.

### T06 — Dashboard
Acceptance:
- Shows current stock, collection, revenue, expenses, and profit.
- Period selection works.
- Values reconcile with transaction history.

### T07 — History
Acceptance:
- Transactions can be viewed and filtered.
- No historical transaction disappears after new activity.

## Agent rule
Do not implement multiple unrelated tasks in one change unless the task explicitly requires it.
