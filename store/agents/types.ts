import { StateCreator } from "zustand";

export interface Agent {
  id: string;
  name: string;
  avatar?: string;
  age:string;
  country:string
}

// --- Agent List State ---
export interface AgentListState {
  agents: Agent[];
  isLoading: boolean;
  error: string | null;
}

// --- Agent List Actions ---
export interface AgentListActions {
  fetchAgent: (showToast?: boolean) => Promise<void>;
  setAgent: (data: Agent[]) => void;
  setLoading: (val: boolean) => void;
  setError: (err: string | null) => void;
}

// Combined type
export type AgentStore = AgentListState & AgentListActions;
