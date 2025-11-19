// store/profile/parents/listTypes.ts
import { ParentProfile } from "../profile/parent/types";

export interface ParentListStore {
  parents: ParentProfile[];
  isLoading: boolean;
  error: string | null;

  fetchParents: (showToast?: boolean) => Promise<void>;
  setParents: (data: ParentProfile[]) => void;
  setLoading: (val: boolean) => void;
  setError: (err: string | null) => void;
}
