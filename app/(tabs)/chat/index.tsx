import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  View,
} from "react-native";
import { YStack, XStack, Text, Avatar } from "tamagui";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import HelpServiceButton from "@/components/HelpServiceButton";
import colors from "@/hooks/colors";
import { secureGet } from "@/utils/storage";
import { GetAllChat } from "@/services/chatApi";
import { Image } from "react-native";

// 👇 local fallback avatar
import defaultAvatar from "@/assets/images/agentImage.png";

interface Conversation {
  id: string;
  lastMessage?: { content: string; createdAt?: string };
  participants: {
    id: string;
    name: string;
    avatarUrl?: string;
    role?: string;
  }[];
}

// 👇 fallback conversations (UI-safe)
const FALLBACK_CONVERSATIONS: Conversation[] = [
  {
    id: "fallback-1",
    lastMessage: { content: "Welcome to chat 👋" },
    participants: [{ id: "u1", name: "Support Team" }],
  },
  {
    id: "fallback-2",
    lastMessage: { content: "This is a sample conversation" },
    participants: [{ id: "u2", name: "Demo User" }],
  },
];

export default function ChatListScreen() {
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [myId, setMyId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    (async () => {
      setIsLoading(true);

      const uid = await secureGet("userId");
      if (!active) return;
      setMyId(uid ?? null);

      try {
        const result = await GetAllChat();
        if (!active) return;

        if (Array.isArray(result) && result.length > 0) {
          setConversations(result);
        } else {
          console.warn("⚠ Empty chat list, using fallback");
          setConversations(FALLBACK_CONVERSATIONS);
        }
      } catch (err) {
        console.warn("❌ Chat list failed, using fallback", err);
        setConversations(FALLBACK_CONVERSATIONS);
      } finally {
        if (active) setIsLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const renderItem = ({ item }: { item: Conversation }) => {
    const other =
      item.participants?.find((p) => p.id !== myId) || item.participants?.[0];

    return (
      <TouchableOpacity
        style={styles.chatCard}
        onPress={() =>
          router.push({
            pathname: "/(tabs)/chat/[conversationId]",
            params: { conversationId: item.id },
          })
        }
      >
        <XStack alignItems="center">
          <Avatar  size={60}>
            {other?.avatarUrl ? (
              <Avatar.Image src={other.avatarUrl} />
            ) : (
              <Avatar.Fallback>
                <Image
                  resizeMode="cover"
                  source={defaultAvatar}
                  style={{
                    width: 50,
                    height: 50, 
                    borderRadius:10,
                    alignSelf: "center",
                  }}
                />
              </Avatar.Fallback>
            )}
          </Avatar>

          <YStack marginLeft={12} width="75%">
            <Text fontSize={16} fontWeight="700" color={colors.primary}>
              {other?.name || "Unknown User"}
            </Text>

            <Text fontSize={13} color={colors.secondaryGray} numberOfLines={1}>
              {item.lastMessage?.content || "No messages yet"}
            </Text>
          </YStack>

          <Ionicons
            name="chevron-forward"
            size={20}
            color={colors.HEADER_ICON_GRAY}
          />
        </XStack>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
      <YStack flex={1} paddingHorizontal={20} paddingTop={20}>
        <Text
          fontSize={20}
          fontWeight="700"
          color={colors.primary}
          marginBottom={15}
        >
          Messages
        </Text>

        {isLoading ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : (
          <FlatList
            data={conversations}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 80 }}
            ListEmptyComponent={
              <View style={{ alignItems: "center", marginTop: 50 }}>
                <Text color={colors.secondaryGray}>No conversations yet</Text>
              </View>
            }
          />
        )}
      </YStack>

      <HelpServiceButton />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  chatCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
});
