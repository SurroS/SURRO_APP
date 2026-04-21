// hooks/useParentProfile.ts
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
      setParentProfile(cachedProfile);
      return cachedProfile;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await getParentProfile();
      cachedProfile = res?.profile || res;
      setParentProfile(cachedProfile);
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
    cachedProfile = null;
    setIsLoading(true);
    try {
      const res = await createParentProfile(data);
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
    cachedProfile = null;
    setIsLoading(true);
    try {
      const res = await updateParentProfile(data);
      cachedProfile = res?.profile || res;
      setParentProfile(res?.profile || res);
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
