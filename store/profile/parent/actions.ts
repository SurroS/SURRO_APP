import { StateCreator } from "zustand";
import {
  getParentProfile,
  createParentProfile as createParentProfileApi,
  updateParentSurrogateMatch as updateParentProfileApi,
  saveParentSurrogateMatch as saveParentSurrogateApi,
  updateParentMatchPreference as updateParentMatchPreferenceApi
} from "@/services/profileApi";
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
      const res = await createParentProfileApi(data);
      set({ parentProfile: res.data.data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  updateParentProfile: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const res = await updateParentProfileApi(data);
      set({ parentProfile: res.data.data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  saveParentSurrogate: async (surrogateData) => {
    set({ isLoading: true, error: null });
    try {
      const res = await saveParentSurrogateApi(surrogateData);
      set({ isLoading: false });
      return res.data;
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  updateParentMatchPreference: async (preferenceData) => {
    set({ isLoading: true, error: null });
    try {
      const res = await updateParentMatchPreferenceApi(preferenceData);
      set({ isLoading: false });
      return res.data;
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  clearParentProfile: () => set({ parentProfile: null }),
});
