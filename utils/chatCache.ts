// utils/chatCache.ts
type ChatCache = { [userId: string]: string };

let conversationCache: ChatCache = {};

export function getCachedConversation(userId: string) {
  return conversationCache[userId]
    ? { conversationId: conversationCache[userId] }
    : null;
}

export function setCachedConversation(userId: string, conversationId: string) {
  conversationCache[userId] = conversationId;
}
