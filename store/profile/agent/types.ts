// stores/agent/agent.types.ts

export interface AgentSocials {
  facebook?: string;
  x?: string;
  instagram?: string;
  tiktok?: string;
}

export interface AgentPerformance {
  successfulMatches: number;
  averageRating: number;
  responseTime: string; // e.g., "1 hour"
  activeCases: number;
}

export interface AgentAdditionalDetails {
  languagesSpoken?: string;
  yearsOfExperience?: string;
  pregnancyHistory?: string;
}

export interface AgentServices {
  matchingGuidance?: boolean;
  legalOrMedicalCoordination?: boolean;
  emotionalSupport?: boolean;
  progressTracking?: boolean;
}

export interface AgentCertification {
  title: string;
  status: "Verified" | "Pending" | "Expired";
}

export interface AgentProfile {
  id: string;
  userName: string;
  fullName: string;
  dateOfBirth?: Date;
  countryOfResidence?: string;
  isAvailable: boolean;
  profilePicture?: string;
  avatar?: string; // <-- add this

  about?: string;
  performance?: AgentPerformance;
  additionalDetails?: AgentAdditionalDetails;
  socials?: AgentSocials;
  services?: AgentServices;
  certifications?: AgentCertification[];
  contactLocked?: boolean;
}


export interface AgentProfileState {
  agentProfile: AgentProfile | null;
  isLoading: boolean;
  error: string | null;
}

export interface AgentProfileActions {
  setAgentProfile: (profile: AgentProfile) => void;
  updateAgentProfile: (changes: Partial<AgentProfile>) => Promise<void>;
  clearAgentProfile: () => void;
}

export type AgentProfileStore = AgentProfileState & AgentProfileActions;
