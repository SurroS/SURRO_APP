import { useState, useCallback } from "react";
import {
  getParentProfile,
  createParentProfile,
  updateParentProfile,
  saveParentSurrogateMatch,
  deleteSavedParentSurrogateMatch,
  GetsavedParentSurrogateMatch,
  updateParentMatchPreference,
} from "@/services/profileApi";
import { useAuthStore } from "@/store/auth";
import { resolveProfilePicture } from "@/utils/resolveMediaUrl";

let cachedProfile: any = null;

export const useParentProfile = () => {
  const [parentProfile, setParentProfile] = useState<any>(cachedProfile);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // -------------------------
  // FETCH (CACHED)
  // -------------------------
  const fetchProfile = useCallback(async (forceRefresh = false) => {
    if (cachedProfile && !forceRefresh) {
      setParentProfile(cachedProfile);
      try {
        const res = await getParentProfile();
        console.log("[ParentProfile] SWR refresh raw:", JSON.stringify(res).slice(0, 500));
        const fresh = res?.profile || res;
        fresh.profilePicture = resolveProfilePicture(fresh.profilePicture);
        cachedProfile = { ...cachedProfile, ...fresh };
        setParentProfile(cachedProfile);
        if (cachedProfile?.profilePicture) {
          useAuthStore.getState().setUser({
            avatar: cachedProfile.profilePicture,
            profilePictureUrl: cachedProfile.profilePicture,
          });
        }
      } catch (_) {}
      return cachedProfile;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await getParentProfile();
      console.log("[ParentProfile] Fetch raw response:", JSON.stringify(res).slice(0, 500));
      const fresh = res?.profile || res;
      // resolve relative profile picture URL
      fresh.profilePicture = resolveProfilePicture(fresh.profilePicture);
      // preserve social fields that backend doesn't return on GET
      cachedProfile = {
        ...cachedProfile,
        ...fresh,
      };
      setParentProfile(cachedProfile);
      console.log("[ParentProfile] Cached profile keys:", Object.keys(cachedProfile || {}).join(", "));
      if (cachedProfile?.profilePicture) {
        useAuthStore.getState().setUser({
          avatar: cachedProfile.profilePicture,
          profilePictureUrl: cachedProfile.profilePicture,
        });
      }
      return cachedProfile;
    } catch (err: any) {
      const msg = err?.message || "Failed to fetch profile";
      console.error("[ParentProfile] Fetch error:", msg);
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);
  // -------------------------
  // CREATE
  // -------------------------
  const createProfile = async (data: any) => {
    cachedProfile = null;
    setIsLoading(true);
    console.log("[ParentProfile] Creating profile...");
    try {
      const res = await createParentProfile(data);
      console.log("[ParentProfile] Create success:", JSON.stringify(res).slice(0, 200));
      cachedProfile = res?.profile || res;
      setParentProfile(res?.profile || res);
      return res;
    } finally {
      setIsLoading(false);
    }
  };

  // -------------------------
  // UPDATE (PARTIAL)
  // -------------------------
  const updateProfile = async (data: Partial<any>) => {
    setIsLoading(true);
    console.log("[ParentProfile] Updating profile...");
    try {
      const res = await updateParentProfile(data);
      console.log("[ParentProfile] Update raw response:", JSON.stringify(res).slice(0, 500));
      const updated = res?.profile || res;
      cachedProfile = { ...cachedProfile, ...updated };
      setParentProfile(cachedProfile);
      return res;
    } finally {
      setIsLoading(false);
    }
  };

  // -------------------------
  // SAVE SURROGATE MATCH
  // -------------------------
  const saveParentSurrogate = async (surrogateData: any) => {
    setIsLoading(true);
    try {
      const res = await saveParentSurrogateMatch(surrogateData);
      return res;
    } finally {
      setIsLoading(false);
    }
  };

  const updateMatchPreference = async (preferenceData: any) => {
    setIsLoading(true);
    try {
      const res = await updateParentMatchPreference(preferenceData);
      return res;
    } finally {
      setIsLoading(false);
    }
  };

  // -------------------------
  // REMOVE SAVED SURROGATE
  // -------------------------
  const removeSavedSurrogate = async (surrogateId: string) => {
    setIsLoading(true);
    try {
      return await deleteSavedParentSurrogateMatch(surrogateId);
    } finally {
      setIsLoading(false);
    }
  };

  // -------------------------
  // FETCH SAVED SURROGATES
  // -------------------------
  const fetchSavedSurrogates = async () => {
    const res = await GetsavedParentSurrogateMatch({});
    const raw = Array.isArray(res) ? res : res?.data ?? res?.results ?? [];
    console.log("[ParentProfile] Saved surrogates:", raw.length);
    return raw;
  };

  return {
    parentProfile,
    isLoading,
    error,
    fetchProfile,
    fetchParentProfile: fetchProfile,
    createProfile,
    updateProfile,
    updateParentProfile: updateProfile,
    saveParentSurrogate,
    removeSavedSurrogate,
    fetchSavedSurrogates,
    updateMatchPreference,
  };
};
