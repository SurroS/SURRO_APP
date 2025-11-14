import { StateCreator } from "zustand";
import { Surrogate, SurrogateStore } from "./types";

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

      // Simulate API call
      const response = await new Promise<Surrogate[]>((resolve) =>
        setTimeout(
          () =>
            resolve([
              { id: "1", name: "Jane Doe", avatar: "https://i.pravatar.cc/150?img=1" },
              { id: "2", name: "Mary Ann", avatar: "https://i.pravatar.cc/150?img=2" },
              { id: "3", name: "Tina Joe", avatar: "https://i.pravatar.cc/150?img=3" },
            ]),
          1000
        )
      );

      set({ surrogates: response, isLoading: false, error: null });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error?.message || "Failed to fetch surrogates",
      });
      throw error;
    }
  },

  setSurrogates: (data) => set({ surrogates: data }),
  setLoading: (val) => set({ isLoading: val }),
  setError: (err) => set({ error: err }),
});
