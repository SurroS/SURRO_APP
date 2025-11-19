// store/profile/agents/listStore.ts
import { create } from "zustand";
import { createAgentListSlice } from "./actions";
import { AgentListStore } from "./types";

export const useAgentListStore = create<AgentListStore>()((...a) => ({
  ...createAgentListSlice(...a),
}));
