export interface User {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    isVerified: boolean;
    role: 'INTENDED_PARENT' | 'SURROGATE' | 'AGENT';
}

export interface AuthState {
    user: User | null;
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
    currentPassword: string;
    newPassword: string;
    newPasswordConfirmation: string;
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