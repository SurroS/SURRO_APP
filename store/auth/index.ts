import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import Storage from "../middleware/persist";
import { createAuthSlice } from "./actions";
import { AuthStore } from "./types";
import { AuthState, User } from "@/types/auth";

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  requiresOtp: false,
  tempEmail: null,
  referralSource: null,
  referralCode: null,
};

interface HydrationState {
  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
  selectedRole: string | null;
  setSelectedRole: (role: string) => void;
}

type FullAuthStore = AuthStore & HydrationState;

export const useAuthStore = create<FullAuthStore>()(
  persist(
    (set, get, api) => ({
      ...initialState,
      ...createAuthSlice(set, get, api),

      // Hydration
      hasHydrated: false,
      setHasHydrated: (value: boolean) => set({ hasHydrated: value }),

      // Role selection
      selectedRole: null,
      setSelectedRole: (role: any) => {
        set({ selectedRole: role });
        const user = get().user;
        if (user) {
          set({ user: { ...user, role } });
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => Storage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        selectedRole: state.selectedRole,
      }),
      onRehydrateStorage: () => {
        console.log("🌀 Rehydration starting...");
        return (state, error) => {
          if (error) console.error("❌ Rehydration failed:", error);
          else state?.setHasHydrated(true);
        };
      },
    }
  )
);
