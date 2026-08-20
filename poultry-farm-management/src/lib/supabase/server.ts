type QueryValue = string | number | boolean;

const jsonHeaders = { "Content-Type": "application/json" } as const;

export function hasSupabaseApiConfig() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY));
}

function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY) are required");
  }

  return { key, url: url.replace(/\/$/, "") };
}

export async function supabaseRest<T>(table: string, options: { method?: "GET" | "POST" | "PATCH"; query?: Record<string, QueryValue>; body?: unknown } = {}) {
  const { key, url } = getSupabaseConfig();
  const params = new URLSearchParams();

  for (const [name, value] of Object.entries(options.query ?? {})) {
    params.set(name, String(value));
  }

  const endpoint = `${url}/rest/v1/${table}${params.size > 0 ? `?${params.toString()}` : ""}`;
  const response = await fetch(endpoint, {
    method: options.method ?? "GET",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      Prefer: "return=representation",
      ...jsonHeaders,
    },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    cache: "no-store",
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Supabase request failed (${response.status}): ${message}`);
  }

  if (response.status === 204) {
    return null as T;
  }

  return (await response.json()) as T;
}
