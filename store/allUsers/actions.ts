import { StateCreator } from "zustand";
import {
  makeAuthenticatedProfileRequest,
  UserRole,
} from "@/services/profileApi";
import { UserListStore } from "./types";

export const createUserListSlice =
  <T>(role: UserRole): StateCreator<UserListStore<T>> =>
  (set) => ({
    users: [],
    isLoading: false,
    error: null,

    async fetchUsers(showToast = false) {
      try {
        set({ isLoading: true });
        const res = await makeAuthenticatedProfileRequest(
          "GET",
          `/users/by-role/${role}`
        );
        set({ users: res.data, isLoading: false, error: null });
      } catch (error: any) {
        set({
          isLoading: false,
          error: error?.message || "Failed to fetch users",
        });
        throw error;
      }
    },
    async fetchUsersById(id:string) {
      try {
        set({ isLoading: true });
        const res = await makeAuthenticatedProfileRequest(
          "GET",
          `/users/${id}`
        );
        set({ users: res.data, isLoading: false, error: null });
      } catch (error: any) {
        set({
          isLoading: false,
          error: error?.message || "Failed to fetch users",
        });
        throw error;
      }
    },

    setUsers: (data: T[]) => set({ users: data }),
    setLoading: (val: boolean) => set({ isLoading: val }),
    setError: (err: string | null) => set({ error: err }),
  });
