import { User } from "./auth";

export interface ChatUser {
  id: string;
  name: string;
  userName?: string;
  role: "SURROGATE" | "INTENDED_PARENT" | "AGENT" | "SUPPORT" | string;
  avatarUrl?: string;
}

export interface Conversation {
  id: string;
  participant: {
    id: string;
    name: string;
    userName?: string;
    avatar: string | null;
    role: string;
  };
  participants?: Participants[];
  lastMessage?: { content: string; createdAt: string; senderId: string };
  unreadCount: number;
}

export type MessageStatus = "SENDING" | "SENT" | "DELIVERED" | "READ";
export interface Message {
  id: string;
  conversationId?: string | undefined;
  sender?: {
    id: string;
    name: string;
    userName?: string;
    role?: string;
  };
  content?: string;
  attachmentUrl?: string;
  createdAt: string;
  otherParticipant?: string;
  status?: MessageStatus;
  failed?: boolean;
}

export interface CreateConversationRequest {
  partnerId: string;
}

export interface SendMessageRequest {
  conversationId: string;
  content: string;
  attachmentUrl?: string;
}

export interface Participants {
  avatarUrl: string;
  name: string;
  userName?: string;
  conversationId: string | undefined;
  userId: string;
  role: "INTENDED_PARENT" | "SURROGATE" | "AGENT";
}
 
export interface Sender {
  id: string;
  name: string;
  userName?: string;
  role?: string;
}


