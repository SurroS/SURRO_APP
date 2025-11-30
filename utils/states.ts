// utils/locations.ts

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
