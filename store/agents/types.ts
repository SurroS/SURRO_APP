// store/agents/types.ts
import { AgentProfile } from "../profile/agent/types";

// --- Agent List State ---
export interface AgentListState {
  agents: AgentProfile[];
  selectedAgent: AgentProfile | null;
  isLoading: boolean;
  error: string | null;
}

// --- Agent List Actions ---
export interface AgentListActions {
  fetchAgents: (showToast?: boolean) => Promise<void>;
  fetchAgentById: (agentId: string) => Promise<AgentProfile | null>;
  setAgents: (data: AgentProfile[]) => void;
  setSelectedAgent: (agent: AgentProfile | null) => void;
  setLoading: (val: boolean) => void;
  setError: (err: string | null) => void;
}

// Combined type
export type AgentListStore = AgentListState & AgentListActions;
