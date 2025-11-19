import { ProfileState } from "./actions";

export interface ProfileActions {
  // Surrogate Profile Actions
  createProfile: (profileData: any) => Promise<void>;
  updateProfile: (profileData: any) => Promise<void>;
  fetchProfile: () => Promise<void>;

  // Medical Profile Actions
  updateMedicalProfile: (medicalData: any) => Promise<void>;
  uploadEndometriumImage: (imageData: FormData) => Promise<void>;

  // Utility Actions
  clearError: () => void;
  setProfile: (profile: any) => void;
  setMedicalProfile: (medicalProfile: any) => void;
}

export type ProfileStore = ProfileState & ProfileActions;
