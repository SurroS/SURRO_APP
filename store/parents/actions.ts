// // store/profile/parents/listSlice.ts
// import { StateCreator } from "zustand";
// import { ParentProfile } from "../profile/parent/types";
// import { getParentList } from "@/services/profileApi"; // API call

// export interface ParentListStore {
//   parents: ParentProfile[];
//   isLoading: boolean;
//   error: string | null;

//   fetchParents: (showToast?: boolean) => Promise<void>;
//   setParents: (data: ParentProfile[]) => void;
//   setLoading: (val: boolean) => void;
//   setError: (err: string | null) => void;
// }

// export const createParentListSlice: StateCreator<
//   ParentListStore,
//   [],
//   [],
//   ParentListStore
// > = (set) => ({
//   parents: [],
//   isLoading: false,
//   error: null,

//   fetchParents: async (showToast = false) => {
//     try {
//       set({ isLoading: true });

//       const res = await getParentList(); // fetch array of parents
//       set({ parents: res.data.user, isLoading: false, error: null });
//     } catch (err: any) {
//       set({
//         isLoading: false,
//         error: err.message || "Failed to fetch parents",
//       });
//       if (showToast) {
//         // optionally show toast
//       }
//       throw err;
//     }
//   },

//   setParents: (data) => set({ parents: data }),
//   setLoading: (val) => set({ isLoading: val }),
//   setError: (err) => set({ error: err }),
// });
