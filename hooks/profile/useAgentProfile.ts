// hooks/useAgentProfile.ts
import { useState, useEffect } from "react";
import { getAgentProfile, createAgentProfile, updateAgentProfile } from "@/services/profileApi";

export const useAgentProfile = () => {
  const [agentProfile, setAgentProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getAgentProfile();
      setAgentProfile(res.data);
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
      const res = await createAgentProfile(data);
      setAgentProfile(res.data);
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
      const res = await updateAgentProfile(data);
      setAgentProfile(res.data);
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
    agentProfile,
    isLoading,
    error,
    fetchProfile,
    createProfile,
    updateProfile,
    setAgentProfile,
  };
};
