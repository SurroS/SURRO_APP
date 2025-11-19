// stores/agent/agent.actions.ts

import { StateCreator } from "zustand";
import { AgentProfileStore } from "./types";

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

  updateAgentProfile: async (changes) => {
    const current = get().agentProfile;
    if (!current) return;

    try {
      set({ isLoading: true });

      const updated = { ...current, ...changes };

      // await api.updateProfile(updated);

      set({
        agentProfile: updated,
        isLoading: false,
        error: null,
      });
    } catch {
      set({
        isLoading: false,
        error: "Failed to update agent profile",
      });
    }
  },

  clearAgentProfile: () =>
    set({
      agentProfile: null,
      isLoading: false,
      error: null,
    }),
});
