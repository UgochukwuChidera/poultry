import { recordCollectionAction, recordLossAction, recordSaleAction } from "@/app/actions";
import { getInventory, getPrimaryFarm, listFlocks } from "@/lib/services/poultry-service";
import { toDateInputValue } from "@/lib/utils";

export default async function EggsPage() {
  const state = await loadEggsState();

  if (state.status === "config_error") {
    return <p className="rounded bg-red-100 p-3 text-red-900">Set Supabase URL/key env vars (or SUPABASE_DB_URL fallback) and run Supabase migrations to manage egg records.</p>;
  }

  if (state.status === "missing_farm") {
    return <p className="rounded bg-amber-100 p-3 text-amber-900">Create farm and flocks first.</p>;
  }

  const { farm, inventory, flocks } = state;

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Eggs</h2>

      <article className="rounded border bg-white p-4">
        <h3 className="font-medium">Current inventory</h3>
        <p className="text-lg font-semibold">
          {inventory.crates} crates, {inventory.looseEggs} loose eggs
        </p>
      </article>

      <form action={recordCollectionAction} className="space-y-2 rounded border bg-white p-4">
        <h3 className="font-medium">Record collection</h3>
        <input name="farmId" type="hidden" value={farm.id} readOnly />
        <input className="w-full rounded border p-2" name="date" type="date" defaultValue={toDateInputValue()} required />
        <select className="w-full rounded border p-2" name="flockId" required>
          <option value="">Select flock</option>
          {flocks.map((flock) => (
            <option key={flock.id} value={flock.id}>
              {flock.name}
            </option>
          ))}
        </select>
        <input className="w-full rounded border p-2" name="crates" type="number" min="0" defaultValue="0" required />
        <input className="w-full rounded border p-2" name="looseEggs" type="number" min="0" defaultValue="0" required />
        <input className="w-full rounded border p-2" name="note" placeholder="Note (optional)" />
        <button className="rounded bg-black px-4 py-2 text-white" type="submit">
          Save collection
        </button>
      </form>

      <form action={recordSaleAction} className="space-y-2 rounded border bg-white p-4">
        <h3 className="font-medium">Record sale</h3>
        <input name="farmId" type="hidden" value={farm.id} readOnly />
        <input className="w-full rounded border p-2" name="date" type="date" defaultValue={toDateInputValue()} required />
        <select className="w-full rounded border p-2" name="customerType" defaultValue="retailer">
          <option value="retailer">Retailer</option>
          <option value="wholesaler">Wholesaler</option>
        </select>
        <input className="w-full rounded border p-2" name="crates" type="number" min="0" defaultValue="0" required />
        <input className="w-full rounded border p-2" name="looseEggs" type="number" min="0" defaultValue="0" required />
        <input className="w-full rounded border p-2" name="totalPrice" type="number" min="0.01" step="0.01" required />
        <input className="w-full rounded border p-2" name="note" placeholder="Note (optional)" />
        <button className="rounded bg-black px-4 py-2 text-white" type="submit">
          Save sale
        </button>
      </form>

      <form action={recordLossAction} className="space-y-2 rounded border bg-white p-4">
        <h3 className="font-medium">Record loss</h3>
        <input name="farmId" type="hidden" value={farm.id} readOnly />
        <input className="w-full rounded border p-2" name="date" type="date" defaultValue={toDateInputValue()} required />
        <input className="w-full rounded border p-2" name="crates" type="number" min="0" defaultValue="0" required />
        <input className="w-full rounded border p-2" name="looseEggs" type="number" min="0" defaultValue="0" required />
        <input className="w-full rounded border p-2" name="reason" placeholder="Reason" required />
        <button className="rounded bg-black px-4 py-2 text-white" type="submit">
          Save loss
        </button>
      </form>
    </section>
  );
}

async function loadEggsState() {
  try {
    const farm = await getPrimaryFarm();

    if (!farm) {
      return { status: "missing_farm" as const };
    }

    const [inventory, flocks] = await Promise.all([getInventory(farm.id), listFlocks(farm.id)]);

    return { status: "ready" as const, farm, inventory, flocks };
  } catch {
    return { status: "config_error" as const };
  }
}
