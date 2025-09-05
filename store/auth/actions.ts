import api from '@/services/api';
import { LoginCredentials, RegisterCredentials, User } from '@/types/auth';
import { secureDelete, secureSet } from '@/utils/storage';
import { StateCreator } from 'zustand';
import { AuthStore } from './types';

export const createAuthSlice: StateCreator<AuthStore> = (set, get) => ({
    // Initial state
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,

    // Actions
    login: async (credentials: LoginCredentials) => {
        try {
            set({ isLoading: true, error: null });

            const response = await api.post('/auth/login', credentials);
            const { user, token } = response.data;

            set({
                user,
                token,
                isAuthenticated: true,
                isLoading: false,
                error: null,
            });

            // Store token securely
            await secureSet('auth_token', token);
        } catch (error: any) {
            set({
                isLoading: false,
                error: error.response?.data?.message || 'Login failed'
            });
            throw error;
        }
    },

    register: async (credentials: RegisterCredentials) => {
        try {
            set({ isLoading: true, error: null });

            const response = await api.post('/auth/register', credentials);
            const { user, token } = response.data;

            set({
                user,
                token,
                isAuthenticated: true,
                isLoading: false,
                error: null,
            });

            // Store token securely
            await secureSet('auth_token', token);
        } catch (error: any) {
            set({
                isLoading: false,
                error: error.response?.data?.message || 'Registration failed'
            });
            throw error;
        }
    },

    logout: () => {
        // Clear secure storage
        secureDelete('auth_token');

        set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
        });
    },

    clearError: () => set({ error: null }),

    setUser: (user: User) => set({ user }),

    setToken: (token: string) => {
        set({ token });
        secureSet('auth_token', token);
    },
});