import Link from "next/link";
import { HeroStat, MetricCard, Notice, PageHeader } from "@/components/ui";
import { getDashboardMetrics, getPrimaryFarm } from "@/lib/services/poultry-service";
import { toDateInputValue } from "@/lib/utils";

const quickLinks = [
  { href: "/eggs", label: "Record eggs" },
  { href: "/money", label: "Record money" },
  { href: "/history", label: "View history" },
];

export default async function HomePage() {
  const state = await loadDashboardState();

  if (state.status === "config_error") {
    return <Notice tone="error">Set the Supabase URL and key environment variables, then run Supabase migrations, to view dashboard data.</Notice>;
  }

  if (state.status === "missing_farm") {
    return <Notice tone="warning">Create your farm first on the Farm page.</Notice>;
  }

  const { metrics } = state;

  return (
    <section className="space-y-6">
      <PageHeader
        signature
        title="Farm Dashboard"
        description="A calm daily overview of your poultry operation using the records already captured in this app."
      />
      <div className="flex flex-wrap gap-2 rounded-2xl border border-stone-200 bg-white p-2 text-sm font-medium text-stone-600 shadow-sm">
        {quickLinks.map((link) => (
          <Link key={link.href} href={link.href} className="rounded-full px-4 py-2 transition hover:bg-barn-50 hover:text-barn-900">
            {link.label}
          </Link>
        ))}
      </div>

      <HeroStat
        label="Current stock"
        value={`${metrics.inventory.crates} crates`}
        helper={`${metrics.inventory.looseEggs} loose eggs available`}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
