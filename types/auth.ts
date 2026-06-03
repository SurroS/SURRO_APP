export interface User {
  id: string;
  userId: string;
  email: string;
  token: string | null;
  password?: string; // Only present in API responses, not in frontend state
  role: "INTENDED_PARENT" | "SURROGATE" | "AGENT";
  isVerified: boolean;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
  isOnline: boolean;
  lastSeen: string;
  googleId?: string | null;
  appleId?: string | null;
  profilePictureUrl?: string | null;
  kycStatus: "NOT_STARTED" | "PENDING" | "APPROVED" | "REJECTED";
  referralCode: string;
  referral?: {
    notRedeemed?: string[];
    redeemed?: string[];
  };
  referredById?: string | null;
  wallet: Wallet;
  name?: string;
  username?: string;
  location?: string;
  status?: string;
  dob?: string;
  avatar?: string;
}
export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  currency: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthState {
  user: User | null;
  userId: string;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  requiresOtp: boolean;
  tempEmail: string | null; // For OTP flows
  referralSource: string | null; // How user heard about us
  referralCode: string | null; // Referral code if applicable
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  passwordConfirmation: string;
  role: string;
  referralCode?: string;
  termsAccepted?: boolean;
}

export interface OtpVerification {
  email: string;
  code: string;
}

export interface ResetPasswordRequest {
  email: string;
}

export interface ResetPasswordConfirm {
  email: string;
  otp: string;
  newPassword: string;
  newPasswordConfirmation: string;
}

export interface ChangePasswordRequest {
  newPassword: string;
  newPasswordConfirmation: string;
}

export interface GoogleAuth {
  idToken: string;
  role?: string;
}

export interface AppleAuth {
  identityToken: string;
}

export interface GoogleAppleAuth {
  idToken: string;
  role: string;
}

export interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}
