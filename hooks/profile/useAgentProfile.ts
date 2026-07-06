import { useState, useCallback } from "react";
import {
  getAgentProfile,
  createAgentProfile,
  updateAgentProfile,
} from "@/services/profileApi";
import { useAuthStore } from "@/store/auth";
import { resolveProfilePicture } from "@/utils/resolveMediaUrl";

let cachedAgentProfile: any = null;

export const useAgentProfile = () => {
  const [agentProfile, setAgentProfile] = useState<any>(cachedAgentProfile);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // -------------------------
  // FETCH PROFILE
  // -------------------------
  const fetchProfile = useCallback(async () => {
    if (cachedAgentProfile) {
      // Stale-while-revalidate: show cached immediately, refresh silently
      setAgentProfile(cachedAgentProfile);
      try {
        const res = await getAgentProfile();
        const profile = res?.profile || res;
        if (profile?.profilePicture) {
          profile.profilePicture = resolveProfilePicture(profile.profilePicture);
        }
        cachedAgentProfile = profile;
        setAgentProfile(profile);
      } catch (_) {
        // Keep stale data on background refresh failure
      }
      return cachedAgentProfile;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await getAgentProfile();
      const profile = res?.profile || res;
      if (profile?.profilePicture) {
        profile.profilePicture = resolveProfilePicture(profile.profilePicture);
      }
      // normalize gallery to simple string[] of urls for UI
      try {
        if (Array.isArray(profile?.gallery)) {
          profile._galleryUrls = profile.gallery
            .map((it: any) => (typeof it === "string" ? it : it?.url || null))
            .filter(Boolean);
        } else {
          profile._galleryUrls = [];
        }
      } catch (e) {
        profile._galleryUrls = [];
      }
      cachedAgentProfile = profile;
      setAgentProfile(profile);
      if (profile?.profilePicture) {
        useAuthStore.getState().setUser({
          avatar: profile.profilePicture,
          profilePictureUrl: profile.profilePicture,
        });
      }
      return profile;
    } catch (err: any) {
      const serverMsg = err?.response?.data?.message || err.message;
      console.error("[AgentProfile] Fetch error:", serverMsg);

      if (err?.response?.status === 404) {
        cachedAgentProfile = null;
        setAgentProfile(null);
        setError(null);
      } else {
        setError(serverMsg || "Failed to fetch profile");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // -------------------------
  // CREATE PROFILE
  // -------------------------
  const createProfile = async (data: any) => {
    setIsLoading(true);
    setError(null);

    try {
      await createAgentProfile(data);
      const res = await getAgentProfile();
      const profile = res?.profile || res;
      if (profile?.profilePicture) {
        profile.profilePicture = resolveProfilePicture(profile.profilePicture);
      }
      try {
        if (Array.isArray(profile?.gallery)) {
          profile._galleryUrls = profile.gallery
            .map((it: any) => (typeof it === "string" ? it : it?.url || null))
            .filter(Boolean);
        } else {
          profile._galleryUrls = [];
        }
      } catch (e) {
        profile._galleryUrls = [];
      }
      cachedAgentProfile = profile;
      setAgentProfile(profile);
      return profile;
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
    setIsLoading(true);
    setError(null);

    try {
      await updateAgentProfile(data);
      const res = await getAgentProfile();
      const profile = res?.profile || res;
      if (profile?.profilePicture) {
        profile.profilePicture = resolveProfilePicture(profile.profilePicture);
      }
      try {
        if (Array.isArray(profile?.gallery)) {
          profile._galleryUrls = profile.gallery
            .map((it: any) => (typeof it === "string" ? it : it?.url || null))
            .filter(Boolean);
        } else {
          profile._galleryUrls = [];
        }
      } catch (e) {
        profile._galleryUrls = [];
      }
      cachedAgentProfile = profile;
      setAgentProfile(profile);
      return profile;
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
