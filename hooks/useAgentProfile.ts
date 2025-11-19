import { useAgentProfileStore } from "@/store/profile/agent";

export const useAgentProfile = () => {
  const {
    agentProfile,
    isLoading,
    error,
    setAgentProfile,
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
    updateAgentProfile,
    clearAgentProfile,
  };
};
