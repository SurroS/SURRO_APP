import { StateCreator } from "zustand";
import { Surrogate, SurrogateStore } from "./types";
import { getSurrogatesList, fetchParentMatch } from "@/services/profileApi";
import { resolveProfilePicture } from "@/utils/resolveMediaUrl";

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

const apiImage = (apiItem: any) => {
  const raw = apiItem.profilePicture ?? apiItem.profilePictureUrl ?? apiItem.avatar ?? "";
  return resolveProfilePicture(raw) ?? "";
};

const mapApiSurrogate = (apiItem: any): Surrogate => ({
  id: apiItem.id || apiItem.userId || "",
  userName:
    apiItem.userName ?? apiItem.username ?? apiItem.user?.userName ?? apiItem.email?.split("@")[0] ?? "",
  name: getDisplayName(
    apiItem.firstName,
    apiItem.lastName,
    apiItem.userName ?? apiItem.username ?? apiItem.user?.userName ?? apiItem.email?.split("@")[0],
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
  savedIds: new Set<string>(),

  setSurrogates: (data) => set({ surrogates: data }),

  setLoading: (val) => set({ isLoading: val }),

  setError: (err) => set({ error: err }),

  clearSurrogates: () => set({ surrogates: [], error: null }),

  fetchSavedIds: async () => {
    // noop placeholder - actual saved list comes from parent profile hooks
    set({});
  },

  setSavedIds: (ids: string[] | Set<string>) => {
    const next = ids instanceof Set ? ids : new Set(ids);
    set({ savedIds: next });
  },

  addSavedId: (id: string) => {
    set((s: any) => ({ savedIds: new Set([...(s.savedIds || []), id]) }));
  },

  removeSavedId: (id: string) => {
    set((s: any) => {
      const next = new Set(s.savedIds || []);
      next.delete(id);
      return { savedIds: next };
    });
  },

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
      const surrogates: Surrogate[] = rawList.map(mapApiSurrogate);
      set({ surrogates, isLoading: false, error: null });
    } catch (err: any) {
      console.error("[Surrogates] Fetch matches error:", err?.response?.data || err?.message || err);
      set({ isLoading: false, error: err?.message ?? "Failed to load matches" });
      throw err;
    }
  },

  async fetchSurrogates() {
    try {
      set({ isLoading: true });

      const res = await getSurrogatesList();

      console.log("[Surrogates] API raw response:", JSON.stringify(res).slice(0, 500));

      let rawList: any[] = [];

      if (Array.isArray(res)) {
        rawList = res;
        console.log("[Surrogates] Response is a direct array, length:", res.length);
      } else if (res?.data && Array.isArray(res.data)) {
        rawList = res.data;
        console.log("[Surrogates] Response wrapped in .data, length:", res.data.length);
      } else if (res?.matches && Array.isArray(res.matches)) {
        rawList = res.matches;
        console.log("[Surrogates] Response wrapped in .matches, length:", res.matches.length);
      } else if (res?.users && Array.isArray(res.users)) {
        rawList = res.users;
        console.log("[Surrogates] Response wrapped in .users, length:", res.users.length);
      } else if (res?.results && Array.isArray(res.results)) {
        rawList = res.results;
        console.log("[Surrogates] Response wrapped in .results, length:", res.results.length);
      } else {
        console.warn("[Surrogates] Unknown response shape, first keys:", Object.keys(res || {}).join(", "));
      }

      const surrogates: Surrogate[] = rawList.map(mapApiSurrogate);

      set({
        surrogates,
        isLoading: false,
        error: null,
      });
    } catch (err: any) {
      console.error("[Surrogates] Fetch error:", err?.response?.data || err?.message || err);

      set({
        isLoading: false,
        error: err?.message ?? "Failed to load surrogates",
      });

      throw err;
    }
  },
});
