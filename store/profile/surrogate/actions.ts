import { StateCreator } from 'zustand';
import {
    SurrogateProfile,
    SurrogateProfileUpdate, 
    MedicalProfile,
    MedicalProfileUpdate
} from '@/types/profile';
import {
    createSurrogateProfile,
    updateSurrogateProfile,
    getSurrogateProfile,
    updateMedicalProfile,
    uploadEndometriumImage,
} from '@/services/profileApi';
import { Toast } from 'toastify-react-native';
import { ToastType } from 'toastify-react-native/utils/interfaces';

export interface ProfileState {
    surrogateProfile: SurrogateProfile | null;
    medicalProfile: MedicalProfile | null;
    isLoading: boolean;
    error: string | null;
}

export interface ProfileActions {
    // Surrogate Profile Actions
    createProfile: (profileData: SurrogateProfile) => Promise<void>;
    updateProfile: (profileData: SurrogateProfileUpdate) => Promise<void>;
    fetchProfile: () => Promise<void>;

    // Medical Profile Actions
    updateMedicalProfile: (medicalData: MedicalProfileUpdate) => Promise<void>;
    uploadEndometriumImage: (imageData: FormData) => Promise<void>;

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

    createProfile: async (profileData: SurrogateProfile) => {
        try {
            set({ isLoading: true, error: null });

            const response = await createSurrogateProfile(profileData);
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

    updateProfile: async (profileData: SurrogateProfileUpdate) => {
        try {
            set({ isLoading: true, error: null });

            const response = await updateSurrogateProfile(profileData);
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

    fetchProfile: async () => {
        try {
            set({ isLoading: true, error: null });

            const response = await getSurrogateProfile();
            const { profile, medicalProfile } = response.data;

            set({
                surrogateProfile: profile,
                medicalProfile: medicalProfile || null,
                isLoading: false,
                error: null,
            });
        } catch (error: any) {
            // Handle 404 error specifically - profile doesn't exist
            if (error.response?.status === 404) {
                const message = 'No profile created for this account';
                set({
                    isLoading: false,
                    error: null,
                });
                Toast.show({
                    text1: message,
                    type: 'customError' as ToastType,
                });
                return;
            }
            
            // Handle other errors normally
            set({
                isLoading: false,
                error: error.response?.data?.message || 'Failed to fetch profile',
            });
            throw error;
        }
    },

    updateMedicalProfile: async (medicalData: MedicalProfileUpdate) => {
        try {
            set({ isLoading: true, error: null });

            const response = await updateMedicalProfile(medicalData);
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

    uploadEndometriumImage: async (imageData: FormData) => {
        try {
            set({ isLoading: true, error: null });

            const response = await uploadEndometriumImage(imageData);
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
