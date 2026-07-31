import {
  AuthState,
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

export interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  verifyOtp: (verification: OtpVerification) => Promise<void>;
  resendOtp: (email: string) => Promise<void>;
  forgotPassword: (request: ResetPasswordRequest) => Promise<void>;
  resetPassword: (request: ResetPasswordConfirm) => Promise<void>;
  changePassword: (request: ChangePasswordRequest) => Promise<void>;
  googleLogin: (request: GoogleAuth) => Promise<void>;
  appleLogin: (request: AppleAuth) => Promise<void>;
  devLogin: () => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  setUser: (user: Partial<User>) => void;
  setToken: (token: string) => void;
  clearTempEmail: () => void;
  setReferralInfo: (source: string, code?: string) => void;
  clearReferralInfo: () => void;
}

export type AuthStore = AuthState & AuthActions;
