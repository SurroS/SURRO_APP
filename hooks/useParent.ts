import { useParentProfileStore } from "@/store/profile/parent";

export const useParentProfile = () => {
  const {
    parentProfile,
    savedSurrogates,
    matches,
    isLoading,
    error,
    fetchParentProfile,
    createParentProfile,
    updateParentProfile,
    updateParentMatchPreference,
    fetchParentMatches,
    saveParentSurrogate,
    removeSavedSurrogate,
    fetchSavedSurrogates,
    clearParentProfile,
  } = useParentProfileStore();

  return {
    parentProfile,
    savedSurrogates,
    matches,
    isLoading,
    error,
    fetchParentProfile,
    createParentProfile,
    updateParentProfile,
    updateParentMatchPreference,
    fetchParentMatches,
    saveParentSurrogate,
    removeSavedSurrogate,
    fetchSavedSurrogates,
    clearParentProfile,
  };
};
