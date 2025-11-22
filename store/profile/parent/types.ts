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
  clearParentProfile: () => void;
}

export type ParentProfileStore = ParentProfileState & ParentProfileActions;
