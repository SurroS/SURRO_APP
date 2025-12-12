// /app/(tabs)/chat/index.tsx
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

import { getConversations } from "@/services/chatApi";

interface Conversation {
  id: string;
  lastMessage?: { content: string; createdAt?: string };
  participants: { id: string; name: string; avatarUrl?: string; role?: string }[];
}

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
        const result = await getConversations();
        if (!active) return;

        setConversations(Array.isArray(result) ? result : []);
      } catch (err) {
        console.warn("Failed to load conversations", err);
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
          <Avatar circular size={50}>
            <Avatar.Image
              src={
                other?.avatarUrl && other.avatarUrl.length > 0
                  ? other.avatarUrl
                  : "https://placehold.co/100x100"
              }
            />
          </Avatar>

          <YStack marginLeft={12} width="75%">
            <Text fontSize={16} fontWeight="700" color={colors.primary}>
              {other?.name || "Unknown User"}
            </Text>

            <Text
              fontSize={13}
              color={colors.secondaryGray}
              numberOfLines={1}
            >
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
      <YStack
        flex={1}
        paddingHorizontal={20}
        paddingTop={20}
        justifyContent="center"
      >
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
