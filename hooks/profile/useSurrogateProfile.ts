import { useState, useCallback } from "react";
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
  const fetchProfile = useCallback(async (forceRefresh = false) => {
    if (cachedProfile && !forceRefresh) {
      console.log("[SurrogateProfile] Using cached profile");
      setSurrogateProfile(cachedProfile);
      return cachedProfile;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log("[SurrogateProfile] Fetching profile from API...");
      const res = await getSurrogateProfile();
      console.log("[SurrogateProfile] API response:", JSON.stringify(res).slice(0, 400));
      cachedProfile = res?.profile || res;
      setSurrogateProfile(cachedProfile);
      console.log("[SurrogateProfile] Profile loaded:", cachedProfile ? "YES" : "NO");
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
    console.log("[SurrogateProfile] Creating profile...");
    try {
      const res = await createSurrogateProfile(data);
      console.log("[SurrogateProfile] Create success:", JSON.stringify(res).slice(0, 200));
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
    setIsLoading(true);
    console.log("[SurrogateProfile] Updating profile...");
    try {
      const res = await updateSurrogateProfile(data);
      console.log("[SurrogateProfile] Update success:", JSON.stringify(res).slice(0, 200));
      const updated = res?.profile || res;
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
