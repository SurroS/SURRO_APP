import { StateCreator } from "zustand";
import { Agent, AgentStore } from "./Types";
import image1 from "@/assets/images/image1.jpg";
import image2 from "@/assets/images/image2.jpg";
import image3 from "@/assets/images/image3.jpg";

export const createAgentSlice: StateCreator<
  AgentStore,
  [],
  [],
  AgentStore
> = (set) => ({
  agents: [],
  isLoading: false,
  error: null,

  async fetchAgent(showToast = false) { //replace this with the real logic 
    try {
      set({ isLoading: true });

      const response = await new Promise<Agent[]>((resolve) =>
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

      set({ agents: response, isLoading: false, error: null });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error?.message || "Failed to fetch agents",
      });
      throw error;
    }
  },

  // matches your interface exactly
  setAgent: (data) => set({ agents: data }),
  setLoading: (val) => set({ isLoading: val }),
  setError: (err) => set({ error: err }),
});
 