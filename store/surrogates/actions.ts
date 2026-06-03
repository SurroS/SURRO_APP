import { StateCreator } from "zustand";
import { Surrogate, SurrogateStore } from "./types";
import { getAllSurrogates } from "@/services/profileApi";

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
});

// -----------------------------------------------------
// Fallback when API fails
// -----------------------------------------------------
export const fallbackSurrogates: any = [
  {
    id: "fb-1",
    userName: "Jane_Doe",
    name: "Jane Doe",
    avatar: require("@/assets/images/image1.jpg"),
    age: "26",
    country: "Nigeria",
    stateOfResidence: "Lagos",
    bio: "Caring and reliable surrogate mother with a passion for helping families.",
    experienceLevel: "Intermediate",
  },
  {
    id: "fb-2",
    userName: "Sarah_M",
    name: "Sarah Mensah",
    avatar: require("@/assets/images/image1.jpg"),
    age: "28",
    country: "Ghana",
    stateOfResidence: "Accra",
    bio: "Healthy lifestyle, non-smoker, excited to help you start your family journey.",
    experienceLevel: "New",
  },
  {
    id: "fb-3",
    userName: "Amina_K",
    name: "Amina Kabir",
    avatar: require("@/assets/images/image1.jpg"),
    age: "24",
    country: "Nigeria",
    stateOfResidence: "Abuja",
    bio: "Warm-hearted and dedicated. I believe in the gift of family.",
    experienceLevel: "Experienced",
  },
  {
    id: "fb-4",
    userName: "Grace_O",
    name: "Grace Okafor",
    avatar: require("@/assets/images/image1.jpg"),
    age: "30",
    country: "Nigeria",
    stateOfResidence: "Rivers",
    bio: "Mother of two, looking to help another family experience the joy of parenthood.",
    experienceLevel: "Advanced",
  },
  {
    id: "fb-5",
    userName: "Elena_W",
    name: "Elena Williams",
    avatar: require("@/assets/images/image1.jpg"),
    age: "27",
    country: "Kenya",
    stateOfResidence: "Nairobi",
    bio: "Committed to a safe and healthy surrogacy journey for both baby and parents.",
    experienceLevel: "Intermediate",
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

      const surrogates: Surrogate[] = rawList.map(mapApiSurrogate);

      if (surrogates.length > 0) {
        set({
          surrogates,
          isLoading: false,
          error: null,
        });
        return;
      }

      // Empty response → use fallback for testing
      set({
        surrogates: fallbackSurrogates,
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
