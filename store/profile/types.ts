import { ProfileState } from './actions';

export interface ProfileActions {
    // Surrogate Profile Actions
    createProfile: (token: string, profileData: any) => Promise<void>;
    updateProfile: (token: string, profileData: any) => Promise<void>;
    fetchProfile: (token: string) => Promise<void>;

    // Medical Profile Actions
    updateMedicalProfile: (token: string, medicalData: any) => Promise<void>;
    uploadEndometriumImage: (token: string, imageData: FormData) => Promise<void>;

    // Utility Actions
    clearError: () => void;
    setProfile: (profile: any) => void;
    setMedicalProfile: (medicalProfile: any) => void;
}

export type ProfileStore = ProfileState & ProfileActions;
