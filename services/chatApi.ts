// services/chatApi.ts
import api from "./api";
import type {
  Conversation,
  Message,
  CreateConversationRequest,
  SendMessageRequest,
} from "@/types/chat";
import { explainAxiosError } from "@/utils/apiErrors";
import axios from "axios";

/**
 * Create a conversation with another user
 */
export async function createConversation(
  otherUserId: string
): Promise<Conversation> {
  try {
    console.log(" Creating conversation with:", otherUserId);

    const body: CreateConversationRequest = { otherUserId };

    const res = await api.post("/chat/conversation", body);

    console.log(" Conversation created:", res.data);
    return res.data as Conversation;
  } catch (err) {
    const info = explainAxiosError(err);
    console.error("Create conversation failed:", info);
    throw info;
  }
}

/**
 * Fetch all messages for a conversation
 */
export async function fetchMessages(
  conversationId: string
): Promise<Message[]> {
  try {
    console.log(" Fetching messages for conversation:", conversationId);

    const res = await api.get(`/chat`);

    console.log("conversationId:", conversationId);
    console.log(" Messages fetched:", res.data);
    return res.data as Message[];
  } catch (err) {
    const info = explainAxiosError(err);
    console.error(" Fetch messages failed:", info);
    throw info;
  }
}

/**
 * Fetch all chats
 */
export async function GetAllChat() {
  try {
    console.log(" Fetching chat library...");

    const res = await api.get("/chat");

    console.log(" Chat library fetched:", res.data);

    // normalize return
    return res.data?.data ?? [];
  } catch (error) {
    const info = explainAxiosError(error);
    console.error(" Failed to fetch chat library", info);
    return [];
  }
}

export async function sendMessage(
  conversationId: string,
  content: string,
  attachmentUrl?: string
): Promise<Message> {
  try {
    console.log("➡ Sending message:", {
      conversationId,
      content,
      attachmentUrl,
    });

    const body: SendMessageRequest = { conversationId, content, attachmentUrl };

    const res = await api.post("/chat/message", body);

    console.log(" Message sent:", res.data);
    return res.data.data as Message;
  } catch (err) {
    const info = explainAxiosError(err);
    console.error(" Send message failed:", info);
    throw info;
  }
}
