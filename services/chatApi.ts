// services/chatApi.ts
import { authenticatedGet, authenticatedPost } from "./httpClient";
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
    console.log(" Creating conversation with:", otherUserId);

    const body: CreateConversationRequest = { otherUserId };

    const res = await authenticatedPost("/chat/conversation", body);

    console.log(" Conversation created:", res);
    return res as Conversation;
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
  conversationId: string,
): Promise<Message[]> {
  try {
    console.log(" Fetching messages for conversation:", conversationId);

    const res = await authenticatedGet(`/chat`);

    console.log("conversationId:", conversationId);
    console.log(" Messages fetched:", res);
    return res as Message[];
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

    const res = await authenticatedGet("/chat");

    console.log(" Chat library fetched:", res);

    // normalize return
    return res?.data ?? [];
  } catch (error) {
    const info = explainAxiosError(error);
    console.error(" Failed to fetch chat library", info);
    return [];
  }
}

export async function sendMessage(
  conversationId: string,
  content: string,
  attachmentUrl?: string,
): Promise<Message> {
  try {
    console.log("➡ Sending message:", {
      conversationId,
      content,
      attachmentUrl,
    });

    const body: SendMessageRequest = { conversationId, content, attachmentUrl };

    const res = await authenticatedPost("/chat/message", body);

    console.log(" Message sent:", res);
    return res.data as Message;
  } catch (err) {
    const info = explainAxiosError(err);
    console.error(" Send message failed:", info);
    throw info;
  }
}
