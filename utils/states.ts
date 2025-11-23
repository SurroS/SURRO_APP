// utils/locations.ts

export const getStatesByCountry = async (country: string) => {
  try {
    const res = await fetch(
      "https://countriesnow.space/api/v0.1/countries/states",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          country: country,
        }),
      }
    );

    const data = await res.json();

    if (!data.data || !data.data.states) return [];

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
        body: JSON.stringify({
          country: country,
          state: state,
        }),
      }
    );

    const data = await res.json();

    if (!data.data) return [];

    return data.data.sort();
  } catch (err) {
    console.error("Error fetching LGAs", err);
    return [];
  }
};
