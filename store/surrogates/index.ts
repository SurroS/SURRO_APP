import { create } from "zustand";
import { createSurrogateSlice } from "./actions";
import { SurrogateStore } from "./types";

export const useSurrogateStore = create<SurrogateStore>()((...a) => ({
  ...createSurrogateSlice(...a),
}));
