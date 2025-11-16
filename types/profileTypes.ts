import { Surrogate } from "@/types/surrogate";
import { Agent } from "@/types/agent";

export type ProfileType = "SURROGATE" | "AGENT";

export interface LockedProfileViewProps {
  type: ProfileType;
  data: Surrogate | Agent;
  isUnlocked: boolean;
  onRequestUnlock: () => void; // Trigger payment flow
}