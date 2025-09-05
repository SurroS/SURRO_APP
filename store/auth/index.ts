import { AuthState } from '@/types/auth';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthStore, createAuthSlice } from './actions';

const initialState: AuthState = {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
};

export const useAuthStore = create<AuthStore>()(
    persist(
        (...a) => ({
            ...initialState,
            ...createAuthSlice(...a),
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                token: state.token,
                user: state.user,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);