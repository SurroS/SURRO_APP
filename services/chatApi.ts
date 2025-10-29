import api  from "@/services/api";
import type { Conversation, Message } from "@/types/chat";

export async function createConversation(otherUserId: string): Promise<Conversation> {
  const { data } = await api.post<Conversation>("/api/v1/chat/conversation", { otherUserId });
  return data;
}

export async function sendMessageRest(payload: {
  conversationId: string;
  content?: string;
  attachmentUrl?: string | null;
}): Promise<Message> {
  const { data } = await api.post<Message>("/api/v1/chat/message", payload);
  return data;
}

export async function fetchMessages(conversationId: string, limit = 50, before?: string) {
  // Your backend path: /api/v1/chat/messages/{conversationId}
  // Accept query params like ?limit=50&before=isoDate if supported.
  const url = `/api/v1/chat/messages/${conversationId}`;
  const { data } = await api.get<Message[]>(url, { params: { limit, before } });
  return data;
}
