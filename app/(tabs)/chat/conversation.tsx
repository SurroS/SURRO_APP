import React, { useEffect, useRef, useState, useLayoutEffect } from "react";
import {
  FlatList,
  View,
  Text as RNText,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import KeyboardAvoidingWrapper from "@/components/keyboardAvoidingWrapper";
import ChatInput from "@/components/chat/ChatInput";
import { useAuthStore } from "@/store/auth";
import {
  fetchMessages,
  createConversation,
  sendMessage,
  markMessagesAsRead,
} from "@/services/chatApi";
import type { Message } from "@/types/chat";
import { setCachedConversation } from "@/utils/chatCache";

/* -----------------------------------------
 * Helpers
 * ----------------------------------------*/

const normalizeMessage = (msg: any, fallbackId?: string): Message => ({
  id:
    typeof msg?.id === "string"
      ? msg.id
      : (fallbackId ?? `temp-${Date.now()}-${Math.random()}`),
  conversationId: msg?.conversationId,
  content: msg?.content ?? "",
  attachmentUrl: msg?.attachmentUrl ?? null,
  createdAt: msg?.createdAt ?? new Date().toISOString(),
  sender: {
    id: msg?.sender?.id ?? "system",
    name: msg?.sender?.name ?? "System",
    role: msg?.sender?.role,
  },
  status: msg?.status ?? "SENT",
  failed: msg?.failed ?? false,
});

export default function ChatBoxScreen() {
  const params = useLocalSearchParams<Record<string, string>>();
  const otherUserId = params.otherUserId;
  const routeConvoId = params.conversationId || params.id;
  const currentUser = useAuthStore((s) => s.user);
  const currentUserId = currentUser?.id;
  const navigation = useNavigation();

  // Hide the tab bar so the chat input sits at the bottom
  useLayoutEffect(() => {
    navigation.getParent()?.setOptions({ tabBarStyle: { display: "none" } });
    return () => {
      navigation.getParent()?.setOptions({ tabBarStyle: { display: "flex", borderTopWidth: 0, backgroundColor: "#FFFFFF" } });
    };
  }, [navigation]);

  const [conversationId, setConversationId] = useState<string | undefined>(routeConvoId || undefined);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<"connecting" | "connected" | "error">("connecting");
  const [connectionError, setConnectionError] = useState<string>();

  const flatRef = useRef<FlatList<Message>>(null);

  /* -----------------------------------------
   * LOAD MESSAGES (two paths)
   * ----------------------------------------*/
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setConnectionStatus("connecting");

      try {
        let convoId = routeConvoId;

        if (!convoId && otherUserId) {
          const convo = await createConversation(otherUserId);
          if (!convo?.id) throw new Error("Conversation creation failed");
          convoId = convo.id;
          setConversationId(convoId);
          setCachedConversation(otherUserId, convoId);
        }

        if (!convoId) {
          setConnectionStatus("error");
          setConnectionError("No conversation to load");
          setLoading(false);
          return;
        }

        setConnectionStatus("connected");

        const fetched = await fetchMessages(convoId);

        if (Array.isArray(fetched) && fetched.length > 0) {
          setMessages(fetched.map((m) => normalizeMessage(m)));
        } else {
          setMessages([
            normalizeMessage({
              id: "system-1",
              content: "Conversation has started, send your message",
              sender: { id: "system", name: "System" },
            }),
          ]);
        }
      } catch (err: any) {
        console.error("Failed to load conversation:", err);
        setConnectionStatus("error");
        setConnectionError(typeof err === "string" ? err : err?.message || "Conversation could not be created");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [routeConvoId, otherUserId, setCachedConversation, normalizeMessage]);

  /* -----------------------------------------
   * MARK INCOMING MESSAGES AS READ
   * ----------------------------------------*/
  useEffect(() => {
    if (!messages.length || !currentUserId) return;

    const unreadIds = messages
      .filter((m) => m.sender?.id !== currentUserId && m.status !== "READ")
      .map((m) => m.id);

    if (unreadIds.length) {
      markMessagesAsRead(unreadIds);
      setMessages((prev) =>
        prev.map((m) =>
          unreadIds.includes(m.id) ? { ...m, status: "READ" as const } : m,
        ),
      );
    }
    }, [messages, currentUserId, markMessagesAsRead]);

  /* -----------------------------------------
   * message status
   * ----------------------------------------*/
  const renderTicks = (status?: string) => {
    if (!status) return null;

    let text = "✔";
    let color = "#999";

    if (status === "SENDING") {
      return <RNText style={[styles.ticks, { color: "#999", fontStyle: "italic" }]}>Sending...</RNText>;
    }

    if (status === "DELIVERED") {
      text = "✔✔";
    }

    if (status === "READ") {
      text = "✔✔";
      color = "#0E0E55"; // blue
    }

    return <RNText style={[styles.ticks, { color }]}>{text}</RNText>;
  };

  /* -----------------------------------------
   * SEND MESSAGE
   * ----------------------------------------*/
  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const tempId = `temp-${Date.now()}`;

    const optimistic: Message = {
      id: tempId,
      content: text.trim(),
      createdAt: new Date().toISOString(),
      sender: {
        id: currentUserId!,
        name: currentUser?.name ?? "Me",
      },
      status: "SENDING",
    };

    setMessages((prev) => [optimistic, ...prev]);

    let currentConvoId = conversationId;

    // If no conversation yet, try to create one
    if (!currentConvoId) {
      if (!otherUserId) {
        setMessages((prev) =>
          prev.map((m) => (m.id === tempId ? { ...m, failed: true, status: undefined } : m)),
        );
        return;
      }
      try {
        const convo = await createConversation(otherUserId);
        if (convo?.id) {
          currentConvoId = convo.id;
          setConversationId(currentConvoId);
          setCachedConversation(otherUserId, currentConvoId);
          setConnectionStatus("connected");
        } else {
          throw new Error("Conversation creation failed");
        }
      } catch (err: any) {
        const msg = typeof err === "string" ? err : err?.message || "Conversation not available";
        setMessages((prev) =>
          prev.map((m) => (m.id === tempId ? { ...m, failed: true, status: undefined } : m)),
        );
        return;
      }
    }

    try {
      const sent = await sendMessage(currentConvoId, text.trim());

      setMessages((prev) =>
        prev.map((m) =>
          m.id === tempId
            ? {
                ...m,
                id: sent.id ?? tempId,
                createdAt: sent.createdAt ?? m.createdAt,
                status: sent.status ?? "SENT",
              }
            : m,
        ),
      );
    } catch (err) {
      console.error("Send message failed:", err);

      setMessages((prev) =>
        prev.map((m) => (m.id === tempId ? { ...m, failed: true, status: undefined } : m)),
      );
    }
  };

  /* -----------------------------------------
   * RENDER MESSAGE
   * ----------------------------------------*/
  const renderItem = ({ item }: { item: Message }) => {
    const isMine = item.sender?.id === currentUserId;

    return (
      <View
        style={[styles.messageRow, isMine ? styles.myRow : styles.theirRow]}
      >
        <View
          style={[styles.bubble, isMine ? styles.myBubble : styles.theirBubble]}
        >
          {!!item.content && (
            <RNText
              style={[
                styles.messageText,
                isMine ? styles.myText : styles.theirText,
              ]}
            >
              {item.content}
            </RNText>
          )}

          <RNText style={styles.time}>
            {new Date(item.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
            {isMine && !item.failed && (
              <>
                {"  "}
                {renderTicks(item.status)}
              </>
            )}
          </RNText>

          {item.failed && <RNText style={styles.failed}>Failed to send</RNText>}
        </View>
      </View>
    );
  };

  /* -----------------------------------------
   * RENDER STATUS BANNER
   * ----------------------------------------*/
  const renderStatusBanner = () => {
    if (connectionStatus === "connecting") {
      return (
        <View style={styles.banner}>
          <ActivityIndicator size="small" color="#0E0E55" />
          <RNText style={styles.bannerText}>Connecting...</RNText>
        </View>
      );
    }
    if (connectionStatus === "error") {
      return (
        <View style={[styles.banner, styles.bannerError]}>
          <RNText style={styles.bannerErrorText}>{connectionError}</RNText>
        </View>
      );
    }
    return null;
  };

  return (
    <KeyboardAvoidingWrapper>
      <View style={styles.container}>
        {renderStatusBanner()}
        <FlatList
          ref={flatRef}
          data={messages}
          inverted
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 12, paddingBottom: 20 }}
        />
        <ChatInput onSend={handleSend} disabled={false} />
      </View>
    </KeyboardAvoidingWrapper>
  );
}

/* -----------------------------------------
 * Styles
 * ----------------------------------------*/
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingTop: 45 },

  banner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 8,
    backgroundColor: "#f0f4ff",
  },
  bannerText: { fontSize: 13, color: "#0E0E55" },
  bannerError: { backgroundColor: "#fff0f0" },
  bannerErrorText: { fontSize: 13, color: "#c00" },

  messageRow: { marginVertical: 6, paddingHorizontal: 6 },
  myRow: { alignSelf: "flex-end", maxWidth: "80%" },
  theirRow: { alignSelf: "flex-start", maxWidth: "80%" },

  bubble: { padding: 10, borderRadius: 12 },
  myBubble: { backgroundColor: "#0E0E55" },
  theirBubble: {
    backgroundColor: "#F3F3F3",
    borderWidth: 1,
    borderColor: "#EEE",
  },

  messageText: { fontSize: 15 },
  myText: { color: "#fff" },
  theirText: { color: "#111" },

  time: {
    fontSize: 11,
    color: "#999",
    marginTop: 6,
    alignSelf: "flex-end",
  },

  failed: { fontSize: 11, color: "red", marginTop: 4 },
  ticks: {
    fontSize: 11,
    marginLeft: 4,
  },
});
