import { create } from "zustand";
import { createAgentSlice } from "./actions";
import { AgentStore } from "./Types";

export const useAgentStore = create<AgentStore>()((...a) => ({
  ...createAgentSlice(...a),
}));
