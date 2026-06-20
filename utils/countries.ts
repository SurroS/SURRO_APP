import countriesData from "./countries.json";

let cachedCountries: {
  name: string;
  flag: string;
  iso2: string;
  dialCode: string;
}[] | null = null;

export const getCachedCountries = () => cachedCountries;

const flagUrl = (iso2: string) =>
  `https://flags.restcountries.com/v5/w320/${iso2.toLowerCase()}.png`;

export const getAllCountries = async () => {
  if (cachedCountries) return cachedCountries;
  cachedCountries = countriesData.map((c) => ({
    ...c,
    flag: flagUrl(c.iso2),
  }));
  return cachedCountries;
};
