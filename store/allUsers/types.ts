// store/users/listTypes.ts
export interface UserBase {
  id: string;
  userName: string;
  profilePicture?: string;
  countryOfResidence?: string;
  isAvailable?: boolean;
}

export type SurrogateUser = UserBase & { role: "SURROGATE" };
export type ParentUser = UserBase & { role: "INTENDED_PARENT" };
export type AgentUser = UserBase & { role: "AGENT" };

// Generic list state
export interface UserListState<T> {
  users: T[];
  isLoading: boolean;
  error: string | null;
}

// Generic list actions
export interface UserListActions<T> {
  fetchUsers: (showToast?: boolean) => Promise<void>;
  setUsers: (data: T[]) => void;
  setLoading: (val: boolean) => void;
  setError: (err: string | null) => void;
}

// Combined generic store type
export type UserListStore<T> = UserListState<T> & UserListActions<T>;
