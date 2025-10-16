import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { appStorage } from '@/utils/storage';
import { createAuthSlice } from './actions';
import { AuthState } from '@/types/auth';
import { AuthStore } from './types';

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
    (...a) => ({
      ...initialState,
      ...createAuthSlice(...a),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => appStorage),
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
