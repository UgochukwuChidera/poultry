import { recordExpenseAction } from "@/app/actions";
import { getPeriodSummary, getPrimaryFarm } from "@/lib/services/poultry-service";
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
    return <p className="rounded bg-red-100 p-3 text-red-900">Set SUPABASE_DB_URL (or DATABASE_URL) and run Supabase migrations to track money.</p>;
  }

  if (state.status === "missing_farm") {
    return <p className="rounded bg-amber-100 p-3 text-amber-900">Create a farm first to track money.</p>;
  }

  const { farm, summary } = state;

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Money</h2>

      <form className="grid grid-cols-2 gap-2 rounded border bg-white p-4" method="get">
        <label className="text-sm">
          From
          <input className="mt-1 w-full rounded border p-2" name="from" type="date" defaultValue={from} />
        </label>
        <label className="text-sm">
          To
          <input className="mt-1 w-full rounded border p-2" name="to" type="date" defaultValue={to} />
        </label>
        <button className="col-span-2 rounded bg-black px-4 py-2 text-white" type="submit">
          Apply
        </button>
      </form>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <article className="rounded border bg-white p-4">
          <h3 className="text-sm text-gray-600">Revenue</h3>
          <p className="text-lg font-semibold">₦{summary.revenue.toFixed(2)}</p>
        </article>
        <article className="rounded border bg-white p-4">
          <h3 className="text-sm text-gray-600">Expenses</h3>
          <p className="text-lg font-semibold">₦{summary.expenses.toFixed(2)}</p>
        </article>
        <article className="rounded border bg-white p-4">
          <h3 className="text-sm text-gray-600">Profit</h3>
          <p className="text-lg font-semibold">₦{summary.profit.toFixed(2)}</p>
        </article>
      </div>

      <form action={recordExpenseAction} className="space-y-2 rounded border bg-white p-4">
        <h3 className="font-medium">Record expense</h3>
        <input name="farmId" type="hidden" value={farm.id} readOnly />
        <input className="w-full rounded border p-2" name="expenseDate" type="date" defaultValue={toDateInputValue()} required />
        <select className="w-full rounded border p-2" name="category" defaultValue="feed">
          {expenseCategories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <input className="w-full rounded border p-2" name="amount" type="number" min="0.01" step="0.01" required />
        <input className="w-full rounded border p-2" name="notes" placeholder="Notes" />
        <button className="rounded bg-black px-4 py-2 text-white" type="submit">
          Save expense
        </button>
      </form>
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
