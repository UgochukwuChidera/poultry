import { recordCollectionAction, recordLossAction, recordSaleAction } from "@/app/actions";
import { getInventory, getPrimaryFarm, listFlocks } from "@/lib/services/poultry-service";
import { AppButton, FormCard, MetricCard, Notice, PageHeader, SelectField, TextField } from "@/components/ui";
import { toDateInputValue } from "@/lib/utils";

export default async function EggsPage() {
  const state = await loadEggsState();

  if (state.status === "config_error") {
    return (
      <Notice tone="error">
        Set the Supabase URL and key environment variables, then run Supabase migrations, to manage egg records.
      </Notice>
    );
  }

  if (state.status === "missing_farm") {
    return <Notice tone="warning">Create your farm first on the Farm page before recording eggs.</Notice>;
  }

  const { farm, inventory, flocks } = state;

  return (
    <section className="space-y-6">
      <PageHeader title="Eggs" description="Log collections, sales, and losses. Current stock updates automatically from these records." />

      <MetricCard label="Current inventory" value={`${inventory.crates} crates`} helper={`${inventory.looseEggs} loose eggs`} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <FormCard title="Record collection" description="Add today's eggs to stock.">
          <form action={recordCollectionAction} className="space-y-3">
            <input name="farmId" type="hidden" value={farm.id} readOnly />
            <TextField label="Date" name="date" type="date" defaultValue={toDateInputValue()} required />
            {flocks.length === 0 ? (
              <Notice tone="warning">Add a flock on the Farm page before recording a collection.</Notice>
            ) : (
              <SelectField label="Flock" name="flockId" required defaultValue="">
                <option value="" disabled>
                  Select flock
                </option>
                {flocks.map((flock) => (
                  <option key={flock.id} value={flock.id}>
                    {flock.name}
                  </option>
                ))}
              </SelectField>
            )}
            <div className="grid grid-cols-2 gap-3">
              <TextField label="Crates" name="crates" type="number" min="0" defaultValue="0" required />
              <TextField label="Loose eggs" name="looseEggs" type="number" min="0" defaultValue="0" required />
            </div>
            <TextField label="Note" name="note" placeholder="Optional" hint="Anything worth remembering about today's collection." />
            <AppButton type="submit" disabled={flocks.length === 0}>
              Save collection
            </AppButton>
          </form>
        </FormCard>

        <FormCard title="Record sale" description="Reduces stock and adds to today's revenue.">
          <form action={recordSaleAction} className="space-y-3">
            <input name="farmId" type="hidden" value={farm.id} readOnly />
            <TextField label="Date" name="date" type="date" defaultValue={toDateInputValue()} required />
            <SelectField label="Customer type" name="customerType" defaultValue="retailer">
              <option value="retailer">Retailer</option>
              <option value="wholesaler">Wholesaler</option>
            </SelectField>
            <div className="grid grid-cols-2 gap-3">
              <TextField label="Crates" name="crates" type="number" min="0" defaultValue="0" required />
              <TextField label="Loose eggs" name="looseEggs" type="number" min="0" defaultValue="0" required />
            </div>
            <TextField label="Total price" name="totalPrice" type="number" min="0.01" step="0.01" required hint="Amount received, in naira." />
            <TextField label="Note" name="note" placeholder="Optional" />
            <AppButton type="submit">Save sale</AppButton>
          </form>
        </FormCard>

        <FormCard title="Record loss" description="Breakages, spoilage, or other stock losses.">
          <form action={recordLossAction} className="space-y-3">
            <input name="farmId" type="hidden" value={farm.id} readOnly />
            <TextField label="Date" name="date" type="date" defaultValue={toDateInputValue()} required />
            <div className="grid grid-cols-2 gap-3">
              <TextField label="Crates" name="crates" type="number" min="0" defaultValue="0" required />
              <TextField label="Loose eggs" name="looseEggs" type="number" min="0" defaultValue="0" required />
            </div>
            <TextField label="Reason" name="reason" placeholder="e.g. broken in transit" required />
            <AppButton type="submit">Save loss</AppButton>
          </form>
        </FormCard>
      </div>
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
