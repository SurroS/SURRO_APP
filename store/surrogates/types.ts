import { StateCreator } from "zustand";

export interface Surrogate {
  id: string;
  name: string;
  userName: string;
  nickname?: string;
  avatar?: string;
  image: string;
  age: string;
  country?: string;
  stateOfResidence: string;
  lga: string;
  firstName: string;
  lastName: string;
  contactPhone: string | number;
  contactEmail: string;
  bio: string;
  experienceLevel: string;
  genotype?: string;
  bloodGroup?: string;
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
  fetchMatches: () => Promise<void>;
  setSurrogates: (data: Surrogate[]) => void;
  setLoading: (val: boolean) => void;
  setError: (err: string | null) => void;
  clearSurrogates: () => void;
}

// Combined type
export type SurrogateStore = SurrogateListState & SurrogateListActions;
