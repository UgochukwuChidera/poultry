import { createFarmAction, createFlockAction, updateFarmAction } from "@/app/actions";
import { getPrimaryFarm, listFlocks } from "@/lib/services/poultry-service";
import { AppButton, EmptyState, FormCard, Notice, PageHeader, Pill, SelectField, TextField } from "@/components/ui";
import { toDateInputValue } from "@/lib/utils";

const flockStatuses = ["active", "resting", "sold", "closed"] as const;

export default async function FarmPage() {
  const state = await loadFarmState();

  if (state.status === "config_error") {
    return (
      <Notice tone="error">Set the Supabase URL and key environment variables, then run Supabase migrations, to manage farm data.</Notice>
    );
  }

  const { farm, flocks } = state;

  return (
    <section className="space-y-6">
      <PageHeader title="Farm & Flocks" description="Set up your farm once, then keep flock details up to date as they change." />

      {!farm ? (
        <FormCard title="Create farm" description="This becomes the workspace for all your daily records.">
          <form action={createFarmAction} className="space-y-3">
            <TextField label="Farm name" name="name" placeholder="e.g. Green Acres Poultry" required />
            <TextField label="Location" name="location" placeholder="Optional" />
            <AppButton type="submit">Save farm</AppButton>
          </form>
        </FormCard>
      ) : (
        <>
          <FormCard title="Farm details" description="Update your farm's name or location.">
            <form action={updateFarmAction} className="space-y-3">
              <input name="farmId" type="hidden" value={farm.id} readOnly />
              <TextField label="Farm name" name="name" defaultValue={farm.name} required />
              <TextField label="Location" name="location" defaultValue={farm.location ?? ""} placeholder="Optional" />
              <AppButton type="submit">Update farm</AppButton>
            </form>
          </FormCard>

          <FormCard title="Add flock" description="A flock is a group of birds managed together.">
            <form action={createFlockAction} className="space-y-3">
              <input name="farmId" type="hidden" value={farm.id} readOnly />
              <TextField label="Flock name" name="name" placeholder="e.g. Layer batch 3" required />
              <TextField label="Start date" name="startDate" type="date" defaultValue={toDateInputValue()} required />
              <SelectField label="Status" name="status" defaultValue="active">
                {flockStatuses.map((status) => (
                  <option key={status} value={status} className="capitalize">
                    {status}
                  </option>
                ))}
              </SelectField>
              <TextField label="Production stage" name="stage" placeholder="e.g. laying" required />
              <TextField label="Notes" name="notes" placeholder="Optional" />
              <AppButton type="submit">Add flock</AppButton>
            </form>
          </FormCard>

          <div className="space-y-3">
            <h3 className="text-base font-semibold text-stone-950">Flocks</h3>
            {flocks.length === 0 ? (
              <EmptyState title="No flocks yet" description="Add your first flock above to start recording collections." />
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {flocks.map((flock) => (
                  <article key={flock.id} className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-semibold text-stone-950">{flock.name}</p>
                      <Pill tone={flock.status === "active" ? "active" : flock.status === "resting" ? "warning" : "neutral"}>
                        {flock.status}
                      </Pill>
                    </div>
                    <p className="mt-1 text-sm text-stone-500">
                      Started {flock.startDate} · {flock.stage}
                    </p>
                  </article>
                ))}
              </div>
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
