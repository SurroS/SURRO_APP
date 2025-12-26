// stores/agent/agent.types.ts

export interface Agent {
  id: string;
  name: string;
  location: string;
  specialization?: string;
}

export interface AgentListState {
  agents: Agent[];
  isLoading: boolean;
  error: string | null;
}

export interface AgentSocials {
  facebook?: string;
  x?: string;
  instagram?: string;
  tiktok?: string;
}
export interface AgentProfileState {
  agentProfile?: AgentProfile | null;
  agents?: AgentProfile[]; // <-- added for list caching / previews
  isLoading: boolean;
  error: string | null;
}

export interface AgentPerformance {
  successfulMatches: number;
  averageRating: number;
  responseTime: string;
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
  firstName?: string;
  lastName?: string;
  userName?: string;
  countryOfOrigin?: string;
  aboutMe?: string;
  dateOfBirth?: string;
  maritalStatus?: string;
  height?: string;
  weight?: string;
  profilePicture?: string;
  numberOfChildren?: number;
  countryOfResidence?: string;
  stateOfOrigin?: string;
  address?: string;
  zipCode?: string;
  phone1: string | null | undefined;
  phone2: string | null | undefined;
  emergencyContactPhone: string | null | undefined;
  emergencyContactRelation?: string;
  facebookProfile?: string;
  instagramProfile?: string;
  twitterProfile?: string;
  threadsProfile?: string;
  isAvailable?: boolean;
  termsAcceptedAt?: string;
  lga: string;
  stateOfResidence: string;
  performance?: AgentPerformance;
  additionalDetails?: AgentAdditionalDetails;
  socials?: AgentSocials;
  services?: AgentServices;
  certifications?: AgentCertification[];
  contactLocked?: boolean;
  wallet: Wallet;
}
export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  currency: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AgentProfileActions {
  setAgentProfile: (profile: AgentProfile) => void;
  updateAgentProfile: (changes: Partial<AgentProfile>) => Promise<void>;
  clearAgentProfile: () => void;

  // list actions
  setAgents: (data: AgentProfile[]) => void;
  fetchAgents: (showToast?: boolean) => Promise<void>;
  setLoading: (val: boolean) => void;
  setError: (err: string | null) => void;
}

export type AgentProfileStore = AgentProfileState & AgentProfileActions;
