import { useState } from "react";
import {
  getSurrogateProfile,
  createSurrogateProfile,
  updateSurrogateProfile,
} from "@/services/profileApi";
import { SurrogateProfile, SurrogateProfileUpdate } from "@/types/profile";

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
  const fetchProfile = async (forceRefresh = false) => {
    if (cachedProfile && !forceRefresh) {
      setSurrogateProfile(cachedProfile);
      return cachedProfile;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await getSurrogateProfile();
      cachedProfile = res?.profile || res;
      setSurrogateProfile(cachedProfile);
      return cachedProfile;
    } catch (err: any) {
      setError(err?.message || "Failed to fetch profile");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // -------------------------
  // CREATE
  // -------------------------
  const createProfile = async (data: SurrogateProfileUpdate) => {
    cachedProfile = null;
    setIsLoading(true);
    try {
      const res = await createSurrogateProfile(data);
      cachedProfile = res?.profile || res;
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
    cachedProfile = null;
    setIsLoading(true);
    try {
      const res = await updateSurrogateProfile(data);
      cachedProfile = res?.profile || res;
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
