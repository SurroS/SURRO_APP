import { StateCreator } from "zustand";
import { AgentProfile } from "@/types/agent";
import { getAgentsList } from "@/services/profileApi";
import { resolveProfilePicture } from "@/utils/resolveMediaUrl";

export interface AgentListStore {
  agents: AgentProfile[];
  isLoading: boolean;
  error: string | null;

  fetchAgents: (showToast?: boolean) => Promise<void>;
  setAgents: (data: AgentProfile[]) => void;
  setLoading: (val: boolean) => void;
  setError: (err: string | null) => void;
}

const getAge = (dob?: string | null) => {
  if (!dob) return "N/A";
  const date = new Date(dob);
  return Math.floor(
    (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24 * 365),
  ).toString();
};

const getDisplayName = (
  firstName?: string | null,
  lastName?: string | null,
  userName?: string | null,
) => `${firstName ?? ""} ${lastName ?? ""}`.trim() || userName || "Unknown";

const apiImage = (apiItem: any) => {
  const raw = apiItem.profilePicture ?? apiItem.profilePictureUrl ?? apiItem.avatar ?? "";
  return resolveProfilePicture(raw) ?? "";
};

const mapApiAgent = (apiItem: any): any => ({
  ...apiItem,
  profilePicture: apiImage(apiItem),
  avatar: apiImage(apiItem),
  age: apiItem.age ? apiItem.age.toString() : getAge(apiItem.dateOfBirth ?? apiItem.dob),
  userName:
    apiItem.userName ??
    apiItem.username ??
    apiItem.user?.userName ??
    apiItem.fullName ??
    apiItem.email?.split("@")[0] ??
    "",
  name: getDisplayName(
    apiItem.firstName,
    apiItem.lastName,
    apiItem.userName ?? apiItem.username ?? apiItem.user?.userName ?? apiItem.email?.split("@")[0],
  ),
});

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

      const res = await getAgentsList();

      let rawList: any[] = [];
      if (Array.isArray(res)) {
        rawList = res;
      } else if (res?.data && Array.isArray(res.data)) {
        rawList = res.data;
      } else if (res?.agents && Array.isArray(res.agents)) {
        rawList = res.agents;
      } else if (res?.users && Array.isArray(res.users)) {
        rawList = res.users;
      } else if (res?.results && Array.isArray(res.results)) {
        rawList = res.results;
      }

      const Agents = rawList.map(mapApiAgent);

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
