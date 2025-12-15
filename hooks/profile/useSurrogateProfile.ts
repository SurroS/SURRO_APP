// hooks/useSurrogateProfile.ts
import { useState, useEffect } from "react";
import { useSurrogateStore } from "@/store/allUsers";
import {
  getSurrogateProfile,
  createSurrogateProfile,
  updateSurrogateProfile,
} from "@/services/profileApi";
import { SurrogateProfileUpdate } from "@/types/profile";

export const useSurrogateProfile = () => {
  const [surrogateProfile, setSurrogateProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getSurrogateProfile();
      setSurrogateProfile(res.data);
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
      const res = await createSurrogateProfile(data);
      setSurrogateProfile(res.data);
    } catch (err: any) {
      setError(err.message || "Failed to create profile");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: SurrogateProfileUpdate) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await updateSurrogateProfile(data);
      setSurrogateProfile(res.data);
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
    surrogateProfile,
    isLoading,
    error,
    fetchProfile,
    createProfile,
    updateProfile,
    setSurrogateProfile,
  };
};
