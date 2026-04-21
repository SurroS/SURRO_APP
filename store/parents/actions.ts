// store/profile/parents/listSlice.ts
import { StateCreator } from "zustand";
import { ParentProfile } from "@/store/profile/parent/types";

export interface ParentListStore {
  parents: ParentProfile[];
  isLoading: boolean;
  error: string | null;

  fetchParents: (showToast?: boolean) => Promise<void>;
  setParents: (data: ParentProfile[]) => void;
  setLoading: (val: boolean) => void;
  setError: (err: string | null) => void;
}

export const createParentListSlice: StateCreator<
  ParentListStore,
  [],
  [],
  ParentListStore
> = (set) => ({
  parents: [],
  isLoading: false,
  error: null,

  fetchParents: async (showToast = false) => {
    try {
      set({ isLoading: true });

      //   const res = await getParentList(); // fetch array of parents
      //   set({ parents: res.data.user, isLoading: false, error: null });
    } catch (err: any) {
      set({
        isLoading: false,
        error: err.message || "Failed to fetch parents",
      });
      if (showToast) {
        // optionally show toast
      }
      throw err;
    }
  },
  fetchParentsbyId: async (id: string) => {
    // TODO: Implement when parent list API is available
    try {
      set({ isLoading: true });
      // const res = await getParentList();
      // set({ parents: res.data.user, isLoading: false, error: null });
      set({ isLoading: false });
    } catch (err: any) {
      set({
        isLoading: false,
        error: err.message || "Failed to fetch parents",
      });
      throw err;
    }
  },

  setParents: (data) => set({ parents: data }),
  setLoading: (val) => set({ isLoading: val }),
  setError: (err) => set({ error: err }),
});
