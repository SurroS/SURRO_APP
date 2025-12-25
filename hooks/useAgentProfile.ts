// hooks/useAgentProfile.ts
import { useAgentProfileStore } from "@/store/profile/agent";
import { AgentProfile } from "@/store/profile/agent/types";
import { getAgentProfile } from "@/services/profileApi";

export const useAgentProfile = () => {
  const {
    agentProfile,
    isLoading,
    error,
    setAgentProfile,
    updateAgentProfile,
    clearAgentProfile,
  } = useAgentProfileStore();

  /** Fetch agent profile */
  const fetchAgentProfile = async () => {
    const res = await getAgentProfile();
    setAgentProfile(res.data);
  };

  /** Generic alias for shared UI */
  const updateProfile = async (changes: Partial<AgentProfile>) => {
    return updateAgentProfile(changes);
  };

  return {
    // state
    agentProfile,
    isLoading,
    error,

    // actions
    fetchAgentProfile ,        
    updateProfile,       
    updateAgentProfile, 
    setAgentProfile,
    clearAgentProfile,
  };
};
