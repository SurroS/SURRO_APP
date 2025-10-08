import authApi, { makeAuthenticatedAuthRequest } from "@/services/authApi";
import {
  ChangePasswordRequest,
  GoogleAppleAuth,
  LoginCredentials,
  OtpVerification,
  RegisterCredentials,
  ResetPasswordConfirm,
  ResetPasswordRequest,
  User,
} from "@/types/auth";
import { secureDelete, secureSet } from "@/utils/storage";
import { router } from "expo-router";
import { StateCreator } from "zustand";
import { AuthStore } from "./types";

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

      const response = await authApi.post("/auth/login", credentials);

      const { user, accessToken, requiresOtp } = response.data;

      // Debug: Log the token type and value
      console.log("Token received:", {
        accessToken,
        type: typeof accessToken,
        isString: typeof accessToken === "string",
      });

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
        token: accessToken,
        isAuthenticated: true,
        isLoading: false,
        requiresOtp: false,
        error: null,
      });

      if (accessToken && typeof accessToken === "string") {
        await secureSet("auth_token", accessToken);
      }
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Login failed",
      });
      throw error;
    }
  },

  register: async (credentials: RegisterCredentials) => {
    console.log("Credentials =", { credentials });
    const data = {
      email: credentials.email,
      password: credentials.password,
      role: credentials.role,
      referralCode: credentials.referralCode,
    };
    try {
      set({ isLoading: true, error: null });

      await authApi.post("/auth/register", data);
      set({
        isLoading: false,
        requiresOtp: true,
        tempEmail: credentials.email,
        error: null,
      });
      console.log("Credentials =", { data });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Registration failed",
      });
      console.log("Credentials =", { data });
      throw error;
    }
  },

  verifyOtp: async (verification: OtpVerification) => {
    console.log("verifyOtp =", verification);

    try {
      set({ isLoading: true, error: null });

      const response = await authApi.post("/auth/verify-otp", verification);
      console.log("OTP verification response =", response.data);

      // OTP verification only returns a message, no user/token
      // User needs to login after verification
      router.replace("/(auth)/login");
      set({
        isLoading: false,
        requiresOtp: false,
        tempEmail: null,
        error: null,
      });
    } catch (error: any) {
      console.log("error =", error);

      set({
        isLoading: false,
        error: error.response?.data?.message || "OTP verification failed",
      });
      throw error;
    }
  },

  resendOtp: async (email: string) => {
    try {
      set({ isLoading: true, error: null });

      await authApi.post("/auth/resend-otp", { email });

      set({
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Failed to resend OTP",
      });
      throw error;
    }
  },

  forgotPassword: async (request: ResetPasswordRequest) => {
    try {
      set({ isLoading: true, error: null });

      await authApi.post("/auth/forgot-password", request);
      set({
        isLoading: false,
        requiresOtp: true,
        tempEmail: request.email,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Password reset request failed",
      });
      throw error;
    }
  },

  resetPassword: async (request: ResetPasswordConfirm) => {
    try {
      set({ isLoading: true, error: null });
      await authApi.post("/auth/reset-password", request);
  
      set({
        isLoading: false,
        requiresOtp: false,
        tempEmail: null,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Password reset failed",
      });
      throw error;
    }
  },

  changePassword: async (request: ChangePasswordRequest) => {
    try {
      set({ isLoading: true, error: null });

      const { token } = get();
      if (!token) {
        throw new Error("No authentication token available");
      }

      await makeAuthenticatedAuthRequest(
        token,
        "/auth/change-password",
        request
      );

      set({
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Password change failed",
      });
      throw error;
    }
  },

 googleLogin: async (googleAuth: { idToken: string; role?: string }) => {
  try {
    set({ isLoading: true, error: null });

    console.log("Starting Google login with:", {
      hasIdToken: !!googleAuth?.idToken,
      role: googleAuth?.role ?? "none (login only)",
    });

    const response = await authApi.post("/auth/google", {
      idToken: googleAuth.idToken, // Correct field name
      role: googleAuth.role,       // Optional, only needed during signup
    });

    const { user, accessToken, requiresOtp } = response.data;

    console.log("Google Auth Response:", response.data);

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
      token: accessToken,
      isAuthenticated: true,
      isLoading: false,
      requiresOtp: false,
      error: null,
    });

    if (accessToken && typeof accessToken === "string") {
      await secureSet("auth_token", accessToken);
      console.log("🔒 Token securely saved:", accessToken);
    }
  } catch (error: any) {
    console.log("Google Login Error:", error.response?.data || error.message);
    set({
      isLoading: false,
      error: error.response?.data?.message || "Google login failed",
    });
    throw error;
  }
},


  appleLogin: async (appleToken: GoogleAppleAuth) => {
    try {
      set({ isLoading: true, error: null });

      const response = await authApi.post("/auth/apple", {
        identityToken: appleToken,
      });
      const { user, accessToken, requiresOtp } = response.data;

      // Debug: Log the token type and value
      console.log("Token received:", {
        accessToken,
        type: typeof accessToken,
        isString: typeof accessToken === "string",
      });

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
        token: accessToken,
        isAuthenticated: true,
        isLoading: false,
        requiresOtp: false,
        error: null,
      });

      if (accessToken && typeof accessToken === "string") {
        await secureSet("auth_token", accessToken);
      }
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Apple login failed",
      });
      throw error;
    }
  },

  logout: () => {
    secureDelete("auth_token");

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

  setUser: (user) =>
    set((state) => ({
      user: { ...state.user, ...user } as User,
    })),

  setToken: (token: string) => {
    if (token && typeof token === "string") {
      set({ token });
      secureSet("auth_token", token);
    }
  },

  clearTempEmail: () => set({ tempEmail: null }),

  setReferralInfo: (source: string, code?: string) =>
    set({
      referralSource: source,
      referralCode: code || null,
    }),

  clearReferralInfo: () => set({ referralSource: null, referralCode: null }),
});
