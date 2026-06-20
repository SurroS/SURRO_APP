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

export type MessageStatus = "SENDING" | "SENT" | "DELIVERED" | "READ";
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
  status?: MessageStatus;
  failed?: boolean;
}

export interface CreateConversationRequest {
  otherUserId: string;
  surrogateId?: string;
  accessId?: string;
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
 
export interface Sender {
  id: string;
  name: string;
  role?: string;
}


