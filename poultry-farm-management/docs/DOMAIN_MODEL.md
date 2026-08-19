# Domain Model

## Core entities

### Farm
Represents the poultry operation.

### Flock
A managed group of birds within a farm. Important attributes include acquisition/start date, status, and production stage.

### EggCollection
An operational event recording eggs collected from a flock.

### EggSale
A transaction recording eggs sold to a customer.

### EggLoss
An event recording eggs removed from available stock due to breakage/damage/other loss.

### Expense
A financial transaction representing money spent by the farm.

### Customer
Optional MVP entity; initially customer type may be sufficient.

## Relationships
- Farm has many Flocks.
- Flock has many EggCollections.
- Farm has many EggSales.
- Farm has many EggLosses.
- Farm has many Expenses.
- EggSale belongs to a customer/customer type.
- Financial and inventory summaries are derived from transactions.

## Important modeling decision
Do not model a flock as a separate project/application. It is a sub-entity of the farm. This gives the owner an overall farm view while preserving meaningful flock-level performance.
