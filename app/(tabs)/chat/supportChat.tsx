import React, { useEffect, useRef, useState } from "react";
import { FlatList, StyleSheet, ActivityIndicator, View } from "react-native";
import { Text, YStack } from "tamagui";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import ChatInput from "@/components/chat/chatInput";
import KeyboardAvoidingWrapper from "@/components/keyboardAvoidingWrapper";
import colors from "@/hooks/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenHeader } from "@/components/auth";

interface SupportMessage {
  id: string;
  sender: "user" | "bot" | "agent";
  content: string;
  createdAt: string;
}

export default function SupportChatScreen() {
  const router = useRouter();
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    // Initial greeting from bot
    const intro = {
      id: "1",
      sender: "bot" as const,
      content:
        "👋 Hello! I’m Pal, your Surro assistant. How can I help you today?",
      createdAt: new Date().toISOString(),
    };
    setMessages([intro]);
  }, []);

  const handleSend = (text: string) => {
    const userMessage: SupportMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      content: text,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Simulate bot reply
    setIsTyping(true);
    setTimeout(() => {
      const lower = text.toLowerCase();
      let reply =
        "I’m not sure I understand, but I’ll connect you with an agent.";

      if (lower.includes("payment")) {
        reply = "💳 For payment issues, please confirm your transaction ID.";
      } else if (lower.includes("surrogate")) {
        reply =
          "👩‍🍼 Looking for a surrogate? I can guide you through the steps. Do you want to see available surrogates?";
      } else if (lower.includes("account")) {
        reply = "⚙️ For account support, please go to Settings → Account Help.";
      } else if (lower.includes("agent") || lower.includes("human")) {
        reply =
          "🤝 Connecting you to a customer service agent... Please hold on.";
      }

      const botMessage: SupportMessage = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        content: reply,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const renderItem = ({ item }: { item: SupportMessage }) => {
    const isUser = item.sender === "user";
    const isBot = item.sender === "bot";

    return (
      <View
        style={[
          styles.messageBubble,
          isUser
            ? styles.userBubble
            : isBot
            ? styles.botBubble
            : styles.agentBubble,
        ]}
      >
        <Text color={isUser ? "#fff" : colors.text}>{item.content}</Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingWrapper>
      <SafeAreaView style={{ flex: 1 }}>
        <YStack
          flex={1}
          backgroundColor="#fff"
          style={{ justifyContent: "center", marginTop: 10 }}
        >
          <View style={{ marginLeft: 15 }}>
            <ScreenHeader
              title="Customer Care"
              onBackPress={() => router.back()}
            />
          </View>

          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.chatContainer}
            onContentSizeChange={() =>
              flatListRef.current?.scrollToEnd({ animated: true })
            }
          />

          {isTyping && (
            <View style={styles.typingIndicator}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text marginLeft={6} color={colors.secondaryGray}>
                Suri is typing...
              </Text>
            </View>
          )}

          <ChatInput onSend={handleSend} disabled={false} />
        </YStack>
      </SafeAreaView>
    </KeyboardAvoidingWrapper>
  );
}

const styles = StyleSheet.create({
  chatContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  messageBubble: {
    padding: 10,
    borderRadius: 18,
    marginBottom: 10,
    maxWidth: "80%",
  },
  userBubble: {
    backgroundColor: "#0E0E55",
    alignSelf: "flex-end",
  },
  botBubble: {
    backgroundColor: "#f1f1f1",
    alignSelf: "flex-start",
  },
  agentBubble: {
    backgroundColor: "#e9f7ef",
    alignSelf: "flex-start",
  },
  typingIndicator: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
});
