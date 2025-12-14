import { StateCreator } from "zustand";
import {
  Surrogate,
  SurrogateStore,
} from "./types";
import {
  getAllSurrogates,
} from "@/services/profileApi";

// -----------------------------------------------------
// Helpers
// -----------------------------------------------------
const getAge = (dob?: string | null) => {
  if (!dob) return "N/A";
  const date = new Date(dob);
  return Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24 * 365)).toString();
};

const getDisplayName = (
  firstName?: string | null,
  lastName?: string | null,
  userName?: string | null
) =>
  `${firstName ?? ""} ${lastName ?? ""}`.trim() ||
  userName ||
  "Unknown";

const mapApiSurrogate = (apiItem: any): Surrogate => ({
  id: apiItem.id,
 wallet:apiItem.wallet,
  userName:
    apiItem.userName ??
    apiItem.username ??
    apiItem.user?.userName ??
    null,

  name: getDisplayName(
    apiItem.firstName,
    apiItem.lastName,
    apiItem.userName ?? apiItem.user?.userName
  ),

  avatar:
    apiItem.profilePicture ??
    apiItem.profilePictureUrl ??
    apiItem.user?.profilePictureUrl ??
    undefined,

  age: getAge(apiItem.dateOfBirth ?? apiItem.dob),

  country:
    apiItem.countryOfResidence ??
    apiItem.countryOfOrigin ??
    apiItem.country ??
    "Unknown",

  height: apiItem.height,
  weight: apiItem.weight,
  children: apiItem.numberOfChildren,
});


// -----------------------------------------------------
// Fallback when API fails
// -----------------------------------------------------
export const fallbackSurrogates: any = [
  {
    id: "1",
    name: "Jane Doe",
    avatar: require("@/assets/images/image1.jpg"),
    age: "20",
    country: "Nigeria",

  },
];

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

  async fetchSurrogates() {
    try {
      set({ isLoading: true });

      const res = await getAllSurrogates();

      let surrogates: Surrogate[] = [];

      if (Array.isArray(res.data) && res.data.length > 0) {
        surrogates = res.data.map(mapApiSurrogate);
      }

      if (surrogates.length === 0) {
        console.warn("Surrogates API empty → using fallback");
        surrogates = fallbackSurrogates;
      }

      set({
        surrogates,
        isLoading: false,
        error: null,
      });
    } catch (err: any) {
      console.error("Surrogate fetch error:", err);

      set({
        surrogates: fallbackSurrogates,
        isLoading: false,
        error: err?.message ?? "Failed to load surrogates",
      });

      throw err;
    }
  },
});
