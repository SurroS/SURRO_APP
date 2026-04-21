import React, { useEffect, useRef, useState } from "react";
import { FlatList, TextInput, TouchableOpacity, Keyboard } from "react-native";
import { YStack, XStack, Text } from "tamagui";
import { Ionicons } from "@expo/vector-icons";
import { secureGet, secureSet } from "@/utils/storage";
import TypingIndicator from "@/components/chat/TypingIndicator";
import { SafeAreaView } from "react-native-safe-area-context";
import KeyboardAvoidingWrapper from "@/components/keyboardAvoidingWrapper";

interface LocalMessage {
  id: string;
  from: "user" | "bot";
  text: string;
  suggestions?: string[];
}

export default function SupportChatScreen() {
  const [messages, setMessages] = useState<LocalMessage[]>([]);
  const [input, setInput] = useState("");
  const [isBotTyping, setIsBotTyping] = useState(false);
  const flatListRef = useRef<FlatList<LocalMessage>>(null);

  // Load chat history
  useEffect(() => {
    const loadMessages = async () => {
      const saved = await secureGet("support_chat_history");
      if (saved) {
        try {
          setMessages(JSON.parse(saved));
        } catch {
          console.warn("Failed to parse saved chat");
        }
      } else {
        const welcomeMsg: LocalMessage = {
          id: "welcome",
          from: "bot",
          text: "Hi 👋 I'm SurroSantara Assistant. How can I help you today?",
          suggestions: ["Payment issue", "Find a surrogate", "Talk to agent"],
        };
        setMessages([welcomeMsg]);
        await secureSet("support_chat_history", JSON.stringify([welcomeMsg]));
      }
    };
    loadMessages();
  }, []);

  // Persist chat
  useEffect(() => {
    if (messages.length > 0) {
      secureSet("support_chat_history", JSON.stringify(messages));
      scrollToBottom();
    }
  }, [messages]);

  const scrollToBottom = () => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const newMsg: LocalMessage = {
      id: Date.now().toString(),
      from: "user",
      text,
    };
    setMessages((prev) => [...prev, newMsg]);
    setInput("");
    setIsBotTyping(true);
    scrollToBottom();

    setTimeout(() => handleBotReply(text), 1200);
  };

  const handleBotReply = (text: string) => {
    setIsBotTyping(false);

    let reply: LocalMessage = {
      id: Date.now().toString(),
      from: "bot",
      text: "Let me connect you to a human agent for more help.",
    };

    if (text.toLowerCase().includes("payment")) {
      reply = {
        ...reply,
        text: "For payment or billing issues, please ensure your card details are valid. Would you like to talk to our billing team?",
        suggestions: ["Yes, connect me", "Retry payment", "Back to menu"],
      };
    } else if (text.toLowerCase().includes("surrogate")) {
      reply = {
        ...reply,
        text: "To apply as a surrogate, please visit the 'Become a Surrogate' page or contact an agent. Would you like help connecting with an agent?",
        suggestions: ["Yes, connect me", "Learn more", "Back to menu"],
      };
    } else if (text.toLowerCase().includes("agent")) {
      reply = {
        ...reply,
        text: "Connecting you to a customer support agent. Please wait while we find someone to assist you...",
      };
    } else if (text.toLowerCase().includes("back")) {
      reply = {
        ...reply,
        text: "What would you like to do?",
        suggestions: ["Payment issue", "Find a surrogate", "Talk to agent"],
      };
    }

    setMessages((prev) => [...prev, reply]);
    scrollToBottom();
  };

  const handleSuggestionPress = (suggestion: string) => {
    sendMessage(suggestion);
  };

  return (
    <KeyboardAvoidingWrapper>
      <SafeAreaView style={{ flex: 1 }}>
        <YStack flex={1} padding={20}>
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <YStack
                alignSelf={item.from === "user" ? "flex-end" : "flex-start"}
                backgroundColor={item.from === "user" ? "#0E0E55" : "#f2f2f2"}
                borderRadius={16}
                padding={10}
                marginVertical={4}
                maxWidth="80%"
              >
                <Text color={item.from === "user" ? "#FFFFFF" : "#0E0E55"}>
                  {item.text}
                </Text>

                {item.from === "bot" && item.suggestions && (
                  <YStack style={{ marginTop: 8 }}>
                    {item.suggestions.map((suggestion, idx) => (
                      <TouchableOpacity
                        key={idx}
                        onPress={() => handleSuggestionPress(suggestion)}
                        style={{
                          backgroundColor: "#0E0E55",
                          borderRadius: 20,
                          paddingVertical: 6,
                          paddingHorizontal: 14,
                          marginTop: 6,
                        }}
                      >
                        <Text color="#FFFFFF" fontSize={13}>
                          {suggestion}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </YStack>
                )}
              </YStack>
            )}
            ListFooterComponent={
              isBotTyping ? (
                <YStack
                  alignSelf="flex-start"
                  backgroundColor="#f2f2f2"
                  borderRadius={16}
                  padding={10}
                  marginVertical={6}
                  maxWidth="60%"
                >
                  <TypingIndicator />
                </YStack>
              ) : null
            }
            keyboardShouldPersistTaps="handled"
            contentInsetAdjustmentBehavior="automatic"
            showsVerticalScrollIndicator={false}
            onContentSizeChange={scrollToBottom}
          />

          {/* Input */}
          <XStack alignItems="center" gap={8} paddingVertical={10}>
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Type your message..."
              onSubmitEditing={() => sendMessage(input)}
              returnKeyType="send"
              style={{
                flex: 1,
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 25,
                paddingHorizontal: 16,
                paddingVertical: 8,
              }}
            />
            <TouchableOpacity onPress={() => sendMessage(input)}>
              <Ionicons name="send" size={24} color="#0E0E55" />
            </TouchableOpacity>
          </XStack>
        </YStack>
      </SafeAreaView>
    </KeyboardAvoidingWrapper>
  );
}
