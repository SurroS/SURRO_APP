import authApi from "@/services/authApi";
import { publicPost } from "@/services/httpClient";
import {
  ChangePasswordRequest,
  GoogleAuth,
  AppleAuth,
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

const DEV_AUTH_EMAIL = "dev@surro.local";
const DEV_AUTH_PASSWORD = "DevSurro123!";
const DEV_AUTH_TOKEN = "dev-auth-token";

const DEV_AUTH_USER: User = {
  id: "dev-user",
  userId: "dev-user",
  email: DEV_AUTH_EMAIL,
  token: DEV_AUTH_TOKEN,
  role: "SURROGATE",
  isVerified: true,
  isApproved: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  isOnline: true,
  lastSeen: new Date().toISOString(),
  kycStatus: "APPROVED",
  referralCode: "DEV",
  wallet: {
    id: "dev-wallet",
    userId: "dev-user",
    balance: 0,
    currency: "NGN",
  },
};

export const createAuthSlice: StateCreator<AuthStore> = (set, get) => ({
  user: null,
  userId: "",
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

      const response = await authApi.login(credentials);

      const { user, accessToken, requiresOtp } = response;

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

      if (!user) {
        throw new Error("Authentication response missing user data");
      }

      set({
        user,
        userId: user.id || "",
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

      await authApi.signup(data);
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

      const response = await authApi.verifyOTP(verification);
      console.log("OTP verification response =", response);

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

      await authApi.resendOTP({ email });

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

      await authApi.forgotPassword(request);
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
      await authApi.resetPassword(request);

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

      //  Exclude frontend-only field
      const { newPasswordConfirmation, ...apiRequest } = request;

      await authApi.authedRequest(
        "/auth/change-password",
        apiRequest, // send only the required fields
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

  devLogin: async () => {
    if (!__DEV__) {
      throw new Error("Dev login is only available in development mode");
    }

    console.log("[DEV] Signing in with dev credentials");

    set((state) => {
      // Get the selected role from current state, default to SURROGATE
      const selectedRole = (state as any).selectedRole || "SURROGATE";

      const devUser = {
        ...DEV_AUTH_USER,
        role: selectedRole,
      };

      return {
        user: devUser,
        userId: devUser.id,
        token: DEV_AUTH_TOKEN,
        isAuthenticated: true,
        isLoading: false,
        requiresOtp: false,
        error: null,
      };
    });

    await secureSet("auth_token", DEV_AUTH_TOKEN);
  },

  googleLogin: async (googleAuth: GoogleAuth) => {
    try {
      set({ isLoading: true, error: null });

      console.log("Starting Google login with:", {
        hasIdToken: !!googleAuth?.idToken,
        role: googleAuth?.role ?? "none (login only)",
      });
      console.log("Google login request payload:", {
        idToken: googleAuth.idToken,
        role: googleAuth.role,
      });

      const response = await publicPost("/auth/google", {
        idToken: googleAuth.idToken, // Correct field name
        role: googleAuth.role, // Optional, only needed during signup
      });

      console.log("Google login raw response:", response);

      if (!response) {
        console.error("Google login endpoint returned empty payload");
        throw new Error("Invalid response from Google auth endpoint");
      }

      const { user, accessToken, requiresOtp } = response;

      console.log("Google Auth Response:", response);

      if (requiresOtp) {
        set({
          isLoading: false,
          requiresOtp: true,
          tempEmail: user?.email,
          error: null,
        });
        return;
      }

      if (!user) {
        throw new Error("User data missing from Google auth response");
      }

      set({
        user,
        userId: user.id || "",
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
      console.error("Google Login Error details:", {
        message: error.message,
        responseData: error.response?.data,
        responseStatus: error.response?.status,
        responseHeaders: error.response?.headers,
      });
      set({
        isLoading: false,
        error: error.response?.data?.message || "Google login failed",
      });
      throw error;
    }
  },

  appleLogin: async (appleToken: AppleAuth) => {
    try {
      set({ isLoading: true, error: null });

      console.log("Starting Apple login request with identityToken:", {
        identityToken: appleToken,
      });

      const response = await publicPost("/auth/apple", {
        identityToken: appleToken,
      });

      console.log("Apple login raw response:", response);

      if (!response) {
        throw new Error("Invalid response from Apple auth endpoint");
      }

      const { user, accessToken, requiresOtp } = response;

      // Debug: Log the token type and value
      console.log("Apple Auth Response:", response);
      console.log("Token received:", {
        accessToken,
        type: typeof accessToken,
        isString: typeof accessToken === "string",
      });

      if (requiresOtp) {
        set({
          isLoading: false,
          requiresOtp: true,
          tempEmail: user?.email,
          error: null,
        });
        return;
      }

      if (!user) {
        throw new Error("User data missing from Apple auth response");
      }

      set({
        user,
        userId: user.id || "",
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
      console.error("Apple Login Error details:", {
        message: error.message,
        responseData: error.response?.data,
        responseStatus: error.response?.status,
        responseHeaders: error.response?.headers,
      });
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
