import { MetricCard, Notice, PageHeader } from "@/components/ui";
import { getDashboardMetrics, getPrimaryFarm } from "@/lib/services/poultry-service";
import { toDateInputValue } from "@/lib/utils";

export default async function HomePage() {
  const state = await loadDashboardState();

  if (state.status === "config_error") {
    return <Notice tone="error">Set Supabase URL/key environment variables, or use SUPABASE_DB_URL as a server-only fallback, then run Supabase migrations to view dashboard data.</Notice>;
  }

  if (state.status === "missing_farm") {
    return <Notice tone="warning">Create your farm first on the Farm page.</Notice>;
  }

  const { metrics } = state;

  return (
    <section className="space-y-6">
      <PageHeader title="Farm Dashboard" description="A calm daily overview of your poultry operation using the records already captured in this app." />
      <div className="flex flex-wrap gap-2 rounded-2xl border border-gray-200 bg-white p-2 text-sm font-medium text-gray-600 shadow-sm">
        <span className="rounded-full bg-emerald-900 px-4 py-2 text-white">Operations</span>
        <span className="rounded-full px-4 py-2">Money</span>
        <span className="rounded-full px-4 py-2">Records</span>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <MetricCard label="Current stock" value={`${metrics.inventory.crates} crates`} helper={`${metrics.inventory.looseEggs} loose eggs available`} />
        <MetricCard label="Today's collection" value={`${metrics.todayCollection.crates} crates`} helper={`${metrics.todayCollection.looseEggs} loose eggs collected`} />
        <MetricCard label="Today's revenue" value={`₦${metrics.revenue.toFixed(2)}`} helper="Derived from sales records" />
        <MetricCard label="Today's expenses" value={`₦${metrics.expenses.toFixed(2)}`} helper="Derived from expense records" />
        <MetricCard label="Today's profit" value={`₦${metrics.profit.toFixed(2)}`} helper="Revenue minus expenses" />
      </div>
    </section>
  );
}

async function loadDashboardState() {
  try {
    const farm = await getPrimaryFarm();

    if (!farm) {
      return { status: "missing_farm" as const };
    }

    const today = toDateInputValue();
    const metrics = await getDashboardMetrics(farm.id, today);

    return { status: "ready" as const, metrics };
  } catch {
    return { status: "config_error" as const };
  }
}
