import nigeriaData from "@/data/nigeria.json";

// ─── Local Nigeria data (instant, no network) ───────────
let nigeriaStates: string[] | null = null;
const nigeriaLgasMap: Record<string, string[]> = {};

function ensureNigeriaLoaded() {
  if (nigeriaStates) return;
  nigeriaStates = nigeriaData.states.map((s) => s.name).sort();
  for (const s of nigeriaData.states) {
    nigeriaLgasMap[`Nigeria::${s.name}`] = s.lgas.sort();
    nigeriaLgasMap[s.name] = s.lgas.sort();
  }
}

export function getLocalStates(country: string): string[] | null {
  if (country === "Nigeria") {
    ensureNigeriaLoaded();
    return nigeriaStates!;
  }
  return null;
}

export function getLocalLgas(country: string, state: string): string[] | null {
  if (country === "Nigeria") {
    ensureNigeriaLoaded();
    return nigeriaLgasMap[`${country}::${state}`] || null;
  }
  return null;
}

export function getAllLocalLgas(country: string): Record<string, string[]> | null {
  if (country === "Nigeria") {
    ensureNigeriaLoaded();
    return nigeriaLgasMap as Record<string, string[]>;
  }
  return null;
}

export function getLocalNigeriaStates(): string[] {
  ensureNigeriaLoaded();
  return nigeriaStates!;
}

export function getLocalNigeriaLgas(state: string): string[] {
  ensureNigeriaLoaded();
  return nigeriaLgasMap[state] || [];
}

// ─── Remote API helpers (fallback for non-Nigeria) ──────
const safeJson = async (res: Response) => {
  const contentType = res.headers.get("content-type") || "";
  const text = await res.text();
  if (!contentType.includes("application/json")) {
    console.error("Non-JSON response:", text.substring(0, 200));
    return null;
  }
  try {
    return JSON.parse(text);
  } catch (err) {
    console.error("Failed to parse JSON:", text.substring(0, 200));
    return null;
  }
};

export const getStatesByCountry = async (country: string) => {
  const local = getLocalStates(country);
  if (local) return local;
  try {
    const res = await fetch(
      "https://countriesnow.space/api/v0.1/countries/states",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country }),
      }
    );
    const data = await safeJson(res);
    if (!data || !data.data || !data.data.states) return [];
    return data.data.states.map((s: any) => s.name).sort();
  } catch (err) {
    console.error("Error fetching states", err);
    return [];
  }
};

export const getLgaByState = async (country: string, state: string) => {
  const local = getLocalLgas(country, state);
  if (local) return local;
  try {
    const res = await fetch(
      "https://countriesnow.space/api/v0.1/countries/state/cities",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country, state }),
      }
    );
    const data = await safeJson(res);
    if (!data || !data.data) return [];
    return data.data.sort();
  } catch (err) {
    console.error("Error fetching LGAs", err);
    return [];
  }
};

export async function prefetchLgas(
  country: string,
  states: string[]
): Promise<Record<string, string[]>> {
  // Nigeria LGAs are already local — just build the map synchronously
  const allLocal = getAllLocalLgas(country);
  if (allLocal) {
    const result: Record<string, string[]> = {};
    for (const s of states) {
      const key = `${country}::${s}`;
      result[key] = allLocal[key] || [];
    }
    return result;
  }
  // Non-Nigeria: parallel API calls
  const results = await Promise.allSettled(
    states.map((s) => getLgaByState(country, s))
  );
  const lgasCache: Record<string, string[]> = {};
  states.forEach((s, i) => {
    const r = results[i];
    lgasCache[`${country}::${s}`] = r.status === "fulfilled" ? r.value : [];
  });
  return lgasCache;
}
