import { useParentProfileStore } from "@/store/profile/parent";

export const useParentProfile = () => {
  const {
    parentProfile,
    isLoading,
    error,
    fetchParentProfile,
    createParentProfile,
    updateParentProfile,
    saveParentSurrogate,
    updateParentMatchPreference,
    clearParentProfile,
  } = useParentProfileStore();

  return {
    parentProfile,
    isLoading,
    error,
    fetchParentProfile,
    createParentProfile,
    updateParentProfile,
    saveParentSurrogate,
    updateParentMatchPreference,
    clearParentProfile,
  };
};
