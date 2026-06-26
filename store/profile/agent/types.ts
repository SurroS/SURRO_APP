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
  userId?: string;
  fullName?: string;
  userName?: string;
  dateOfBirth?: string;
  location?: string;
  specialization?: string;
  country?: string;
  about?: string;
  profilePicture?: string;
  isAvailable?: boolean;
  contactLocked?: boolean;
  facebookProfile?: string;
  instagramProfile?: string;
  twitterProfile?: string;
  threadsProfile?: string;
  compensation?: number;
  negotiable?: boolean;
  phone1: string | null | undefined;
  phone2: string | null | undefined;
  emergencyPhone: string | null | undefined;
  publicEmail?: string;
  state?: string;
  city?: string;
  address?: string;
  languages?: string[];
  services?: string[];
  certifications?: { title: string; status: "Verified" | "Pending" | "Expired" }[];
  additionalDetails?: AgentAdditionalDetails;
  performance?: AgentPerformance;
  age?: number;
  gallery?: string[];
  createdAt?: string;
  updatedAt?: string;
  user?: {
    id: string;
    email: string;
    role: string;
    isVerified: boolean;
    isApproved: boolean;
    kycStatus: string;
    referralCode?: string;
  };
  wallet: Wallet;
  subscription?: any;
  subscriptionStatus?: string;
  // deprecated fields kept for backward compat
  firstName?: string;
  lastName?: string;
  countryOfOrigin?: string;
  aboutMe?: string;
  maritalStatus?: string;
  height?: string;
  weight?: string;
  numberOfChildren?: number;
  countryOfResidence?: string;
  stateOfOrigin?: string;
  zipCode?: string;
  emergencyContactPhone?: string;
  emergencyContactRelation?: string;
  termsAcceptedAt?: string;
  lga?: string;
  stateOfResidence?: string;
  socials?: AgentSocials;
  avatar?: string;
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
