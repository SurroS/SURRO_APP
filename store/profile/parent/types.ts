export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  currency: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ParentProfile {
  firstName?: string;
  lastName?: string;
  userName?: string;
  countryOfOrigin?: string;
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
  lga: string;
  phone1: string | null | undefined;
  phone2: string | null | undefined;
  emergencyContactPhone: string | null | undefined;
  stateOfResidence: string;
  emergencyContactRelation?: string;
  facebookProfile?: string;
  instagramProfile?: string;
  twitterProfile?: string;
  threadsProfile?: string;
  isAvailable?: boolean;
  termsAcceptedAt?: string;
  id: string;
  fullName: string;
  yearsOfTrying?: number;
  aboutMe?: string;
  languagesSpoken?: string[];
  wallet?: Wallet;
}

export interface ParentProfileState {
  parentProfile: ParentProfile | null;
  isLoading: boolean;
  error: string | null;
}

export interface ParentProfileActions {
  setParentProfile: (profile: ParentProfile | null) => void;
  fetchParentProfile: () => Promise<void>;
  createParentProfile: (data: any) => Promise<void>;
  updateParentProfile: (changes: Partial<ParentProfile>) => Promise<void>;
  saveParentSurrogate: (profileData: any) => Promise<any>;
  updateParentMatchPreference: (preferenceData: any) => Promise<any>;
  clearParentProfile: () => void;
}

export type ParentProfileStore = ParentProfileState & ParentProfileActions;
