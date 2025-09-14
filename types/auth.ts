export interface User {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    isVerified: boolean;
    role: 'parent' | 'surrogate' | 'agent';
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    requiresOtp: boolean;
    tempEmail: string | null; // For OTP flows
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
    refferalCode?: string;
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