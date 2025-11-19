// store/profile/agents/listSlice.ts
import { StateCreator } from "zustand";
import { AgentProfile } from "../profile/agent/types";
import { getAgentList } from "@/services/profileApi"; // API call

export interface AgentListStore {
  agents: AgentProfile[];
  isLoading: boolean;
  error: string | null;

  fetchAgents: (showToast?: boolean) => Promise<void>;
  setAgents: (data: AgentProfile[]) => void;
  setLoading: (val: boolean) => void;
  setError: (err: string | null) => void;
}

export const createAgentListSlice: StateCreator<
  AgentListStore,
  [],
  [],
  AgentListStore
> = (set) => ({
  agents: [],
  isLoading: false,
  error: null,

  fetchAgents: async (showToast = false) => {
    try {
      set({ isLoading: true });

      const res = await getAgentList(); // fetch array of agents
      set({ agents: res.data.user, isLoading: false, error: null });
    } catch (err: any) {
      set({
        isLoading: false,
        error: err.message || "Failed to fetch agents",
      });
      if (showToast) {
        // optionally show toast
      }
      throw err;
    }
  },

  setAgents: (data) => set({ agents: data }),
  setLoading: (val) => set({ isLoading: val }),
  setError: (err) => set({ error: err }),
});
