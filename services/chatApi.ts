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
  surrogateId?: string,
  accessId?: string,
): Promise<Conversation> {
  try {
    console.log(" Creating conversation with:", { otherUserId, surrogateId, accessId });

    const body: CreateConversationRequest = { otherUserId, surrogateId, accessId };

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
 * Fetch messages for a conversation with pagination
 */
export async function fetchMessages(
  conversationId: string,
  take = 50,
  skip = 0,
): Promise<Message[]> {
  try {
    console.log(" Fetching messages for conversation:", conversationId);

    const res = await authenticatedGet(`/chat/messages/${conversationId}`, {
      params: { take, skip },
    });

    console.log(" Messages fetched:", res);
    return res?.data ?? (Array.isArray(res) ? res : []);
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
    console.log(" Fetching chat library...");

    const res = await authenticatedGet("/chat");

    console.log(" Chat library fetched:", res);

    return res?.data ?? [];
  } catch (error) {
    const info = explainAxiosError(error);
    console.error(" Failed to fetch chat library", info);
    return [];
  }
}

/**
 * Mark messages as read
 */
export async function markMessagesAsRead(messageIds: string[]) {
  try {
    console.log(" Marking messages as read:", messageIds);

    await authenticatedPatch("/chat/messages/read", { messageIds });
  } catch (err) {
    const info = explainAxiosError(err);
    console.error(" Mark as read failed:", info);
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
