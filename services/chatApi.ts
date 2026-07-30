import { authenticatedGet, authenticatedPost, authenticatedPatch } from "./httpClient";
import { explainAxiosError } from "@/utils/apiErrorHandler";
import type {
  Conversation,
  Message,
  CreateConversationRequest,
  SendMessageRequest,
} from "@/types/chat";

/**
 * Create a conversation with another user
 */
export async function createConversation(
  otherUserId: string,
): Promise<Conversation> {
  try {
    const body: CreateConversationRequest = { partnerId: otherUserId };

    const res = await authenticatedPost("/chat/conversation", body);
    return res as Conversation;
  } catch (err) {
    const info = explainAxiosError(err);
    console.error("Create conversation failed:", info);
    throw info;
  }
}

/**
 * Fetch messages for a conversation with pagination
 */
export async function fetchMessages(
  conversationId: string,
  take = 50,
  skip = 0,
): Promise<Message[]> {
  try {
    const res = await authenticatedGet(`/chat/messages/${conversationId}`, {
      params: { take, skip },
    });
    return Array.isArray(res) ? res : (res?.data ?? []);
  } catch (err) {
    const info = explainAxiosError(err);
    console.error(" Fetch messages failed:", info);
    throw info;
  }
}

/**
 * Fetch all conversations for the current user
 */
export async function GetAllChat() {
  try {
    const res = await authenticatedGet("/chat");

    return Array.isArray(res) ? res : (res?.data ?? []);
  } catch (error) {
    const info = explainAxiosError(error);
    console.error(" Failed to fetch chat library", info);
    throw info;
  }
}

/**
 * Mark messages as read
 */
export async function markMessagesAsRead(messageIds: string[]) {
  try {
    await authenticatedPatch("/chat/messages/read", { messageIds });
  } catch (err) {
    const info = explainAxiosError(err);
    console.warn("Mark as read failed (non-fatal):", info);
  }
}

export async function sendMessage(
  conversationId: string,
  content: string,
  attachmentUrl?: string,
): Promise<Message> {
  try {
    const body: SendMessageRequest = { conversationId, content, attachmentUrl };

    const res = await authenticatedPost("/chat/message", body);
    return res as Message;
  } catch (err) {
    const info = explainAxiosError(err);
    console.error(" Send message failed:", info);
    throw info;
  }
}
