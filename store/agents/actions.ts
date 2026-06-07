// store/profile/agents/listSlice.ts
import { StateCreator } from "zustand";
import { AgentProfile } from "@/store/profile/agent/types";
import { getAllAgents, getUsersByRole } from "@/services/profileApi";

const fallbackAgents: AgentProfile[] = [
  {
    id: "agent-mock-1",
    userName: "Jane Doe",
    aboutMe: "Experienced agent dedicated to helping families find the perfect surrogate match.",
    dateOfBirth: "1990-01-01",
    countryOfResidence: "Nigeria",
    stateOfResidence: "Lagos",
    lga: "Ikeja",
    phone1: "+2348011111111",
    phone2: null,
    emergencyContactPhone: null,
    profilePicture: "https://ui-avatars.com/api/?name=Jane+Doe&background=0E0E55&color=fff&size=200",
    wallet: { id: "w1", userId: "agent-mock-1", balance: 0, currency: "NGN" },
    performance: { successfulMatches: 15, averageRating: 4.5, responseTime: "2h", activeCases: 3 },
  },
  {
    id: "agent-mock-2",
    userName: "Mary Ann",
    aboutMe: "Compassionate agent with 5+ years of surrogacy coordination experience.",
    dateOfBirth: "1988-06-15",
    countryOfResidence: "Nigeria",
    stateOfResidence: "Abuja",
    lga: "Gwarinpa",
    phone1: "+2348022222222",
    phone2: null,
    emergencyContactPhone: null,
    profilePicture: "https://ui-avatars.com/api/?name=Mary+Ann&background=0E0E55&color=fff&size=200",
    wallet: { id: "w2", userId: "agent-mock-2", balance: 0, currency: "NGN" },
    performance: { successfulMatches: 22, averageRating: 4.8, responseTime: "1h", activeCases: 5 },
  },
  {
    id: "agent-mock-3",
    userName: "Sarah Williams",
    aboutMe: "Professional agent specializing in international surrogacy arrangements.",
    dateOfBirth: "1992-03-22",
    countryOfResidence: "Nigeria",
    stateOfResidence: "Rivers",
    lga: "Port Harcourt",
    phone1: "+2348033333333",
    phone2: null,
    emergencyContactPhone: null,
    profilePicture: "https://ui-avatars.com/api/?name=Sarah+Williams&background=0E0E55&color=fff&size=200",
    wallet: { id: "w3", userId: "agent-mock-3", balance: 0, currency: "NGN" },
    performance: { successfulMatches: 10, averageRating: 4.2, responseTime: "3h", activeCases: 2 },
  },
  {
    id: "agent-mock-4",
    userName: "Chioma Okafor",
    aboutMe: "Dedicated agent focused on ethical matching and supporting intended parents throughout their journey.",
    dateOfBirth: "1985-09-10",
    countryOfResidence: "Nigeria",
    stateOfResidence: "Lagos",
    lga: "Lekki",
    phone1: "+2348066666666",
    phone2: null,
    emergencyContactPhone: null,
    profilePicture: "https://ui-avatars.com/api/?name=Chioma+Okafor&background=0E0E55&color=fff&size=200",
    wallet: { id: "w4", userId: "agent-mock-4", balance: 0, currency: "NGN" },
    performance: { successfulMatches: 30, averageRating: 4.9, responseTime: "30m", activeCases: 7 },
  },
  {
    id: "agent-mock-5",
    userName: "Emeka Nwosu",
    aboutMe: "Certified agent with expertise in cross-border surrogacy coordination and legal navigation.",
    dateOfBirth: "1982-12-05",
    countryOfResidence: "Nigeria",
    stateOfResidence: "Abuja",
    lga: "Abuja Municipal",
    phone1: "+2348077777777",
    phone2: null,
    emergencyContactPhone: null,
    profilePicture: "https://ui-avatars.com/api/?name=Emeka+Nwosu&background=0E0E55&color=fff&size=200",
    wallet: { id: "w5", userId: "agent-mock-5", balance: 0, currency: "NGN" },
    performance: { successfulMatches: 18, averageRating: 4.6, responseTime: "1.5h", activeCases: 4 },
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

      // Empty or invalid response
      set({
        agents: fallbackAgents,
        isLoading: false,
        error: null,
      });
    } catch (err: any) {
      console.error("Error fetching agents:", err);

      set({
        agents: fallbackAgents,
        isLoading: false,
        error: null,
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
