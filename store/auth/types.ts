import {
    AuthState,
    LoginCredentials,
    RegisterCredentials,
    User
} from '@/types/auth';

export interface AuthActions {
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (credentials: RegisterCredentials) => Promise<void>;
    logout: () => void;
    clearError: () => void;
    setUser: (user: User) => void;
    setToken: (token: string) => void;
}

export type AuthStore = AuthState & AuthActions;