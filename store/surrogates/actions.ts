import { StateCreator } from "zustand";
import { Surrogate, SurrogateStore } from "./types";
import { getAllSurrogates, fetchParentMatch } from "@/services/profileApi";

const fallbackSurrogates: Surrogate[] = [
  { id: "surr-mock-1", name: "Jane Doe", userName: "janedoe", image: "https://ui-avatars.com/api/?name=Jane+Doe&background=0E0E55&color=fff&size=200", avatar: "https://ui-avatars.com/api/?name=Jane+Doe&background=0E0E55&color=fff&size=200", age: "28", country: "Nigeria", stateOfResidence: "Lagos", lga: "Ikeja", firstName: "Jane", lastName: "Doe", contactPhone: "+2348011111111", contactEmail: "jane@example.com", bio: "Experienced surrogate with a passion for helping families.", experienceLevel: "Experienced", genotype: "AA", bloodGroup: "O+" },
  { id: "surr-mock-2", name: "Mary Ann", userName: "maryann", image: "https://ui-avatars.com/api/?name=Mary+Ann&background=0E0E55&color=fff&size=200", avatar: "https://ui-avatars.com/api/?name=Mary+Ann&background=0E0E55&color=fff&size=200", age: "32", country: "Nigeria", stateOfResidence: "Abuja", lga: "Gwarinpa", firstName: "Mary", lastName: "Ann", contactPhone: "+2348022222222", contactEmail: "mary@example.com", bio: "Kind-hearted and healthy surrogate ready to start a new journey.", experienceLevel: "Experienced", genotype: "AS", bloodGroup: "A+" },
  { id: "surr-mock-3", name: "Sarah Williams", userName: "sarahw", image: "https://ui-avatars.com/api/?name=Sarah+Williams&background=0E0E55&color=fff&size=200", avatar: "https://ui-avatars.com/api/?name=Sarah+Williams&background=0E0E55&color=fff&size=200", age: "26", country: "Nigeria", stateOfResidence: "Rivers", lga: "Port Harcourt", firstName: "Sarah", lastName: "Williams", contactPhone: "+2348033333333", contactEmail: "sarah@example.com", bio: "First-time surrogate excited to make a difference.", experienceLevel: "Rookie", genotype: "AA", bloodGroup: "B+" },
  { id: "surr-mock-4", name: "Grace Okonkwo", userName: "graceo", image: "https://ui-avatars.com/api/?name=Grace+Okonkwo&background=0E0E55&color=fff&size=200", avatar: "https://ui-avatars.com/api/?name=Grace+Okonkwo&background=0E0E55&color=fff&size=200", age: "30", country: "Nigeria", stateOfResidence: "Lagos", lga: "Lagos Island", firstName: "Grace", lastName: "Okonkwo", contactPhone: "+2348044444444", contactEmail: "grace@example.com", bio: "Healthy and motivated surrogate with a successful previous journey.", experienceLevel: "Experienced", genotype: "AA", bloodGroup: "AB+" },
  { id: "surr-mock-5", name: "Fatima Ibrahim", userName: "fatimai", image: "https://ui-avatars.com/api/?name=Fatima+Ibrahim&background=0E0E55&color=fff&size=200", avatar: "https://ui-avatars.com/api/?name=Fatima+Ibrahim&background=0E0E55&color=fff&size=200", age: "27", country: "Nigeria", stateOfResidence: "Kaduna", lga: "Kaduna South", firstName: "Fatima", lastName: "Ibrahim", contactPhone: "+2348055555555", contactEmail: "fatima@example.com", bio: "Caring surrogate dedicated to bringing joy to intended parents.", experienceLevel: "Rookie", genotype: "AS", bloodGroup: "O-" },
];

// -----------------------------------------------------
// Helpers
// -----------------------------------------------------
const getAge = (dob?: string | null) => {
  if (!dob) return "N/A";
  const date = new Date(dob);
  return Math.floor(
    (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24 * 365),
  ).toString();
};

const getDisplayName = (
  firstName?: string | null,
  lastName?: string | null,
  userName?: string | null,
) => `${firstName ?? ""} ${lastName ?? ""}`.trim() || userName || "Unknown";

const apiImage = (apiItem: any) =>
  apiItem.profilePicture ?? apiItem.profilePictureUrl ?? apiItem.avatar ?? "";

const mapApiSurrogate = (apiItem: any): Surrogate => ({
  id: apiItem.id || "",
  userName:
    apiItem.userName ?? apiItem.username ?? apiItem.user?.userName ?? "",
  name: getDisplayName(
    apiItem.firstName,
    apiItem.lastName,
    apiItem.userName ?? apiItem.username ?? apiItem.user?.userName,
  ),
  firstName: apiItem.firstName ?? "",
  lastName: apiItem.lastName ?? "",
  age: apiItem.age
    ? apiItem.age.toString()
    : getAge(apiItem.dateOfBirth ?? apiItem.dob),
  country: apiItem.countryOfResidence ?? apiItem.country ?? "",
  stateOfResidence:
    apiItem.stateOfResidence ?? apiItem.state ?? apiItem.address?.state ?? "",
  lga: apiItem.lga ?? apiItem.address?.lga ?? "",
  image: apiImage(apiItem),
  avatar: apiImage(apiItem),
  contactPhone:
    apiItem.contactPhone ??
    apiItem.phone1 ??
    apiItem.phone ??
    apiItem.phoneNumber ??
    "",
  contactEmail:
    apiItem.contactEmail ?? apiItem.email ?? apiItem.user?.email ?? "",
  bio: apiItem.bio ?? apiItem.aboutMe ?? "",
  experienceLevel: apiItem.experienceLevel ?? "New",
  genotype: apiItem.medical?.genotype ?? apiItem.genotype ?? undefined,
  bloodGroup: apiItem.medical?.bloodGroup ?? apiItem.bloodGroup ?? undefined,
});

// -----------------------------------------------------
// Slice
// -----------------------------------------------------
export const createSurrogateSlice: StateCreator<
  SurrogateStore,
  [],
  [],
  SurrogateStore
> = (set) => ({
  surrogates: [],
  isLoading: false,
  error: null,

  setSurrogates: (data) => set({ surrogates: data }),

  setLoading: (val) => set({ isLoading: val }),

  setError: (err) => set({ error: err }),

  async fetchMatches() {
    try {
      set({ isLoading: true });
      const res = await fetchParentMatch({});
      let rawList: any[] = [];
      if (Array.isArray(res)) {
        rawList = res;
      } else if (res?.data && Array.isArray(res.data)) {
        rawList = res.data;
      } else if (res?.matches && Array.isArray(res.matches)) {
        rawList = res.matches;
      }
      const surrogates: Surrogate[] = rawList.length > 0 ? rawList.map(mapApiSurrogate) : fallbackSurrogates;
      set({ surrogates, isLoading: false, error: null });
    } catch (err: any) {
      console.error("[Surrogates] Fetch matches error:", err?.response?.data || err?.message || err);
      set({ surrogates: fallbackSurrogates, isLoading: false, error: null });
    }
  },

  async fetchSurrogates() {
    try {
      set({ isLoading: true });

      const res = await getAllSurrogates();

      console.log("[Surrogates] API raw response:", JSON.stringify(res).slice(0, 500));

      let rawList: any[] = [];

      if (Array.isArray(res)) {
        rawList = res;
        console.log("[Surrogates] Response is a direct array, length:", res.length);
      } else if (res?.data && Array.isArray(res.data)) {
        rawList = res.data;
        console.log("[Surrogates] Response wrapped in .data, length:", res.data.length);
      } else if (res?.surrogates && Array.isArray(res.surrogates)) {
        rawList = res.surrogates;
        console.log("[Surrogates] Response wrapped in .surrogates, length:", res.surrogates.length);
      } else if (res?.users && Array.isArray(res.users)) {
        rawList = res.users;
        console.log("[Surrogates] Response wrapped in .users, length:", res.users.length);
      } else if (res?.results && Array.isArray(res.results)) {
        rawList = res.results;
        console.log("[Surrogates] Response wrapped in .results, length:", res.results.length);
      } else {
        console.warn("[Surrogates] Unknown response shape, first keys:", Object.keys(res || {}).join(", "));
      }

      const surrogates: Surrogate[] = rawList.length > 0 ? rawList.map(mapApiSurrogate) : fallbackSurrogates;

      set({
        surrogates,
        isLoading: false,
        error: null,
      });
    } catch (err: any) {
      console.error("[Surrogates] Fetch error:", err?.response?.data || err?.message || err);

      set({
        surrogates: fallbackSurrogates,
        isLoading: false,
        error: null,
      });
    }
  },
});
