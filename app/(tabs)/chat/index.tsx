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
import { secureGet } from "@/utils/storage";
import { GetAllChat } from "@/services/chatApi";
import { Image } from "react-native";

// local fallback avatar
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
        }
      } catch (err) {
        console.warn(" Chat list failed something went wrong", err);
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
          <Avatar size={60}>
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
                    borderRadius: 10,
                    alignSelf: "center",
                  }}
                />
              </Avatar.Fallback>
            )}
          </Avatar>

          <YStack marginLeft={12} width="75%">
            <Text fontSize={16} fontWeight="700" color="#0E0E55">
              {other?.name || "Unknown User"}
            </Text>

            <Text fontSize={13} color="#444444" numberOfLines={1}>
              {item.lastMessage?.content || "No messages yet"}
            </Text>
          </YStack>

          <Ionicons name="chevron-forward" size={20} color="#666666" />
        </XStack>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <YStack flex={1} paddingHorizontal={20} paddingTop={20}>
        <Text fontSize={20} fontWeight="700" color="#0E0E55" marginBottom={15}>
          Messages
        </Text>

        {isLoading ? (
          <ActivityIndicator size="large" color="#0E0E55" />
        ) : (
          <FlatList
            data={conversations}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 80 }}
            ListEmptyComponent={
              <View style={{ alignItems: "center", marginTop: 50 }}>
                <Text color="#444444">No conversations yet</Text>
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
