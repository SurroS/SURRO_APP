import {
    AuthState,
    ChangePasswordRequest,
    GoogleAppleAuth,
    LoginCredentials,
    OtpVerification,
    RegisterCredentials,
    ResetPasswordConfirm,
    ResetPasswordRequest,
    User
} from '@/types/auth';

export interface AuthActions {
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (credentials: RegisterCredentials) => Promise<void>;
    verifyOtp: (verification: OtpVerification) => Promise<void>;
    resendOtp: (email: string) => Promise<void>;
    forgotPassword: (request: ResetPasswordRequest) => Promise<void>;
    resetPassword: (request: ResetPasswordConfirm) => Promise<void>;
    changePassword: (request: ChangePasswordRequest) => Promise<void>;
    googleLogin: (request: GoogleAppleAuth) => Promise<void>;
    appleLogin: (request: GoogleAppleAuth) => Promise<void>;
    logout: () => void;
    clearError: () => void;
    setUser: (user: User) => void;
    setToken: (token: string) => void;
    clearTempEmail: () => void;
}

export type AuthStore = AuthState & AuthActions;