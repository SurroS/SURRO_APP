import { StateCreator } from "zustand";
import {
  getParentProfile,
  createParentProfile as createParentProfileApi,
  updateParentProfile as updateParentProfileApi,
  saveParentSurrogate as saveParentSurrogateApi,
  removeSavedSurrogate as removeSavedSurrogateApi,
  getSavedSurrogates as getSavedSurrogatesApi,
  updateParentMatchPreference as updateParentMatchPreferenceApi,
  getParentMatches as getParentMatchesApi
} from "@/services/profileApi";
import { ParentProfileStore } from "./types";

export const createParentProfileSlice: StateCreator<ParentProfileStore> = (set, get) => ({
  parentProfile: null,
  savedSurrogates: [],
  matches: [],
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
      const currentProfile = get().parentProfile;
      let res;

      if (currentProfile) {
        // Profile exists, update it
        res = await updateParentProfileApi(data);
      } else {
        // No profile, create one
        res = await createParentProfileApi(data);
      }

      set({ parentProfile: res.data.data, isLoading: false });
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

  fetchParentMatches: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await getParentMatchesApi();
      set({ matches: res.data.data, isLoading: false });
      return res.data.data;
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err;
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

  removeSavedSurrogate: async (surrogateId) => {
    set({ isLoading: true, error: null });
    try {
      await removeSavedSurrogateApi(surrogateId);
      // Remove from local state
      const currentSaved = get().savedSurrogates;
      set({
        savedSurrogates: currentSaved.filter((s: any) => s.id !== surrogateId),
        isLoading: false
      });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  fetchSavedSurrogates: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await getSavedSurrogatesApi();
      set({ savedSurrogates: res.data.data, isLoading: false });
      return res.data.data;
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  clearParentProfile: () => set({ parentProfile: null, savedSurrogates: [], matches: [] }),
});
