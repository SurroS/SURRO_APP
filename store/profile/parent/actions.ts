import { StateCreator } from "zustand";
import { getParentProfile, createParentProfile, updateParentProfile } from "@/services/profileApi";
import { ParentProfileStore } from "./types";

export const createParentProfileSlice: StateCreator<ParentProfileStore> = (set, get) => ({
  parentProfile: null,
  isLoading: false,
  error: null,

  setParentProfile: (profile) => set({ parentProfile: profile }),

  fetchParentProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await getParentProfile();
      set({ parentProfile: res.data.data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  createParentProfile: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const res = await createParentProfile(data);
      set({ parentProfile: res.data.data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  updateParentProfile: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const res = await updateParentProfile(data);
      set({ parentProfile: res.data.data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  clearParentProfile: () => set({ parentProfile: null }),
});
