import { User } from "./auth";

export interface ChatUser {
  id: string;
  name: string;
  role: "SURROGATE" | "INTENDED_PARENT" | "AGENT" | "SUPPORT" | string;
  avatarUrl?: string;
}

export interface Conversation {
  id: string;
  participants: Participants[];
  lastMessage?: { content: string; createdAt: string };
}

export interface Message {
  id: string;
  conversationId?: string | undefined;
  sender?: {
    id: string;
    name: string;
    role?: string;
  };
  content?: string;
  attachmentUrl?: string;
  createdAt: string;
  otherParticipant?: string;
  failed?: boolean;
}

export interface CreateConversationRequest {
  otherUserId: string;
}

export interface SendMessageRequest {
  conversationId: string;
  content: string;
  attachmentUrl?: string;
}

export interface Participants {
  id: string;
  avatarUrl: string;
  name: string;
  conversationId: string | undefined;
  userId: string;
  role: "INTENDED_PARENT" | "SURROGATE" | "AGENT";
}
