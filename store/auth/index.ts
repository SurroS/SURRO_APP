import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import Storage from "@/store/middleware/persist";
import { createAuthSlice } from "./actions";
import { AuthStore } from "./types";
import { AuthState, User } from "@/types/auth";

const initialState: AuthState = {
  user: null,
  userId: "",
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
  hasSeenOnboarding: boolean;
  setHasSeenOnboarding: (value: boolean) => void;
  forceLogout: boolean;
  setForceLogout: (value: boolean) => void;
  sessionExpired: boolean;
  setSessionExpired: (value: boolean) => void;
  chatUnreadCount: number;
  setChatUnreadCount: (count: number) => void;
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

      // Onboarding
      hasSeenOnboarding: false,
      setHasSeenOnboarding: (value: boolean) => set({ hasSeenOnboarding: value }),

      // Force logout flag — set on 401 to block UI until redirect
      forceLogout: false,
      setForceLogout: (value: boolean) => set({ forceLogout: value }),

      // Session expired modal flag
      sessionExpired: false,
      setSessionExpired: (value: boolean) => set({ sessionExpired: value }),

      // Chat unread count for tab badge
      chatUnreadCount: 0,
      setChatUnreadCount: (count: number) => set({ chatUnreadCount: count }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => Storage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        selectedRole: state.selectedRole,
        hasSeenOnboarding: state.hasSeenOnboarding,
      }),
      onRehydrateStorage: () => {
        console.log("🌀 Rehydration starting...");
        return (state, error) => {
          if (error) console.error("❌ Rehydration failed:", error);
          else state?.setHasHydrated(true);
        };
      },
    },
  ),
);
