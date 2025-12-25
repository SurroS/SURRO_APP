import { useState } from "react";
import {
  getSurrogateProfile,
  createSurrogateProfile,
  updateSurrogateProfile,
} from "@/services/profileApi";
import { SurrogateProfileUpdate } from "@/types/profile";

let cachedProfile: any = null;

type SurrogateUpdatePayload = Partial<SurrogateProfileUpdate>;

export const useSurrogateProfile = () => {
  const [surrogateProfile, setSurrogateProfile] = useState<any>(cachedProfile);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // -------------------------
  // FETCH PROFILE (CACHED)
  // -------------------------
  const fetchProfile = async () => {
    if (cachedProfile) {
      setSurrogateProfile(cachedProfile);
      return cachedProfile;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await getSurrogateProfile();
      cachedProfile = res.data.profile;
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
  const createProfile = async (data: any) => {
    setIsLoading(true);
    try {
      const res = await createSurrogateProfile(data);
      cachedProfile = res.data;
      setSurrogateProfile(res.data);
      return res.data;
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
      cachedProfile = res.data;
      setSurrogateProfile(res.data);
      return res.data;
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
    updateProfile,
    toggleAvailability,
  };
};
