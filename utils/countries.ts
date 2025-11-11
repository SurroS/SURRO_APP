// utils/countries.ts
export const getAllCountries = async () => {
  try {
    const res = await fetch(
      "https://restcountries.com/v3.1/all?fields=name,flags,cca2,idd"
    );
    const data = await res.json();

    if (!Array.isArray(data)) {
      console.error("Unexpected countries response:", data);
      return [];
    }

    const countries = data
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

    return countries;
  } catch (err) {
    console.error("Error fetching countries", err);
    return [];
  }
};
