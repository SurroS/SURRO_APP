// store/profile/agents/listTypes.ts
import { AgentProfile } from "../profile/agent/types";

// --- Agent List State ---
export interface AgentListState {
  agents: AgentProfile[];
  isLoading: boolean;
  error: string | null;
}

// --- Agent List Actions ---
export interface AgentListActions {
  fetchAgents: (showToast?: boolean) => Promise<void>;
  setAgents: (data: AgentProfile[]) => void;
  setLoading: (val: boolean) => void;
  setError: (err: string | null) => void;
}

// Combined type
export type AgentListStore = AgentListState & AgentListActions;
