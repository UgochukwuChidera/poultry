# Product Requirements Document

## 1. Problem
Farm records are scattered across different places, making it difficult to know current egg stock, income, expenses, losses, and profitability.

## 2. Goal
Provide a simple system where daily farm events are recorded in one place and useful financial/inventory information is calculated automatically.

## 3. Primary user
Farm owner.

## 4. Secondary/future users
Farm workers and managers.

## 5. User stories
- As the farm owner, I can record eggs collected from a flock.
- I can see current egg stock as crates plus loose eggs.
- I can record an egg sale with quantity and price.
- I can record an expense with category, amount, date, and notes.
- I can see income and expenses for a period.
- I can see profit calculated from recorded transactions.
- I can review historical records.
- I can distinguish flock performance when flocks have different ages/stages.

## 6. Functional requirements

### Farm and flocks
- Create/edit farm.
- Create/edit flock.
- Record flock start/acquisition date.
- Track flock status/lifecycle stage.
- Associate relevant egg activity with a flock.

### Egg collection
- Record collection date.
- Select flock.
- Record full crates.
- Record loose eggs.
- Validate non-negative quantities.

### Egg inventory
- Calculate stock from recorded collections, sales, and losses.
- Display full crates and loose eggs.
- Avoid treating a temporary production spike as a permanent expectation.

### Sales/income
- Record sale date.
- Record customer type: retailer or wholesaler.
- Record crates and loose eggs sold.
- Record price.
- Calculate sale revenue.
- Prevent sales exceeding available inventory.

### Expenses
- Record date.
- Category.
- Amount.
- Notes/description.
- Initial categories include feed, feed-production materials, vaccines, drugs/medication, production materials, and other.

### Dashboard
- Current egg stock.
- Today's egg collection.
- Sales/revenue.
- Expenses.
- Profit.
- Useful period summaries.

### History
- Browse/filter collections, sales, and expenses by date.
- Preserve transaction history.

## 7. Non-functional requirements
- Mobile-first.
- Responsive.
- Simple enough for daily use by a non-technical operator.
- Strong data validation.
- Reliable persistence.
- Clear error/confirmation states.
- Auditable transaction history.

## 8. Success criteria
- Daily records can be entered quickly.
- Inventory reconciles from recorded events.
- Revenue and expenses can be reviewed by period.
- Profit is derived consistently.
- Historical records remain trustworthy.
