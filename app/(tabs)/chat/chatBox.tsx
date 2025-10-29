import React, { useMemo, useRef, useEffect } from "react";
import {
  FlatList,
  StyleSheet,
  View,
  Text as RNText,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import KeyboardAvoidingWrapper from "@/components/keyboardAvoidingWrapper";
import ChatInput from "@/components/chat/chatInput";
import { useChat } from "@/hooks/chat/useChat";
import type { Message } from "@/types/chat";
import colors from "@/hooks/colors";

export default function ChatBoxScreen() {
  const params = useLocalSearchParams<Record<string, string>>();
  const conversationId = params.conversationId;
  const { connected, messages, loadingHistory, sendMessage } =
    useChat(conversationId);

  const flatRef = useRef<FlatList<Message> | null>(null);

  // auto scroll on new messages
  useEffect(() => {
    if (!flatRef.current) return;
    setTimeout(() => flatRef.current?.scrollToEnd({ animated: true }), 120);
  }, [messages.length]);

  const handleSend = async (text: string) => {
    if (!conversationId) return;
    try {
      await sendMessage({ conversationId, content: text });
    } catch (err) {
      console.warn("send failed", err);
    }
  };

  const renderItem = ({ item }: { item: Message }) => {
    const isMine = (item.sender && item.sender.id === "me") || false; // replace "me" with real user id logic if available
    return (
      <View
        style={[styles.messageRow, isMine ? styles.myRow : styles.theirRow]}
      >
        <View
          style={[styles.bubble, isMine ? styles.myBubble : styles.theirBubble]}
        >
          {item.content ? (
            <RNText
              style={[
                styles.messageText,
                isMine ? styles.myText : styles.theirText,
              ]}
            >
              {item.content}
            </RNText>
          ) : null}
          {item.attachmentUrl ? (
            <RNText style={styles.attachment}>Attachment</RNText>
          ) : null}
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
        <FlatList
          ref={flatRef}
          data={messages}
          renderItem={renderItem}
          keyExtractor={(m) => m.id}
          contentContainerStyle={{ padding: 12, paddingBottom: 20 }}
          onContentSizeChange={() =>
            flatRef.current?.scrollToEnd({ animated: false })
          }
        />

        <ChatInput
          onSend={handleSend}
          disabled={!connected && !!messages.length === false}
        />
      </View>
    </KeyboardAvoidingWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center",backgroundColor: "#fff" },
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
  attachment: {
    color: colors.primary,
    marginTop: 6,
    textDecorationLine: "underline",
  },
  time: { fontSize: 11, color: "#999", marginTop: 6, alignSelf: "flex-end" },
});
