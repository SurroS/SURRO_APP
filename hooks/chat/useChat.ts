// hooks/chat/useChatSimple.ts
import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/auth";
import { 
  createConversation,
  fetchMessages,
  sendMessage,
} from "@/services/chatApi";
import { explainAxiosError } from "@/utils/apiErrors";

export function useChatSimple(otherUserId?: string) {
  const user = useAuthStore((s) => s.user);

  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ------------------------------------------------------
  //  Create conversation automatically if otherUserId provided
  // ------------------------------------------------------
  useEffect(() => {
    if (!otherUserId || conversationId) return;

    const initConversation = async () => {
      setLoading(true);
      setError(null);
      try {
        const convo = await createConversation(otherUserId);
        setConversationId(convo.id);
      } catch (err) {
        const info = explainAxiosError(err);
        setError(info.message || "Failed to create conversation");
      } finally {
        setLoading(false);
      }
    };

    initConversation();
  }, [otherUserId, conversationId]);

  // ------------------------------------------------------
  //  Fetch messages once conversationId exists
  // ------------------------------------------------------
  useEffect(() => {
    if (!conversationId) return;

    const loadMessages = async () => {
      setLoading(true);
      try {
        const msgs = await fetchMessages(conversationId);
        setMessages(msgs);
      } catch (err) {
        const info = explainAxiosError(err);
        setError(info.message || "Failed to fetch messages");
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, [conversationId]);

  // ------------------------------------------------------
  // Send a new message
  // ------------------------------------------------------
  const handleSendMessage = async (text: string) => {
    if (!conversationId || !text.trim()) return;

    // Optimistic UI: add temp message
    const tempMsg = {
      id: Math.random().toString(),
      content: text,
      sender: { id: user?.id, name: user?.userName },
      createdAt: new Date().toISOString(),
      failed: false,
    };
    setMessages((prev) => [...prev, tempMsg]);

    try {
      const savedMsg = await sendMessage(conversationId, text);
      setMessages((prev) =>
        prev.map((m) => (m.id === tempMsg.id ? savedMsg : m))
      );
    } catch (err) {
      const info = explainAxiosError(err);
      // mark temp message as failed
      setMessages((prev) =>
        prev.map((m) => (m.id === tempMsg.id ? { ...m, failed: true } : m))
      );
    }
  };

  return {
    messages,
    conversationId,
    loading,
    error,
    sendMessage: handleSendMessage,
  };
}
