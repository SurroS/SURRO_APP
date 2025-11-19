// store/profile/parents/listStore.ts
import { create } from "zustand";
import { createParentListSlice } from "./actions";
import { ParentListStore } from "./types";

export const useParentListStore = create<ParentListStore>()((...a) => ({
  ...createParentListSlice(...a),
}));
