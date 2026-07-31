import { useState, useCallback } from "react";
import {
  getSurrogateProfile,
  createSurrogateProfile,
  updateSurrogateProfile,
} from "@/services/profileApi";
import { SurrogateProfile, SurrogateProfileUpdate } from "@/types/profile";
import { useAuthStore } from "@/store/auth";
import { resolveProfilePicture } from "@/utils/resolveMediaUrl";

let cachedProfile: SurrogateProfile | null = null;

type SurrogateUpdatePayload = Partial<SurrogateProfileUpdate>;

export const useSurrogateProfile = () => {
  const [surrogateProfile, setSurrogateProfile] =
    useState<SurrogateProfile | null>(cachedProfile);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // -------------------------
  // FETCH PROFILE (CACHED)
  // -------------------------
  const fetchProfile = useCallback(async (forceRefresh = false) => {
    if (cachedProfile && !forceRefresh) {
      setSurrogateProfile(cachedProfile);
      return cachedProfile;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await getSurrogateProfile();
      cachedProfile = res?.profile || res;
      if (cachedProfile?.profilePicture) {
        cachedProfile.profilePicture = resolveProfilePicture(cachedProfile.profilePicture);
      }
      setSurrogateProfile(cachedProfile);
      if (cachedProfile?.profilePicture) {
        useAuthStore.getState().setUser({
          avatar: cachedProfile.profilePicture,
          profilePictureUrl: cachedProfile.profilePicture,
        });
      }
      return cachedProfile;
    } catch (err: any) {
      const msg = err?.message || "Failed to fetch profile";
      console.error("[SurrogateProfile] Fetch error:", msg);
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // -------------------------
  // CREATE
  // -------------------------
  const createProfile = async (data: SurrogateProfileUpdate) => {
    cachedProfile = null;
    setIsLoading(true);
    try {
      const res = await createSurrogateProfile(data);
      cachedProfile = res?.profile || res;
      if (cachedProfile?.profilePicture) {
        cachedProfile.profilePicture = resolveProfilePicture(cachedProfile.profilePicture);
      }
      setSurrogateProfile(cachedProfile);
      return cachedProfile;
    } finally {
      setIsLoading(false);
    }
  };
  // -------------------------
  // UPDATE PROFILE (PATCH)
  // -------------------------
  const updateProfile = async (data: SurrogateUpdatePayload) => {
    setIsLoading(true);
    try {
      const res = await updateSurrogateProfile(data);
      const updated = res?.profile || res;
      if (updated?.profilePicture) {
        updated.profilePicture = resolveProfilePicture(updated.profilePicture);
      }
      cachedProfile = { ...cachedProfile, ...updated };
      setSurrogateProfile(cachedProfile);
      return cachedProfile;
    } finally {
      setIsLoading(false);
    }
  };

  // -------------------------
  // TOGGLE AVAILABILITY (SAFE)
  // -------------------------
  const toggleAvailability = async (next: boolean) => {
    if (!cachedProfile?.id) return;
    await updateProfile({ isAvailable: next });
  };

  return {
    surrogateProfile,
    createProfile,
    isLoading,
    error,
    fetchProfile,
    fetchSurrogateProfile: fetchProfile,
    updateProfile,
    updateSurrogateProfile: updateProfile,
    toggleAvailability,
  };
};
