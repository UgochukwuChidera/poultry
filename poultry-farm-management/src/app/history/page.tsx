import { getHistory, getPeriodSummary, getPrimaryFarm } from "@/lib/services/poultry-service";
import { toDateInputValue } from "@/lib/utils";

type SearchParams = {
  from?: string;
  to?: string;
};

export default async function HistoryPage({ searchParams }: { searchParams?: Promise<SearchParams> }) {
  const params = (await searchParams) ?? {};
  const to = params.to ?? toDateInputValue();
  const from = params.from ?? to.slice(0, 8) + "01";

  const state = await loadHistoryState(from, to);

  if (state.status === "config_error") {
    return <p className="rounded bg-red-100 p-3 text-red-900">Set SUPABASE_DB_URL (or DATABASE_URL) and run Supabase migrations to view history.</p>;
  }

  if (state.status === "missing_farm") {
    return <p className="rounded bg-amber-100 p-3 text-amber-900">Create a farm first to view history.</p>;
  }

  const { rows, summary } = state;

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">History</h2>

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

      <article className="rounded border bg-white p-4 text-sm">
        <p>Revenue: ₦{summary.revenue.toFixed(2)}</p>
        <p>Expenses: ₦{summary.expenses.toFixed(2)}</p>
        <p className="font-semibold">Profit: ₦{summary.profit.toFixed(2)}</p>
      </article>

      <div className="space-y-2">
        {rows.length === 0 ? (
          <p className="rounded border bg-white p-3 text-sm text-gray-600">No transactions in this period.</p>
        ) : (
          rows.map((row) => (
            <article key={`${row.type}-${row.id}`} className="rounded border bg-white p-3 text-sm">
              <p className="font-semibold capitalize">{row.type}</p>
              <p>Date: {String(row.date)}</p>
              {"crates" in row ? (
                <p>
                  Quantity: {row.crates} crates, {row.looseEggs} loose eggs
                </p>
              ) : null}
              {"amount" in row ? <p>Amount: ₦{Number(row.amount).toFixed(2)}</p> : null}
              {"category" in row ? <p>Category: {row.category}</p> : null}
              {"customerType" in row ? <p>Customer type: {row.customerType}</p> : null}
              {"reason" in row ? <p>Reason: {row.reason}</p> : null}
            </article>
          ))
        )}
      </div>
    </section>
  );
}

async function loadHistoryState(from: string, to: string) {
  try {
    const farm = await getPrimaryFarm();

    if (!farm) {
      return { status: "missing_farm" as const };
    }

    const [rows, summary] = await Promise.all([getHistory(farm.id, from, to), getPeriodSummary(farm.id, from, to)]);

    return { status: "ready" as const, rows, summary };
  } catch {
    return { status: "config_error" as const };
  }
}
