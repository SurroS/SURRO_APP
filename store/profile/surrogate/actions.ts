import { StateCreator } from "zustand";
import {
  SurrogateProfile,
  SurrogateProfileUpdate,
  MedicalProfile,
  MedicalProfileUpdate,
} from "@/types/profile";
import {
  createSurrogateProfile,
  updateSurrogateProfile,
  getSurrogateProfile,
  updateMedicalProfile,
  uploadEndometriumImage,
} from "@/services/profileApi";
import { Toast } from "toastify-react-native";
import { useAuthStore } from "@/store/auth";
import { ToastType } from "toastify-react-native/utils/interfaces";

export interface ProfileState {
  surrogateProfile: SurrogateProfile | null;
  medicalProfile: MedicalProfile | null;
  isLoading: boolean;
  error: string | null;
  _hydrated: boolean;
}

export interface ProfileActions {
  // Surrogate Profile Actions
  createProfile: (profileData: SurrogateProfile) => Promise<void>;
  updateProfile: (profileData: SurrogateProfileUpdate) => Promise<void>;
  fetchProfile: (forceRefresh?: boolean) => Promise<void>;

  // Medical Profile Actions
  updateMedicalProfile: (medicalData: MedicalProfileUpdate) => Promise<void>;
  uploadEndometriumImage: (imageData: FormData) => Promise<void>;

  // Utility Actions
  clearError: () => void;
  setProfile: (profile: SurrogateProfile) => void;
  setMedicalProfile: (medicalProfile: MedicalProfile) => void;
  setHydrated: () => void;
}

export type ProfileStore = ProfileState & ProfileActions;

export const createProfileSlice: StateCreator<ProfileStore> = (set, get) => ({
  surrogateProfile: null,
  medicalProfile: null,
  isLoading: false,
  error: null,
  _hydrated: false,

  createProfile: async (profileData: SurrogateProfile) => {
    try {
      set({ isLoading: true, error: null });

      const response = await createSurrogateProfile(profileData);
      const profile = response?.data?.profile || response?.data || response;

      set({
        surrogateProfile: profile,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Failed to create profile",
      });
      throw error;
    }
  },

  updateProfile: async (profileData: SurrogateProfileUpdate) => {
    try {
      set({ isLoading: true, error: null });

      const response = await updateSurrogateProfile(profileData);
      const profile = response?.data?.profile || response?.data || response;
      console.log("Profile from actions :", profile);

      set({
        surrogateProfile: profile,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      console.log("Profile from actions :", profileData);
      set({
        isLoading: false,
        error: error.response?.data?.message || "Failed to update profile",
      });
      throw error;
    }
  },

  fetchProfile: async (forceRefresh = false) => {
    const state = get();

    // Stale-while-revalidate: if cached data exists and not forced, show it
    // immediately while silently refreshing in the background
    if (state.surrogateProfile && !forceRefresh) {
      try {
        const response = await getSurrogateProfile();
        const profile = response?.profile || response;
        const medicalProfile = profile?.medical || null;
        set({
          surrogateProfile: profile,
          medicalProfile,
          error: null,
        });
        if (profile?.profilePicture) {
          useAuthStore.getState().setUser({
            avatar: profile.profilePicture,
            profilePictureUrl: profile.profilePicture,
          });
        }
      } catch (_) {
        // Silently keep stale data on background refresh failure
      }
      return;
    }

    try {
      set({ isLoading: !state.surrogateProfile, error: null });

      const response = await getSurrogateProfile();
      const profile = response?.profile || response;
      const medicalProfile = profile?.medical || null;

      set({
        surrogateProfile: profile,
        medicalProfile,
        isLoading: false,
        error: null,
      });

      if (profile?.profilePicture) {
        useAuthStore.getState().setUser({
          avatar: profile.profilePicture,
          profilePictureUrl: profile.profilePicture,
        });
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        set({ isLoading: false, error: null });
        return;
      }

      set({
        isLoading: false,
        error: error.response?.data?.message || "Failed to fetch profile",
      });
      throw error;
    }
  },

  updateMedicalProfile: async (medicalData: MedicalProfileUpdate) => {
    try {
      set({ isLoading: true, error: null });

      const response = await updateMedicalProfile(medicalData);
      const medicalProfile = response;

      set({
        medicalProfile: medicalProfile,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error:
          error.response?.data?.message || "Failed to update medical profile",
      });
      throw error;
    }
  },

  uploadEndometriumImage: async (imageData: FormData) => {
    try {
      set({ isLoading: true, error: null });

      const response = await uploadEndometriumImage(imageData);
      const medicalProfile = response;

      set({
        medicalProfile: medicalProfile,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error:
          error.response?.data?.message || "Failed to upload endometrium image",
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),

  setProfile: (profile: SurrogateProfile) => set({ surrogateProfile: profile }),

  setMedicalProfile: (medicalProfile: MedicalProfile) =>
    set({ medicalProfile: medicalProfile }),

  setHydrated: () => set({ _hydrated: true }),
});
