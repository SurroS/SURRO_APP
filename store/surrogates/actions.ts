import { StateCreator } from "zustand";
import { Surrogate, SurrogateStore } from "./types";
import image1 from "@/assets/images/image1.jpg";
import image2 from "@/assets/images/image2.jpg";
import image3 from "@/assets/images/image3.jpg";

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

      // Simulate API call //change this to main aPI calls
      const response = await new Promise<Surrogate[]>((resolve) =>
        setTimeout(
          () =>
            resolve([
              {
                id: "1",
                name: "Jane Doe",
                avatar: image1,
                age: "20",
                country: "nigeria",
              },
              {
                id: "2",
                name: "Mary Ann",
                avatar: image2,
                age: "20",
                country: "nigeria",
              },
              {
                id: "3",
                name: "Tina Joe",
                avatar: image3,
                age: "20",
                country: "nigeria",
              },
              {
                id: "4",
                name: "Jane Doe",
                avatar: image1,
                age: "20",
                country: "nigeria",
              },
              {
                id: "5",
                name: "Mary Ann",
                avatar: image2,
                age: "20",
                country: "nigeria",
              },
              {
                id: "6",
                name: "Tina Joe",
                avatar: image3,
                age: "20",
                country: "nigeria",
              },
              {
                id: "7",
                name: "Jane Doe",
                avatar: "https://i.pravatar.cc/150?img=2",
                age: "20",
                country: "nigeria",
              },
              {
                id: "8",
                name: "Mary Ann",
                avatar: "https://i.pravatar.cc/150?img=1",
                age: "20",
                country: "nigeria",
              },
              {
                id: "9",
                name: "Tina Joe",
                avatar: "https://i.pravatar.cc/150?img=3",
                age: "20",
                country: "nigeria",
              },
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
