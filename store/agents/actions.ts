// store/profile/agents/listSlice.ts
import { StateCreator } from "zustand";
import { AgentProfile } from "@/store/profile/agent/types";
import { getAllAgents, getUsersByRole } from "@/services/profileApi";

const fallbackAgent: AgentProfile[] = [
  {
    id: "1",
    userName: "Jane Doe",
    avatar: require("@/assets/images/agentImage.png"),
    dateOfBirth: "2004-01-01",
    countryOfResidence: "Nigeria",
    stateOfResidence: "Lagos",
    lga: "Lagos Island",
    phone1: "+234123456789",
    phone2: null,
    emergencyContactPhone: null,
    wallet: {
      id: "w1",
      userId: "1",
      balance: 0,
      currency: "NGN",
    },
  },
  {
    id: "2",
    userName: "Mary Ann",
    avatar: require("@/assets/images/image3.jpg"),
    dateOfBirth: "2004-01-01",
    countryOfResidence: "Nigeria",
    stateOfResidence: "Lagos",
    lga: "Lagos Island",
    phone1: "+234123456789",
    phone2: null,
    emergencyContactPhone: null,
    wallet: {
      id: "w2",
      userId: "2",
      balance: 0,
      currency: "NGN",
    },
  },
  {
    id: "3",
    userName: "Tina Joe",
    avatar: require("@/assets/images/agentImage.png"),
    dateOfBirth: "2004-01-01",
    countryOfResidence: "Nigeria",
    stateOfResidence: "Lagos",
    lga: "Lagos Island",
    phone1: "+234123456789",
    phone2: null,
    emergencyContactPhone: null,
    wallet: {
      id: "w3",
      userId: "3",
      balance: 0,
      currency: "NGN",
    },
  },
];

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

      // Empty or invalid response → fallback
      set({
        agents: fallbackAgent,
        isLoading: false,
        error: null,
      });
      console.log("API returned no usable data → using fallback.");
    } catch (err: any) {
      console.error("Error fetching agents:", err);

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

  setAgents: (data) => set({ agents: data }),
  setLoading: (val) => set({ isLoading: val }),
  setError: (err) => set({ error: err }),
});
