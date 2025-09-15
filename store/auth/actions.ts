import api from '@/services/api';
import {
    ChangePasswordRequest,
    GoogleAppleAuth,
    LoginCredentials,
    OtpVerification,
    RegisterCredentials,
    ResetPasswordConfirm,
    ResetPasswordRequest,
    User
} from '@/types/auth';
import { secureDelete, secureSet } from '@/utils/storage';
import { StateCreator } from 'zustand';
import { AuthStore } from './types';

export const createAuthSlice: StateCreator<AuthStore> = (set, get) => ({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    requiresOtp: false,
    tempEmail: null,
    referralSource: null,
    referralCode: null,
    error: null,

    login: async (credentials: LoginCredentials) => {
        try {
            set({ isLoading: true, error: null });

            const response = await api.post('/auth/login', credentials);
            const { user, token, requiresOtp } = response.data;

            if (requiresOtp) {
                set({
                    isLoading: false,
                    requiresOtp: true,
                    tempEmail: credentials.email,
                    error: null,
                });
                return;
            }

            set({
                user,
                token,
                isAuthenticated: true,
                isLoading: false,
                requiresOtp: false,
                error: null,
            });

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

            await api.post('/auth/register', credentials);

            set({
                isLoading: false,
                requiresOtp: true,
                tempEmail: credentials.email,
                error: null,
            });
        } catch (error: any) {
            set({
                isLoading: false,
                error: error.response?.data?.message || 'Registration failed'
            });
            throw error;
        }
    },

    verifyOtp: async (verification: OtpVerification) => {
        try {
            set({ isLoading: true, error: null });

            const response = await api.post('/auth/verify-otp', verification);
            const { user, token } = response.data;

            set({
                user,
                token,
                isAuthenticated: true,
                isLoading: false,
                requiresOtp: false,
                tempEmail: null,
                error: null,
            });

            await secureSet('auth_token', token);
        } catch (error: any) {
            set({
                isLoading: false,
                error: error.response?.data?.message || 'OTP verification failed'
            });
            throw error;
        }
    },

    resendOtp: async (email: string) => {
        try {
            set({ isLoading: true, error: null });

            await api.post('/auth/resend-otp', { email });

            set({
                isLoading: false,
                error: null,
            });
        } catch (error: any) {
            set({
                isLoading: false,
                error: error.response?.data?.message || 'Failed to resend OTP'
            });
            throw error;
        }
    },

    forgotPassword: async (request: ResetPasswordRequest) => {
        try {
            set({ isLoading: true, error: null });

            await api.post('/auth/forgot-password', request);

            set({
                isLoading: false,
                requiresOtp: true,
                tempEmail: request.email,
                error: null,
            });
        } catch (error: any) {
            set({
                isLoading: false,
                error: error.response?.data?.message || 'Password reset request failed'
            });
            throw error;
        }
    },

    resetPassword: async (request: ResetPasswordConfirm) => {
        try {
            set({ isLoading: true, error: null });

            await api.post('/auth/reset-password', request);

            set({
                isLoading: false,
                requiresOtp: false,
                tempEmail: null,
                error: null,
            });
        } catch (error: any) {
            set({
                isLoading: false,
                error: error.response?.data?.message || 'Password reset failed'
            });
            throw error;
        }
    },

    changePassword: async (request: ChangePasswordRequest) => {
        try {
            set({ isLoading: true, error: null });

            await api.post('/auth/change-password', request);

            set({
                isLoading: false,
                error: null,
            });
        } catch (error: any) {
            set({
                isLoading: false,
                error: error.response?.data?.message || 'Password change failed'
            });
            throw error;
        }
    },

    googleLogin: async (accessToken: GoogleAppleAuth) => {
        try {
            set({ isLoading: true, error: null });

            const response = await api.post('/auth/google', { accessToken });
            const { user, token, requiresOtp } = response.data;

            if (requiresOtp) {
                set({
                    isLoading: false,
                    requiresOtp: true,
                    tempEmail: user.email,
                    error: null,
                });
                return;
            }

            set({
                user,
                token,
                isAuthenticated: true,
                isLoading: false,
                requiresOtp: false,
                error: null,
            });

            await secureSet('auth_token', token);
        } catch (error: any) {
            set({
                isLoading: false,
                error: error.response?.data?.message || 'Google login failed'
            });
            throw error;
        }
    },

    appleLogin: async (identityToken: GoogleAppleAuth) => {
        try {
            set({ isLoading: true, error: null });

            const response = await api.post('/auth/apple', { identityToken });
            const { user, token, requiresOtp } = response.data;

            if (requiresOtp) {
                set({
                    isLoading: false,
                    requiresOtp: true,
                    tempEmail: user.email,
                    error: null,
                });
                return;
            }

            set({
                user,
                token,
                isAuthenticated: true,
                isLoading: false,
                requiresOtp: false,
                error: null,
            });

            await secureSet('auth_token', token);
        } catch (error: any) {
            set({
                isLoading: false,
                error: error.response?.data?.message || 'Apple login failed'
            });
            throw error;
        }
    },

    logout: () => {
        secureDelete('auth_token');

        set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            requiresOtp: false,
            tempEmail: null,
            referralSource: null,
            referralCode: null,
            error: null,
        });
    },

    clearError: () => set({ error: null }),

    setUser: (user: User) => set({ user }),

    setToken: (token: string) => {
        set({ token });
        secureSet('auth_token', token);
    },

    clearTempEmail: () => set({ tempEmail: null }),

    setReferralInfo: (source: string, code?: string) => set({
        referralSource: source,
        referralCode: code || null
    }),

    clearReferralInfo: () => set({ referralSource: null, referralCode: null }),
});