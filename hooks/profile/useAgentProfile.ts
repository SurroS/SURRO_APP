import { useState } from "react";
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
    console.log("[AgentProfile] Fetching profile from API...");
    setIsLoading(true);
    setError(null);

    try {
      const res = await getAgentProfile();
      console.log("[AgentProfile] API response:", JSON.stringify(res).slice(0, 400));
      const profile = res?.profile || res;
      setAgentProfile(profile);
      console.log("[AgentProfile] Profile loaded:", profile ? "YES" : "NO");
      return profile;
    } catch (err: any) {
      const serverMsg = err?.response?.data?.message || err.message;
      console.error("[AgentProfile] Fetch error:", serverMsg);

      if (err?.response?.status === 404) {
        setAgentProfile(null);
        setError(null);
      } else {
        setError(serverMsg || "Failed to fetch profile");
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
    console.log("[AgentProfile] Creating profile...");
    setIsLoading(true);
    setError(null);

    try {
      const res = await createAgentProfile(data);
      console.log("[AgentProfile] Create success:", JSON.stringify(res).slice(0, 200));
      setAgentProfile(res?.profile || res);
      return res;
    } catch (err: any) {
      const serverMsg = err?.response?.data?.message || err.message;
      console.error("[AgentProfile] Create error:", serverMsg);
      setError(serverMsg || "Failed to create profile");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // -------------------------
  // UPDATE PROFILE
  // -------------------------
  const updateProfile = async (data: any) => {
    console.log("[AgentProfile] Updating profile...");
    setIsLoading(true);
    setError(null);

    try {
      const res = await updateAgentProfile(data);
      console.log("[AgentProfile] Update success:", JSON.stringify(res).slice(0, 200));
      setAgentProfile(res?.profile || res);
      return res;
    } catch (err: any) {
      const serverMsg = err?.response?.data?.message || err.message;
      console.error("[AgentProfile] Update error:", serverMsg);
      setError(serverMsg || "Failed to update profile");
      throw err;
    } finally {
      setIsLoading(false);
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
    updateAgentProfile: updateProfile,
    setAgentProfile,
  };
};
