import { useAgentProfileStore } from "@/store/profile/agent";

export const useAgentProfile = () => {
  const {
    agentProfile,
    isLoading,
    error,
    setAgentProfile,
    fetchAgentProfile,
    createAgentProfile,
    updateAgentProfile,
    clearAgentProfile,
  } = useAgentProfileStore();

  return {
    // State
    agentProfile,
    isLoading,
    error,

    // Actions
    setAgentProfile,
    fetchAgentProfile,
    createAgentProfile,
    updateAgentProfile,
    clearAgentProfile,
  };
};
