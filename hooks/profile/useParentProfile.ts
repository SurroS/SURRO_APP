// hooks/useParentProfile.ts
import { useState } from "react";
import {
  getParentProfile,
  createParentProfile,
  updateParentProfile,
} from "@/services/profileApi";

let cachedProfile: any = null;

export const useParentProfile = () => {
  const [parentProfile, setParentProfile] = useState<any>(cachedProfile);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // -------------------------
  // FETCH (CACHED)
  // -------------------------
  const fetchProfile = async () => {
    if (cachedProfile) {
      setParentProfile(cachedProfile);
      return cachedProfile;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await getParentProfile();
      cachedProfile = res.data;
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
    setIsLoading(true);
    try {
      const res = await createParentProfile(data);
      cachedProfile = res.data;
      setParentProfile(res.data);
      return res.data;
    } finally {
      setIsLoading(false);
    }
  };

  // -------------------------
  // UPDATE (PARTIAL)
  // -------------------------
  const updateProfile = async (data: Partial<any>) => {
    setIsLoading(true);
    try {
      const res = await updateParentProfile(data);
      cachedProfile = res.data;
      setParentProfile(res.data);
      return res.data;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    parentProfile,
    isLoading,
    error,
    fetchProfile,
    createProfile,
    updateProfile,
  };
};
