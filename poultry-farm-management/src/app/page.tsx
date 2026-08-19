import { getDashboardMetrics, getPrimaryFarm } from "@/lib/services/poultry-service";
import { toDateInputValue } from "@/lib/utils";

export default async function HomePage() {
  try {
    const farm = await getPrimaryFarm();

    if (!farm) {
      return <p className="rounded bg-amber-100 p-3 text-amber-900">Create your farm first on the Farm page.</p>;
    }

    const today = toDateInputValue();
    const metrics = await getDashboardMetrics(farm.id, today);

    return (
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Dashboard</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <article className="rounded border bg-white p-4">
            <h3 className="text-sm text-gray-600">Current stock</h3>
            <p className="text-lg font-semibold">
              {metrics.inventory.crates} crates, {metrics.inventory.looseEggs} loose eggs
            </p>
          </article>
          <article className="rounded border bg-white p-4">
            <h3 className="text-sm text-gray-600">Today&apos;s collection</h3>
            <p className="text-lg font-semibold">
              {metrics.todayCollection.crates} crates, {metrics.todayCollection.looseEggs} loose eggs
            </p>
          </article>
          <article className="rounded border bg-white p-4">
            <h3 className="text-sm text-gray-600">Today&apos;s revenue</h3>
            <p className="text-lg font-semibold">₦{metrics.revenue.toFixed(2)}</p>
          </article>
          <article className="rounded border bg-white p-4">
            <h3 className="text-sm text-gray-600">Today&apos;s expenses</h3>
            <p className="text-lg font-semibold">₦{metrics.expenses.toFixed(2)}</p>
          </article>
          <article className="rounded border bg-white p-4 sm:col-span-2">
            <h3 className="text-sm text-gray-600">Today&apos;s profit</h3>
            <p className="text-xl font-semibold">₦{metrics.profit.toFixed(2)}</p>
          </article>
        </div>
      </section>
    );
  } catch {
    return <p className="rounded bg-red-100 p-3 text-red-900">Set DATABASE_URL and run migrations to view dashboard data.</p>;
  }
}
