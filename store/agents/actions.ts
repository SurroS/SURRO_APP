// store/profile/agents/listSlice.ts
import { StateCreator } from "zustand";
import { AgentProfile } from "@/store/profile/agent/types";
import { getAllAgents, getUsersByRole } from "@/services/profileApi";

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

      const res = await getAllAgents();

      let Agents: AgentProfile[] = res?.data || [];

      console.log(
        "single agent array",
        Agents.map((agent, index) => agent.id),
      );

      if (Array.isArray(Agents) && Agents.length > 0) {
        set({
          agents: Agents,
          isLoading: false,
          error: null,
        });
        console.log("Agents loaded from API:", Agents);
        return;
      }

      set({
        agents: [],
        isLoading: false,
        error: null,
      });
    } catch (err: any) {
      console.error("Error fetching agents:", err);

      set({
        agents: [],
        isLoading: false,
        error: err.message || "Failed to fetch agents",
      });

      if (showToast) {
        // Show toast if needed
      }
    }
  },

  setAgents: (data) => set({ agents: data }),
  setLoading: (val) => set({ isLoading: val }),
  setError: (err) => set({ error: err }),
});
