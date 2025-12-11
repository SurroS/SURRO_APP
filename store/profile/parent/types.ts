export interface ParentProfile {
  id: string;
  fullName: string;
  dateOfBirth?: string;
  maritalStatus?: string;
  occupation?: string;
  address?: string;
  phone?: string;
  countryOfResidence?: string;
  stateOfOrigin?: string;
  religion?: string;
  termsAcceptedAt?: string;
  profilePicture?: string;
  userName?: string;
}

export interface MatchPreferences {
  matchGenotype?: string;
  matchReligion?: string;
  matchCountry?: string;
  matchState?: string;
  matchTravelReady?: boolean;
  matchMarital?: string;
}

export interface ParentProfileState {
  parentProfile: ParentProfile | null;
  savedSurrogates: any[];
  matches: any[];
  isLoading: boolean;
  error: string | null;
}

export interface ParentProfileActions {
  setParentProfile: (profile: ParentProfile | null) => void;
  fetchParentProfile: () => Promise<void>;
  createParentProfile: (data: Partial<ParentProfile>) => Promise<void>;
  updateParentProfile: (changes: Partial<ParentProfile>) => Promise<void>;
  updateParentMatchPreference: (preferenceData: MatchPreferences) => Promise<any>;
  fetchParentMatches: () => Promise<any>;
  saveParentSurrogate: (surrogateData: { surrogateId: string }) => Promise<any>;
  removeSavedSurrogate: (surrogateId: string) => Promise<void>;
  fetchSavedSurrogates: () => Promise<any>;
  clearParentProfile: () => void;
}

export type ParentProfileStore = ParentProfileState & ParentProfileActions;
