import { authenticatedPost, publicPost } from "./httpClient";

// Authentication API functions
// Note: Login/signup don't require authentication, so we use publicPost
// Other auth operations (like token refresh) use authenticatedPost

const authApi = {
  login: async (data: { email: string; password: string }) => {
    return publicPost("/auth/login", data);
  },

  signup: async (data: { email: string; password: string; role: string }) => {
    return publicPost("/auth/register", data);
  },

  verifyOTP: async (data: { email: string; code: string }) => {
    return publicPost("/auth/verify-otp", data);
  },

  resendOTP: async (data: { email: string }) => {
    return publicPost("/auth/resend-otp", data);
  },

  forgotPassword: async (data: { email: string }) => {
    return publicPost("/auth/forgot-password", data);
  },

  resetPassword: async (data: {
    email: string;
    otp: string;
    newPassword: string;
    newPasswordConfirmation: string;
  }) => {
    return publicPost("/auth/reset-password", data);
  },

  refreshToken: async () => {
    return authenticatedPost("/auth/refresh-token");
  },

  logout: async () => {
    return authenticatedPost("/auth/logout");
  },

  // Legacy wrapper for backward compatibility (remove after updating all usages)
  makeAuthenticatedAuthRequest: async (
    token: string,
    endpoint: string,
    data: any,
  ) => {
    console.warn(
      "[authApi] makeAuthenticatedAuthRequest is deprecated. Use authenticatedPost directly.",
    );
    return authenticatedPost(endpoint, data);
  },

  authedRequest: async (endpoint: string, data: any) => {
    console.warn(
      "[authApi] authedRequest is deprecated. Use authenticatedPost directly.",
    );
    return authenticatedPost(endpoint, data);
  },
};

export default authApi;
