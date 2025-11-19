import { useProfileStore } from "@/store/profile/surrogate";

export const useProfile = () => {
  const {
    surrogateProfile,
    medicalProfile,
    isLoading,
    error,
    createProfile,
    updateProfile,
    fetchProfile,
    updateMedicalProfile,
    uploadEndometriumImage,
    clearError,
    setProfile,
    setMedicalProfile,
  } = useProfileStore();

  return {
    // State
    surrogateProfile,
    medicalProfile,
    isLoading,
    error,

    // Actions
    createProfile,
    updateProfile,
    fetchProfile,
    updateMedicalProfile,
    uploadEndometriumImage,
    clearError,
    setProfile,
    setMedicalProfile,
  };
};
