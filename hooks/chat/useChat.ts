import { useCallback, useEffect, useRef, useState } from "react";
import { secureGet } from "@/utils/storage";
import {
  createConversation,
  sendMessageRest,
  fetchMessages as fetchMessagesRest,
} from "@/services/chatApi";
import type { Message, Conversation } from "@/types/chat";

// WebSocket base endpoint
const WS_BASE = "wss://dev.surrosantara.space/ws/chat";

interface SendPayload {
  conversationId: string;
  content?: string;
  attachmentUrl?: string | null;
}

export function useChat(conversationId?: string, otherUserId?: string) {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectRef = useRef<number>(0);

  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<string | undefined>(
    conversationId
  );

  // 🔹 Connect WebSocket
  const connect = useCallback(async () => {
    if (!currentConversationId) return;

    const token = await secureGet("token");
    if (!token) return;

    const url = `${WS_BASE}?conversationId=${encodeURIComponent(
      currentConversationId
    )}&token=${encodeURIComponent(token)}`;

    try {
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        reconnectRef.current = 0;
        setConnected(true);
        console.log("WebSocket connected");
      };

      ws.onmessage = (e) => {
        try {
          const payload = JSON.parse(e.data);
          // Expect structure { type: 'message', data: Message } or raw Message
          const msg: Message =
            payload?.type === "message" ? payload.data : payload;

          if (msg && msg.id) {
            setMessages((prev) => {
              if (prev.some((m) => m.id === msg.id)) return prev;
              return [...prev, msg].sort(
                (a, b) =>
                  new Date(a.createdAt).getTime() -
                  new Date(b.createdAt).getTime()
              );
            });
          }
        } catch (err) {
          console.warn("WS message parse error:", err);
        }
      };

      ws.onerror = (err) => {
        console.warn(" WebSocket error:", err);
      };

      ws.onclose = () => {
        console.warn("⚠️ WebSocket closed, reconnecting...");
        wsRef.current = null;
        setConnected(false);
        reconnectRef.current = reconnectRef.current
          ? Math.min(30000, reconnectRef.current * 2)
          : 1000;
        setTimeout(connect, reconnectRef.current);
      };
    } catch (err) {
      console.warn("WS connection failed:", err);
    }
  }, [currentConversationId]);

  // 🔹 Fetch history
  const fetchHistory = useCallback(async () => {
    if (!currentConversationId) return;
    setLoadingHistory(true);
    try {
      const hist = await fetchMessagesRest(currentConversationId);
      setMessages(
        hist.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        )
      );
    } catch (err) {
      console.warn("Failed to fetch history:", err);
    } finally {
      setLoadingHistory(false);
    }
  }, [currentConversationId]);

  // 🔹 Send message (WS preferred, REST fallback)
  const sendMessage = useCallback(
    async (payload: SendPayload) => {
      const userId = await secureGet("userId");
      const role = await secureGet("role");

      // Optimistic UI
      const tempMsg: Message = {
        id: `temp-${Date.now()}`,
        conversationId: payload.conversationId,
        sender: { id: userId!, name: "You", role },
        content: payload.content ?? "",
        attachmentUrl: payload.attachmentUrl ?? undefined,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, tempMsg]);

      try {
        // Try WebSocket first
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(
            JSON.stringify({
              action: "message",
              payload,
            })
          );
          return;
        }

        // Fallback to REST
        const persisted = await sendMessageRest(payload);
        setMessages((prev) => {
          const filtered = prev.filter((m) => m.id !== tempMsg.id);
          return [...filtered, persisted].sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        });
      } catch (err) {
        console.warn("Failed to send message:", err);
      }
    },
    []
  );

  // 🔹 Initialize: create conversation if needed, fetch history, connect WS
  useEffect(() => {
    (async () => {
      if (!conversationId && otherUserId) {
        // For initiating new chat (e.g., “Chat Now”)
        try {
          const convo: Conversation = await createConversation(otherUserId);
          setCurrentConversationId(convo.id);
          await fetchHistory();
          await connect();
        } catch (err) {
          console.error("Failed to create conversation:", err);
        }
      } else if (conversationId) {
        setCurrentConversationId(conversationId);
        await fetchHistory();
        await connect();
      }
    })();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [conversationId, otherUserId, connect, fetchHistory]);

  return {
    connected,
    messages,
    loadingHistory,
    sendMessage,
    refreshHistory: fetchHistory,
    conversationId: currentConversationId,
  };
}
