// utils/countries.ts
let cachedCountries: { name: string; flag?: string; iso2?: string; dialCode?: string }[] | null = null;

export const getCachedCountries = () => cachedCountries;

export const getAllCountries = async () => {
  if (cachedCountries) return cachedCountries;
  try {
    const res = await fetch(
      "https://restcountries.com/v3.1/all?fields=name,flags,cca2,idd"
    );
    const data = await res.json();

    if (!Array.isArray(data)) {
      console.error("Unexpected countries response:", data);
      return [];
    }

    cachedCountries = data
      .map((c: any) => ({
        name: c.name?.common || "Unknown",
        flag: c.flags?.png || c.flags?.svg,
        iso2: c.cca2,
        dialCode: c.idd?.root
          ? `${c.idd.root}${c.idd.suffixes ? c.idd.suffixes[0] : ""}`
          : "",
      }))
      // ✅ Sort alphabetically
      .sort((a, b) => a.name.localeCompare(b.name));

    return cachedCountries;
  } catch (err) {
    console.error("Error fetching countries", err);
    return [];
  }
};
