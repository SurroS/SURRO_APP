// store/agents/actions.ts
import { StateCreator } from "zustand";
import { AgentProfile } from "../profile/agent/types";
import { getAllAgents, getAgentById } from "@/services/profileApi";

const fallbackAgent: AgentProfile[] = [
  {
    id: "1",
    userName: "Jane Doe",
    avatar: require("@/assets/images/agentImage.png"),
    age: "20",
    country: "Nigeria",
  },
  {
    id: "2",
    userName: "Mary Ann",
    avatar: require("@/assets/images/image3.jpg"),
    age: "20",
    country: "Nigeria",
  },
  {
    id: "3",
    userName: "Tina Joe",
    avatar: require("@/assets/images/agentImage.png"),
    age: "20",
    country: "Nigeria",
  },
];

export interface AgentListStore {
  agents: AgentProfile[];
  selectedAgent: AgentProfile | null;
  isLoading: boolean;
  error: string | null;

  fetchAgents: (showToast?: boolean) => Promise<void>;
  fetchAgentById: (agentId: string) => Promise<AgentProfile | null>;
  setAgents: (data: AgentProfile[]) => void;
  setSelectedAgent: (agent: AgentProfile | null) => void;
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
  selectedAgent: null,
  isLoading: false,
  error: null,

  fetchAgents: async (showToast = false) => {
    try {
      set({ isLoading: true });

      const res = await getAllAgents();
      const agents: AgentProfile[] = res.data?.data || res.data?.agents || [];

      if (Array.isArray(agents) && agents.length > 0) {
        set({
          agents: agents,
          isLoading: false,
          error: null,
        });
        return;
      }

      // Empty or invalid response → fallback
      set({
        agents: fallbackAgent,
        isLoading: false,
        error: null,
      });
    } catch (err: any) {
      set({
        agents: fallbackAgent,
        isLoading: false,
        error: err.message || "Failed to fetch agents",
      });

      if (showToast) {
        // Show toast if needed
      }
    }
  },

  fetchAgentById: async (agentId: string) => {
    try {
      set({ isLoading: true });

      const res = await getAgentById(agentId);
      const agent: AgentProfile = res.data?.data || res.data;

      set({
        selectedAgent: agent,
        isLoading: false,
        error: null,
      });

      return agent;
    } catch (err: any) {
      set({
        isLoading: false,
        error: err.message || "Failed to fetch agent",
      });
      return null;
    }
  },

  setAgents: (data) => set({ agents: data }),
  setSelectedAgent: (agent) => set({ selectedAgent: agent }),
  setLoading: (val) => set({ isLoading: val }),
  setError: (err) => set({ error: err }),
});
