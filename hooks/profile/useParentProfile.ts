// hooks/useParentProfile.ts
import { useState, useEffect } from "react";
import { getParentProfile, createParentProfile, updateParentSurrogateMatch } from "@/services/profileApi";

export const useParentProfile = () => {
  const [parentProfile, setParentProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getParentProfile();
      setParentProfile(res.data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch profile");
    } finally {
      setIsLoading(false);
    }
  };

  const createProfile = async (data: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await createParentProfile(data);
      setParentProfile(res.data);
    } catch (err: any) {
      setError(err.message || "Failed to create profile");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await updateParentSurrogateMatch(data);
      setParentProfile(res.data);
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    parentProfile,
    isLoading,
    error,
    fetchProfile,
    createProfile,
    updateProfile,
    setParentProfile,
  };
};
