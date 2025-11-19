// stores/agent/useAgentProfileStore.ts

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import Storage from "@/store/middleware/persist";

import { AgentProfileStore } from "./types";
import { createAgentProfileSlice } from "./actions";

export const useAgentProfileStore = create<AgentProfileStore>()(
  persist(
    (...a) => ({
      ...createAgentProfileSlice(...a),
    }),
    {
      name: "agent-profile-storage",
      storage: createJSONStorage(() => Storage),

      partialize: (state) => ({
        agentProfile: state.agentProfile,
      }),
    }
  )
);
