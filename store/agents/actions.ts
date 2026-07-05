import { StateCreator } from "zustand";
import { AgentProfile } from "@/store/profile/agent/types";
import { getAllAgents } from "@/services/profileApi";
import { resolveProfilePicture } from "@/utils/resolveMediaUrl";

const mapApiAgent = (apiItem: any): any => {
  const raw =
    apiItem.profilePicture ??
    apiItem.profilePictureUrl ??
    apiItem.avatar ??
    "";
  const resolved = resolveProfilePicture(raw) ?? "";
  return {
    ...apiItem,
    profilePicture: resolved,
    avatar: resolved,
    userName:
      apiItem.userName ??
      apiItem.username ??
      apiItem.user?.userName ??
      apiItem.fullName ??
      "",
  };
};

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

      const raw: any[] = res?.data || [];
      const Agents = raw.map(mapApiAgent);

      if (Array.isArray(Agents) && Agents.length > 0) {
        set({
          agents: Agents,
          isLoading: false,
          error: null,
        });
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
