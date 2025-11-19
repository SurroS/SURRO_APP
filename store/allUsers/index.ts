import { create } from "zustand";
import { createUserListSlice } from "./actions";
import { UserListStore, SurrogateUser, ParentUser, AgentUser } from "./types";

// Surrogate Store
export const useSurrogateStore = create<UserListStore<SurrogateUser>>(createUserListSlice<SurrogateUser>("SURROGATE"));

// Parent Store
export const useParentStore = create<UserListStore<ParentUser>>(createUserListSlice<ParentUser>("INTENDED_PARENT"));

// Agent Store
export const useAgentStore = create<UserListStore<AgentUser>>(createUserListSlice<AgentUser>("AGENT"));
