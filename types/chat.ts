// types/chat.ts
import { User } from "./auth";
export interface ChatUser extends User {
  id: string;
  name: string;
  role: "SURROGATE" | "INTENDED_PARENT" | "AGENT" //| "LAWYER" | "CLINIC";
  avatarUrl?: string;
}

export interface Conversation {
  id: string;
  participants: ChatUser[];
  lastMessage?: {
    content: string;
    createdAt: string;
  };
}

export interface Message {
  id: string;
  conversationId: string;
  sender: ChatUser;
  content: string;
  attachmentUrl?: string;
  createdAt: string;
}

export interface CreateConversationRequest {
  otherUserId: string;
}

export interface SendMessageRequest {
  conversationId: string;
  content: string;
  attachmentUrl?: string;
}
