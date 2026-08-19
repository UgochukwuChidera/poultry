import { createFarmAction, createFlockAction, updateFarmAction } from "@/app/actions";
import { getPrimaryFarm, listFlocks } from "@/lib/services/poultry-service";
import { toDateInputValue } from "@/lib/utils";

const flockStatuses = ["active", "resting", "sold", "closed"];

export default async function FarmPage() {
  const state = await loadFarmState();

  if (state.status === "config_error") {
    return <p className="rounded bg-red-100 p-3 text-red-900">Set SUPABASE_DB_URL (or DATABASE_URL) and run Supabase migrations to manage farm data.</p>;
  }

  const { farm, flocks } = state;

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Farm & Flocks</h2>

      {!farm ? (
        <form action={createFarmAction} className="space-y-2 rounded border bg-white p-4">
          <h3 className="font-medium">Create farm</h3>
          <input className="w-full rounded border p-2" name="name" placeholder="Farm name" required />
          <input className="w-full rounded border p-2" name="location" placeholder="Location (optional)" />
          <button className="rounded bg-black px-4 py-2 text-white" type="submit">
            Save farm
          </button>
        </form>
      ) : (
        <>
          <form action={updateFarmAction} className="space-y-2 rounded border bg-white p-4">
            <h3 className="font-medium">Farm details</h3>
            <input name="farmId" type="hidden" value={farm.id} readOnly />
            <input className="w-full rounded border p-2" name="name" defaultValue={farm.name} required />
            <input
              className="w-full rounded border p-2"
              name="location"
              defaultValue={farm.location ?? ""}
              placeholder="Location"
            />
            <button className="rounded bg-black px-4 py-2 text-white" type="submit">
              Update farm
            </button>
          </form>

          <form action={createFlockAction} className="space-y-2 rounded border bg-white p-4">
            <h3 className="font-medium">Add flock</h3>
            <input name="farmId" type="hidden" value={farm.id} readOnly />
            <input className="w-full rounded border p-2" name="name" placeholder="Flock name" required />
            <input className="w-full rounded border p-2" name="startDate" type="date" defaultValue={toDateInputValue()} required />
            <select className="w-full rounded border p-2" name="status" defaultValue="active">
              {flockStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <input className="w-full rounded border p-2" name="stage" placeholder="Production stage" required />
            <input className="w-full rounded border p-2" name="notes" placeholder="Notes (optional)" />
            <button className="rounded bg-black px-4 py-2 text-white" type="submit">
              Add flock
            </button>
          </form>

          <div className="space-y-2">
            <h3 className="font-medium">Flocks</h3>
            {flocks.length === 0 ? (
              <p className="rounded border bg-white p-3 text-sm text-gray-600">No flocks yet.</p>
            ) : (
              flocks.map((flock) => (
                <article key={flock.id} className="rounded border bg-white p-3">
                  <p className="font-semibold">{flock.name}</p>
                  <p className="text-sm text-gray-600">
                    Start: {flock.startDate} · Status: {flock.status} · Stage: {flock.stage}
                  </p>
                </article>
              ))
            )}
          </div>
        </>
      )}
    </section>
  );
}

async function loadFarmState() {
  try {
    const farm = await getPrimaryFarm();
    const flocks = farm ? await listFlocks(farm.id) : [];

    return { status: "ready" as const, farm, flocks };
  } catch {
    return { status: "config_error" as const };
  }
}
