import { create } from "zustand";
import type { Conversation } from "@/types/chat";

interface ChatStore {
  conversations: Conversation[];
  initialized: boolean;
  setConversations: (list: Conversation[]) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  conversations: [],
  initialized: false,
  setConversations: (list) => set({ conversations: list, initialized: true }),
}));
