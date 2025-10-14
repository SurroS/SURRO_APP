import { StateCreator } from 'zustand';
import {
    SurrogateProfile,
    SurrogateProfileUpdate,
    MedicalProfile,
    MedicalProfileUpdate,
} from '@/types/profile';
import {
    createSurrogateProfile,
    updateSurrogateProfile,
    getSurrogateProfile,
    updateMedicalProfile,
    uploadEndometriumImage,
} from '@/services/profileApi';

export interface ProfileState {
    surrogateProfile: SurrogateProfile | null;
    medicalProfile: MedicalProfile | null;
    isLoading: boolean;
    error: string | null;
}

export interface ProfileActions {
    // Surrogate Profile Actions
    createProfile: (token: string, profileData: SurrogateProfile) => Promise<void>;
    updateProfile: (token: string, profileData: SurrogateProfileUpdate) => Promise<void>;
    fetchProfile: (token: string) => Promise<void>;

    // Medical Profile Actions
    updateMedicalProfile: (token: string, medicalData: MedicalProfileUpdate) => Promise<void>;
    uploadEndometriumImage: (token: string, imageData: FormData) => Promise<void>;

    // Utility Actions
    clearError: () => void;
    setProfile: (profile: SurrogateProfile) => void;
    setMedicalProfile: (medicalProfile: MedicalProfile) => void;
}

export type ProfileStore = ProfileState & ProfileActions;

export const createProfileSlice: StateCreator<ProfileStore> = (set, get) => ({
    surrogateProfile: null,
    medicalProfile: null,
    isLoading: false,
    error: null,

    createProfile: async (token: string, profileData: SurrogateProfile) => {
        try {
            set({ isLoading: true, error: null });

            const response = await createSurrogateProfile(token, profileData);
            const { profile } = response.data;

            set({
                surrogateProfile: profile,
                isLoading: false,
                error: null,
            });
        } catch (error: any) {
            set({
                isLoading: false,
                error: error.response?.data?.message || 'Failed to create profile',
            });
            throw error;
        }
    },

    updateProfile: async (token: string, profileData: SurrogateProfileUpdate) => {
        try {
            set({ isLoading: true, error: null });

            const response = await updateSurrogateProfile(token, profileData);
            const { profile } = response.data;

            set({
                surrogateProfile: profile,
                isLoading: false,
                error: null,
            });
        } catch (error: any) {
            set({
                isLoading: false,
                error: error.response?.data?.message || 'Failed to update profile',
            });
            throw error;
        }
    },

    fetchProfile: async (token: string) => {
        try {
            set({ isLoading: true, error: null });

            const response = await getSurrogateProfile(token);
            const { profile, medicalProfile } = response.data;

            set({
                surrogateProfile: profile,
                medicalProfile: medicalProfile || null,
                isLoading: false,
                error: null,
            });
        } catch (error: any) {
            set({
                isLoading: false,
                error: error.response?.data?.message || 'Failed to fetch profile',
            });
            throw error;
        }
    },

    updateMedicalProfile: async (token: string, medicalData: MedicalProfileUpdate) => {
        try {
            set({ isLoading: true, error: null });

            const response = await updateMedicalProfile(token, medicalData);
            const { medicalProfile } = response.data;

            set({
                medicalProfile: medicalProfile,
                isLoading: false,
                error: null,
            });
        } catch (error: any) {
            set({
                isLoading: false,
                error: error.response?.data?.message || 'Failed to update medical profile',
            });
            throw error;
        }
    },

    uploadEndometriumImage: async (token: string, imageData: FormData) => {
        try {
            set({ isLoading: true, error: null });

            const response = await uploadEndometriumImage(token, imageData);
            const { medicalProfile } = response.data;

            set({
                medicalProfile: medicalProfile,
                isLoading: false,
                error: null,
            });
        } catch (error: any) {
            set({
                isLoading: false,
                error: error.response?.data?.message || 'Failed to upload endometrium image',
            });
            throw error;
        }
    },

    clearError: () => set({ error: null }),

    setProfile: (profile: SurrogateProfile) =>
        set({ surrogateProfile: profile }),

    setMedicalProfile: (medicalProfile: MedicalProfile) =>
        set({ medicalProfile: medicalProfile }),
});
