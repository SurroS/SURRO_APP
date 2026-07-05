export interface AgentSocials {
  facebook?: string;
  x?: string;
  instagram?: string;
  tiktok?: string;
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

export interface AgentPerformance {
  successfulMatches: number;
  averageRating: number;
  responseTime: string;
  activeCases: number;
}

export interface CoverageAreas {
  countries?: string[];
  states?: string[];
  LGAs?: string[];
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
  certifications?: AgentCertification[];
  additionalDetails?: AgentAdditionalDetails;
  performance?: AgentPerformance;
  coverageAreas?: CoverageAreas;
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
  wallet: {
    id: string;
    userId: string;
    balance: number;
    currency: string;
    createdAt?: string;
    updatedAt?: string;
  };
  subscription?: any;
  subscriptionStatus?: string;
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
  name?: string;
}
