import { StateCreator } from "zustand";

export interface Surrogate {
  id: string;
  name: string;
  userName: string;
  wallet: any;
  avatar?: string;
  age: string;
  country: string;
  height?: string;
  weight?: string;
  firstName: string;
  lastName: string;
  countryOfOrigin: string;
  aboutMe: string;
  dateOfBirth: string;
  maritalStatus: string;
  profilePicture: string;
  children: string | number;
  countryOfResidence: string;
  stateOfResidence: string;
  lga: string;
  stateOfOrigin: string;
  address: string;
  zipCode: string;
  phone1: string|number;
  phone2: string|number;
  emergencyContactPhone: string|number;
  emergencyContactRelation: string;
  facebookProfile: string;
  instagramProfile: string;
  twitterProfile: string;
  threadsProfile: string;
  isAvailable: boolean;
  termsAcceptedAt: string;
}

// --- Surrogate List State ---
export interface SurrogateListState {
  surrogates: Surrogate[];
  isLoading: boolean;
  error: string | null;
}

// --- Surrogate List Actions ---
export interface SurrogateListActions {
  fetchSurrogates: (showToast?: boolean) => Promise<void>;
  setSurrogates: (data: Surrogate[]) => void;
  setLoading: (val: boolean) => void;
  setError: (err: string | null) => void;
}

// Combined type
export type SurrogateStore = SurrogateListState & SurrogateListActions;
