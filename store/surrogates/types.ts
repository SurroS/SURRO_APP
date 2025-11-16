import { StateCreator } from "zustand";

export interface Surrogate {
  id: string;
  name: string;
  avatar?: string;
  age:string;
  country:string
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
