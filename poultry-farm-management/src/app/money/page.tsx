import { recordExpenseAction } from "@/app/actions";
import { getPeriodSummary, getPrimaryFarm } from "@/lib/services/poultry-service";
import { AppButton, FormCard, MetricCard, Notice, PageHeader, SecondaryButton, SelectField, TextField } from "@/components/ui";
import { toDateInputValue } from "@/lib/utils";

const expenseCategories = [
  "feed",
  "feed-production materials",
  "vaccines",
  "drugs/medication",
  "production materials",
  "other",
] as const;

export default async function MoneyPage({ searchParams }: { searchParams?: Promise<{ from?: string; to?: string }> }) {
  const params = (await searchParams) ?? {};
  const to = params.to ?? toDateInputValue();
  const from = params.from ?? to.slice(0, 8) + "01";

  const state = await loadMoneyState(from, to);

  if (state.status === "config_error") {
    return (
      <Notice tone="error">Set the Supabase URL and key environment variables, then run Supabase migrations, to track money.</Notice>
    );
  }

  if (state.status === "missing_farm") {
    return <Notice tone="warning">Create a farm first on the Farm page to track money.</Notice>;
  }

  const { farm, summary } = state;

  return (
    <section className="space-y-6">
      <PageHeader title="Money" description="Track revenue, expenses, and profit for a selected period." />

      <FormCard title="Period" description="Choose a date range to review.">
        <form className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end" method="get">
          <TextField label="From" name="from" type="date" defaultValue={from} />
          <TextField label="To" name="to" type="date" defaultValue={to} />
          <SecondaryButton type="submit" className="w-full sm:w-auto">
            Apply
          </SecondaryButton>
        </form>
      </FormCard>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCard label="Revenue" value={`₦${summary.revenue.toFixed(2)}`} />
        <MetricCard label="Expenses" value={`₦${summary.expenses.toFixed(2)}`} />
        <MetricCard label="Profit" value={`₦${summary.profit.toFixed(2)}`} helper="Revenue minus expenses" />
      </div>

      <FormCard title="Record expense" description="Add a new expense for this farm.">
        <form action={recordExpenseAction} className="space-y-3">
          <input name="farmId" type="hidden" value={farm.id} readOnly />
          <TextField label="Date" name="expenseDate" type="date" defaultValue={toDateInputValue()} required />
          <SelectField label="Category" name="category" defaultValue="feed">
            {expenseCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </SelectField>
          <TextField label="Amount" name="amount" type="number" min="0.01" step="0.01" required hint="In naira." />
          <TextField label="Notes" name="notes" placeholder="Optional" />
          <AppButton type="submit">Save expense</AppButton>
        </form>
      </FormCard>
    </section>
  );
}

async function loadMoneyState(from: string, to: string) {
  try {
    const farm = await getPrimaryFarm();

    if (!farm) {
      return { status: "missing_farm" as const };
    }

    const summary = await getPeriodSummary(farm.id, from, to);

    return { status: "ready" as const, farm, summary };
  } catch {
    return { status: "config_error" as const };
  }
}
