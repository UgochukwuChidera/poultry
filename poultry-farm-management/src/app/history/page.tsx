import { getHistory, getPeriodSummary, getPrimaryFarm } from "@/lib/services/poultry-service";
import { EmptyState, FormCard, Notice, PageHeader, Pill, SecondaryButton, SummaryRow, TextField } from "@/components/ui";
import { toDateInputValue } from "@/lib/utils";

type SearchParams = {
  from?: string;
  to?: string;
};

const typeLabels: Record<string, string> = {
  collection: "Collection",
  sale: "Sale",
  loss: "Loss",
  expense: "Expense",
};

export default async function HistoryPage({ searchParams }: { searchParams?: Promise<SearchParams> }) {
  const params = (await searchParams) ?? {};
  const to = params.to ?? toDateInputValue();
  const from = params.from ?? to.slice(0, 8) + "01";

  const state = await loadHistoryState(from, to);

  if (state.status === "config_error") {
    return (
      <Notice tone="error">Set the Supabase URL and key environment variables, then run Supabase migrations, to view history.</Notice>
    );
  }

  if (state.status === "missing_farm") {
    return <Notice tone="warning">Create a farm first on the Farm page to view history.</Notice>;
  }

  const { rows, summary } = state;

  return (
    <section className="space-y-6">
      <PageHeader title="History" description="Every collection, sale, loss, and expense recorded for the selected period." />

      <FormCard title="Period" description="Choose a date range to review.">
        <form className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end" method="get">
          <TextField label="From" name="from" type="date" defaultValue={from} />
          <TextField label="To" name="to" type="date" defaultValue={to} />
          <SecondaryButton type="submit" className="w-full sm:w-auto">
            Apply
          </SecondaryButton>
        </form>
      </FormCard>

      <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:p-5">
        <SummaryRow label="Revenue" value={`₦${summary.revenue.toFixed(2)}`} />
        <SummaryRow label="Expenses" value={`₦${summary.expenses.toFixed(2)}`} />
        <SummaryRow label="Profit" value={`₦${summary.profit.toFixed(2)}`} emphasis />
      </div>

      {rows.length === 0 ? (
        <EmptyState title="No transactions in this period" description="Records from the Eggs and Money pages will show up here." />
      ) : (
        <>
          {/* Compact rows on mobile */}
          <div className="space-y-2 sm:hidden">
            {rows.map((row) => (
              <article key={`${row.type}-${row.id}`} className="rounded-2xl border border-stone-200 bg-white p-4 text-sm shadow-sm">
                <div className="flex items-center justify-between">
                  <Pill tone={row.type === "loss" ? "warning" : row.type === "expense" ? "neutral" : "active"}>{typeLabels[row.type]}</Pill>
                  <span className="text-xs text-stone-400">{String(row.date)}</span>
                </div>
                <dl className="mt-2 space-y-1 text-stone-700">
                  {"crates" in row ? (
                    <div className="flex justify-between">
                      <dt className="text-stone-500">Quantity</dt>
                      <dd>
                        {row.crates} crates, {row.looseEggs} loose eggs
                      </dd>
                    </div>
                  ) : null}
                  {"amount" in row ? (
                    <div className="flex justify-between">
                      <dt className="text-stone-500">Amount</dt>
                      <dd className="tabular font-medium text-stone-950">₦{Number(row.amount).toFixed(2)}</dd>
                    </div>
                  ) : null}
                  {"category" in row ? (
                    <div className="flex justify-between">
                      <dt className="text-stone-500">Category</dt>
                      <dd className="capitalize">{row.category}</dd>
                    </div>
                  ) : null}
                  {"customerType" in row ? (
                    <div className="flex justify-between">
                      <dt className="text-stone-500">Customer</dt>
                      <dd className="capitalize">{row.customerType}</dd>
                    </div>
                  ) : null}
                  {"reason" in row ? (
                    <div className="flex justify-between">
                      <dt className="text-stone-500">Reason</dt>
                      <dd>{row.reason}</dd>
                    </div>
                  ) : null}
                </dl>
              </article>
            ))}
          </div>

          {/* Table on larger screens */}
          <div className="hidden overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm sm:block">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-stone-200 bg-stone-50 text-xs font-semibold uppercase tracking-wide text-stone-500">
                <tr>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Quantity</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Detail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {rows.map((row) => (
                  <tr key={`${row.type}-${row.id}`} className="hover:bg-stone-50">
                    <td className="px-4 py-3">
                      <Pill tone={row.type === "loss" ? "warning" : row.type === "expense" ? "neutral" : "active"}>{typeLabels[row.type]}</Pill>
                    </td>
                    <td className="px-4 py-3 text-stone-600">{String(row.date)}</td>
                    <td className="px-4 py-3 text-stone-700">{"crates" in row ? `${row.crates} crates, ${row.looseEggs} loose` : "—"}</td>
                    <td className="tabular px-4 py-3 font-medium text-stone-950">{"amount" in row ? `₦${Number(row.amount).toFixed(2)}` : "—"}</td>
                    <td className="px-4 py-3 text-stone-600">
                      {"category" in row ? <span className="capitalize">{row.category}</span> : null}
                      {"customerType" in row ? <span className="capitalize">{row.customerType}</span> : null}
                      {"reason" in row ? row.reason : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
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
