// stores/agent/agent.types.ts

export interface AgentCertification {
  name: string;
  valid: string; // e.g., "2025-12-31"
}

export interface AgentPerformance {
  matches: number;
  rating: number;
  responseTime: string; // e.g., "1 hour"
  activeCases: number;
}

export interface AgentProfile {
  id: string;
  userName?: string;
  fullName?: string;
  dateOfBirth?: string;
  country?: string;
  about?: string;
  isAvailable?: boolean;
  contactLocked?: boolean;
  profilePicture?: string;
  avatar?: string;

  // Social profiles
  facebookProfile?: string;
  instagramProfile?: string;
  twitterProfile?: string;
  threadsProfile?: string;

  // Compensation
  compensation?: string;
  negotiable?: string;

  // Contact info
  phone1?: string;
  phone2?: string;
  emergencyPhone?: string;
  publicEmail?: string;

  // Location
  state?: string;
  city?: string;
  address?: string;

  // Skills & experience
  languages?: string[];
  services?: string[];
  certifications?: AgentCertification[];
  performance?: AgentPerformance;

  // Legacy fields for compatibility
  name?: string;
  age?: string | number;
}

export interface AgentProfileState {
  agentProfile: AgentProfile | null;
  isLoading: boolean;
  error: string | null;
}

export interface AgentProfileActions {
  setAgentProfile: (profile: AgentProfile) => void;
  fetchAgentProfile: () => Promise<void>;
  createAgentProfile: (data: Partial<AgentProfile>) => Promise<void>;
  updateAgentProfile: (changes: Partial<AgentProfile>) => Promise<void>;
  clearAgentProfile: () => void;
}

export type AgentProfileStore = AgentProfileState & AgentProfileActions;
