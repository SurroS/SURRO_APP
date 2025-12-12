export interface ParentProfile {
  id: string;
  fullName:string
  userName: string;
  profilePicture?: string;
  countryOfResidence?: string;
  yearsOfTrying?: number;
  about?: string;
  languagesSpoken?: string[];
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
