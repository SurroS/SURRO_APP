import React, { useMemo, useRef, useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  View,
  Text as RNText,
  ActivityIndicator,
  Image,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import KeyboardAvoidingWrapper from "@/components/keyboardAvoidingWrapper";
import ChatInput from "@/components/chat/chatInput";
import { useChatSimple } from "@/hooks/chat/useChat";
import type { Message } from "@/types/chat";
import colors from "@/hooks/colors";
import { secureGet } from "@/utils/storage";

export default function ChatBoxScreen() {
  const params = useLocalSearchParams<{
    conversationId?: string;
    otherUserId?: string;
  }>();

  const { conversationId, otherUserId } = params;

  const { connected, messages, loadingHistory, sendMessage } =
    useChat(conversationId, otherUserId);

  const flatRef = useRef<FlatList<Message> | null>(null);

  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    secureGet("userId").then(setUserId as any);
  }, []);

  // AUTO SCROLL
  useEffect(() => {
    if (!flatRef.current) return;
    setTimeout(() => flatRef.current?.scrollToEnd({ animated: true }), 120);
  }, [messages.length]);

  const handleSend = async (text: string) => {
    if (!conversationId) return;
    await sendMessage({ content: text });
  };

  // FIND OTHER USER TO SHOW HEADER
  const otherUser = useMemo(() => {
    if (!messages.length) return null;

    return (
      messages
        .map((m) => m.sender)
        .find((u) => u?.id !== userId) || null
    );
  }, [messages, userId]);

  // MESSAGE UI
  const renderItem = ({ item }: { item: Message }) => {
    const isMine = item.sender?.id === userId;

    return (
      <View style={[styles.messageRow, isMine ? styles.myRow : styles.theirRow]}>
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

          {!!item.attachmentUrl && (
            <RNText style={styles.attachment}>Attachment</RNText>
          )}

          <RNText style={styles.time}>
            {new Date(item.createdAt).toLocaleTimeString()}
          </RNText>
        </View>
      </View>
    );
  };

  if (loadingHistory) {
    return (
      <KeyboardAvoidingWrapper>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </KeyboardAvoidingWrapper>
    );
  }

  return (
    <KeyboardAvoidingWrapper>
      <View style={styles.container}>

        {/* HEADER */}
        {otherUser && (
          <View style={styles.header}>
            <Image
              source={{
                uri:
                  otherUser.avatarUrl ||
                  "https://placehold.co/80x80"
              }}
              style={styles.avatar}
            />
            <RNText style={styles.headerName}>
              {otherUser.name}
            </RNText>
          </View>
        )}

        <FlatList
          ref={flatRef}
          data={messages}
          renderItem={renderItem}
          keyExtractor={(m) => m.id}
          contentContainerStyle={{ padding: 12 }}
        />

        <ChatInput
          onSend={handleSend}
          disabled={!connected && messages.length === 0}
        />
      </View>
    </KeyboardAvoidingWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee"
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10
  },

  headerName: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.primary
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },

  messageRow: { marginVertical: 6, paddingHorizontal: 6 },
  myRow: { alignSelf: "flex-end", maxWidth: "80%" },
  theirRow: { alignSelf: "flex-start", maxWidth: "80%" },

  bubble: { padding: 10, borderRadius: 12 },
  myBubble: { backgroundColor: "#0E0E55" },
  theirBubble: {
    backgroundColor: "#F3F3F3",
    borderWidth: 1,
    borderColor: "#EEE"
  },

  messageText: { fontSize: 15 },
  myText: { color: "#fff" },
  theirText: { color: "#111" },

  attachment: {
    color: colors.primary,
    marginTop: 6,
    textDecorationLine: "underline"
  },

  time: {
    fontSize: 11,
    color: "#999",
    marginTop: 6,
    alignSelf: "flex-end"
  }
});
