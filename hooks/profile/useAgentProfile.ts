// hooks/useAgentProfile.ts
import { useState, useEffect } from "react";
import {
  getAgentProfile,
  createAgentProfile,
  updateAgentProfile,
} from "@/services/profileApi";

export const useAgentProfile = () => {
  const [agentProfile, setAgentProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // -------------------------
  // FETCH PROFILE
  // -------------------------
  const fetchProfile = async () => {
    console.log("[AgentProfile] Fetching profile...");
    setIsLoading(true);
    setError(null);

    try {
      const res = await getAgentProfile();
      console.log("[AgentProfile] Fetch success:", res?.data);
      setAgentProfile(res.data);
    } catch (err: any) {
      console.error(
        "[AgentProfile] Fetch failed:",
        err?.response?.data || err
      );
      setError(
        err?.response?.data?.message ||
          err.message ||
          "Failed to fetch profile"
      );
    } finally {
      setIsLoading(false);
      console.log("[AgentProfile] Fetch done");
    }
  };

  // -------------------------
  // CREATE PROFILE
  // -------------------------
  const createProfile = async (data: any) => {
    console.log("[AgentProfile] Creating profile with data:", data);
    setIsLoading(true);
    setError(null);

    try {
      const res = await createAgentProfile(data);
      console.log("[AgentProfile] Create success:", res?.data);
      setAgentProfile(res.data);
      return res.data;
    } catch (err: any) {
      console.error(
        "[AgentProfile] Create failed:",
        err?.response?.data || err
      );
      setError(
        err?.response?.data?.message ||
          err.message ||
          "Failed to create profile"
      );
      throw err;
    } finally {
      setIsLoading(false);
      console.log("[AgentProfile] Create done");
    }
  };

  // -------------------------
  // UPDATE PROFILE
  // -------------------------
  const updateProfile = async (data: any) => {
    console.log("[AgentProfile] Updating profile with data:", data);
    setIsLoading(true);
    setError(null);

    try {
      const res = await updateAgentProfile(data);
      console.log("[AgentProfile] Update success:", res?.data);
      setAgentProfile(res.data);
      return res.data;
    } catch (err: any) {
      console.error(
        "[AgentProfile] Update failed:",
        err?.response?.data || err
      );
      setError(
        err?.response?.data?.message ||
          err.message ||
          "Failed to update profile"
      );
      throw err;
    } finally {
      setIsLoading(false);
      console.log("[AgentProfile] Update done");
    }
  };


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
