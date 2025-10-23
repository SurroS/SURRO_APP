import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import Storage from "@/store/middleware/persist";
import { createAuthSlice } from "./actions";
import { AuthState } from "@/types/auth";
import { AuthStore } from "./types";

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
 
export const useAuthStore = create<AuthStore>()(
  persist(
    (set:any, get:any, api:any) => ({
      ...initialState,
      ...createAuthSlice(set, get, api),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => Storage),
      partialize: (state:any) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
