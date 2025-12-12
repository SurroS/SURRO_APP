import { StateCreator } from "zustand";
import { AgentProfileStore, AgentProfile } from "./types";
import { getAllAgents } from "@/services/profileApi";

export const createAgentProfileSlice: StateCreator<
  AgentProfileStore,
  [],
  [],
  AgentProfileStore
> = (set, get) => ({
  //------------------------------
  // STATE
  //------------------------------
  agentProfile: null,
  agents: [],
  isLoading: false,
  error: null,

  //------------------------------
  // ACTIONS
  //------------------------------
  setLoading: (val) => set({ isLoading: val }),

  setError: (err) => set({ error: err }),

  setAgentProfile: (profile) => set({ agentProfile: profile }),

  updateAgentProfile: async (changes: Partial<AgentProfile>) => {
    const current = get().agentProfile;
    if (!current) return;

    set({
      agentProfile: {
        ...current,
        ...changes,
      },
    });
  },

  clearAgentProfile: () => set({ agentProfile: null }),

  setAgents: (list) => set({ agents: list }),

  //------------------------------
  // API
  //------------------------------
  fetchAgents: async () => {
    set({ isLoading: true, error: null });

    try {
      const res = await getAllAgents()

      const data = await res.data;

      if (!res) {
        throw new Error(data?.message || "Failed to fetch agents");
      }

      set({ agents: data });
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ isLoading: false });
    }
  },
});
