import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import Storage from "@/store/middleware/persist";
import { createParentProfileSlice } from "./actions";
import { ParentProfileStore } from "./types";

export const useParentProfileStore = create<ParentProfileStore>()(
  persist(
    (...a) => ({
      ...createParentProfileSlice(...a)
    }),
    {
      name: "parent-profile-storage",
      storage: createJSONStorage(() => Storage),
      partialize: (state) => ({
        parentProfile: state.parentProfile,
      }),
    }
  )
);
