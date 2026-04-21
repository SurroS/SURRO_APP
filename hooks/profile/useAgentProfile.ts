// hooks/useAgentProfile.ts
import { useState, useEffect } from "react";
import {
  getAgentProfile,
  createAgentProfile,
  updateAgentProfile,
} from "@/services/profileApi";
import { useAuth } from "@/hooks/useAuth";

export const useAgentProfile = () => {
  const { user } = useAuth();
  const [agentProfile, setAgentProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const userId = user?.id;
  console.log("user:", user);
  console.log("userID:", userId);
  // -------------------------
  // FETCH PROFILE
  // -------------------------
  const fetchProfile = async () => {
    console.log("[AgentProfile] Fetching profile...");
    setIsLoading(true);
    setError(null);

    try {
      const res = await getAgentProfile();
      console.log("[AgentProfile] Fetch success:", res);
      setAgentProfile(res?.profile || res);
      console.log("response data", res);
    } catch (err: any) {
      console.log("user id from", userId);
      console.error("[AgentProfile] Fetch failed:", err?.response?.data || err);

      // If profile not found (404), set to null - profile doesn't exist yet
      if (err?.response?.status === 404) {
        setAgentProfile(null);
        setError(null);
      } else {
        setError(
          err?.response?.data?.message ||
            err.message ||
            "Failed to fetch profile",
        );
      }
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
      console.log("[AgentProfile] Create success:", res);
      setAgentProfile(res?.profile || res);
      return res;
    } catch (err: any) {
      console.error(
        "[AgentProfile] Create failed:",
        err?.response?.data || err,
      );
      setError(
        err?.response?.data?.message ||
          err.message ||
          "Failed to create profile",
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
      console.log("[AgentProfile] Update success:", res);
      setAgentProfile(res?.profile || res);
      return res;
    } catch (err: any) {
      console.error(
        "[AgentProfile] Update failed:",
        err?.response?.data || err,
      );
      setError(
        err?.response?.data?.message ||
          err.message ||
          "Failed to update profile",
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
    fetchAgentProfile: fetchProfile,
    createProfile,
    updateProfile,
    updateAgentProfile,
    setAgentProfile,
  };
};
