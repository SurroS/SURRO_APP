// app/(tabs)/chat/ChatListScreen.tsx
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
import { Conversation } from "@/types/chat";
import { secureGet } from "@/utils/storage";
import colors from "@/hooks/colors";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ChatListScreen() {
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        setIsLoading(true);
        const token = await secureGet("token");
        const role = await secureGet("role");
        setUserRole(role);

        const res = await fetch(
          "https://dev.surrosantara.space/api/v1/chat/conversation",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) throw new Error("Failed to load conversations");

        const data = await res.json();
        setConversations(data);
      } catch (err) {
        console.error("Chat fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChats();
  }, []);

  const renderItem = ({ item }: { item: Conversation }) => {
    const otherUser = item.participants.find((p) => p.role !== userRole);

    return (
      <TouchableOpacity
        style={styles.chatCard}
        onPress={() =>
          router.push({
            pathname: "/(tabs)/chat/ChatBoxScreen",
            params: { conversationId: item.id },
          })
        }
      >
        <XStack alignItems="center">
          <Avatar circular size={50}>
            <Avatar.Image
              src={otherUser?.avatarUrl || "https://placehold.co/100x100"}
            />
          </Avatar>
          <YStack marginLeft={12} width="75%">
            <Text fontSize={16} fontWeight="600" color={colors.primary}>
              {otherUser?.name || "Unknown"}
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

  const handleSupportPress = () => {
    // Navigate to support bot / customer care screen
    router.push("/(tabs)/chat/supportChat");
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
        ) : conversations.length > 0 ? (
          <FlatList
            data={conversations}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 80 }}
          />
        ) : (
          <YStack alignItems="center" justifyContent="center" flex={1}>
            <Ionicons
              name="chatbubble-outline"
              size={60}
              color={colors.secondaryGray}
            />
            <Text color={colors.secondaryGray} marginTop={10}>
              No messages yet
            </Text>
          </YStack>
        )}
      </YStack>

      {/* Floating Customer Support Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={handleSupportPress}
        activeOpacity={0.8}
      >
        <Ionicons name="headset" size={26} color="#fff" />
      </TouchableOpacity>
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
  fab: {
    position: "absolute",
    bottom: 25,
    right: 25,
    backgroundColor: "#0E0E55",
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 6,
  },
});
