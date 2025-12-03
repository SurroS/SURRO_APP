import { StateCreator } from "zustand";
import { Surrogate, SurrogateStore } from "./types";
import { getUsersByRole } from "@/services/profileApi";

const fallbackSurrogates: Surrogate[] = [
  { id: "1", name: "Jane Doe", avatar: require("@/assets/images/image1.jpg"), age: "20", country: "Nigeria" },
  { id: "2", name: "Mary Ann", avatar: require("@/assets/images/image21.jpg"), age: "20", country: "Nigeria" },
  { id: "3", name: "Tina Joe", avatar: require("@/assets/images/image3.jpg"), age: "20", country: "Nigeria" },
];

export const createSurrogateSlice: StateCreator<
  SurrogateStore,
  [],
  [],
  SurrogateStore
> = (set) => ({
  surrogates: [],
  isLoading: false,
  error: null,

  async fetchSurrogates(showToast = false) {
    try {
      set({ isLoading: true });

      const response = await getUsersByRole("SURROGATE");
      
      // let surrogates: Surrogate[] = response?.data.users || [];
      let surrogates: Surrogate[] =  [];
      console.log("SURROGATE ACCOUNT IDs:", surrogates.map((u) => u.id));
      // Use fallback if API returns empty
      if (!Array.isArray(surrogates) || surrogates.length === 0) {
        surrogates = fallbackSurrogates;
        console.log("Surrogate call =",response)
      }

      set({ surrogates, isLoading: false, error: null });
    } catch (error: any) {
      // fallback if API call fails
      set({ surrogates: fallbackSurrogates, isLoading: false, error: error?.message || "Failed to fetch surrogates" });
      console.log("Surrogate call =",this.surrogates)
      throw error;
    } 
  },

  setSurrogates: (data) => set({ surrogates: data }),
  setLoading: (val) => set({ isLoading: val }),
  setError: (err) => set({ error: err }),
});
