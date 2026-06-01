import { useState } from "react";
import {
  getParentProfile,
  createParentProfile,
  updateParentProfile,
  saveParentSurrogateMatch,
  updateParentMatchPreference,
} from "@/services/profileApi";

let cachedProfile: any = null;

export const useParentProfile = () => {
  const [parentProfile, setParentProfile] = useState<any>(cachedProfile);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // -------------------------
  // FETCH (CACHED)
  // -------------------------
  const fetchProfile = async (forceRefresh = false) => {
    if (cachedProfile && !forceRefresh) {
      console.log("[ParentProfile] Using cached profile");
      setParentProfile(cachedProfile);
      return cachedProfile;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log("[ParentProfile] Fetching profile from API...");
      const res = await getParentProfile();
      console.log("[ParentProfile] API response:", JSON.stringify(res).slice(0, 400));
      cachedProfile = res?.profile || res;
      setParentProfile(cachedProfile);
      console.log("[ParentProfile] Profile loaded:", cachedProfile ? "YES" : "NO");
      return cachedProfile;
    } catch (err: any) {
      const msg = err?.message || "Failed to fetch profile";
      console.error("[ParentProfile] Fetch error:", msg);
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

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
      console.log("[ParentProfile] Update success:", JSON.stringify(res).slice(0, 200));
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
    updateMatchPreference,
  };
};
