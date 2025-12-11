// stores/agent/agent.actions.ts

import { StateCreator } from "zustand";
import { AgentProfileStore } from "./types";
import {
  getAgentProfile,
  createAgentProfile as createAgentProfileApi,
  updateAgentProfile as updateAgentProfileApi,
} from "@/services/profileApi";

export const createAgentProfileSlice: StateCreator<
  AgentProfileStore,
  [],
  [],
  AgentProfileStore
> = (set, get) => ({
  // STATE
  agentProfile: null,
  isLoading: false,
  error: null,

  // ACTIONS
  setAgentProfile: (profile) =>
    set({
      agentProfile: profile,
      isLoading: false,
      error: null,
    }),

  fetchAgentProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await getAgentProfile();
      set({ agentProfile: res.data.data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  createAgentProfile: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const res = await createAgentProfileApi(data);
      set({ agentProfile: res.data.data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  updateAgentProfile: async (changes) => {
    set({ isLoading: true, error: null });
    try {
      const currentProfile = get().agentProfile;
      let res;

      if (currentProfile) {
        // Profile exists, update it
        res = await updateAgentProfileApi(changes);
      } else {
        // No profile, create one
        res = await createAgentProfileApi(changes);
      }

      set({ agentProfile: res.data.data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  clearAgentProfile: () =>
    set({
      agentProfile: null,
      isLoading: false,
      error: null,
    }),
});
