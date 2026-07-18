import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Text, Avatar } from "tamagui";
import { useRouter, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import HelpServiceButton from "@/components/HelpServiceButton";
import { GetAllChat } from "@/services/chatApi";
import { useAuthStore } from "@/store/auth";
import { useChatStore } from "@/store/chatStore";
import type { Conversation, Participants } from "@/types/chat";

function normalizeParticipant(p: any): Participants {
  return {
    userId: p.userId ?? p.id ?? "",
    name: p.userName ?? p.name ?? p.username ?? p.displayName ?? p.fullName ?? "",
    avatarUrl: p.avatarUrl ?? p.avatar ?? p.profilePicture ?? "",
    role: p.role ?? "",
    conversationId: p.conversationId,
  } as Participants;
}

function getOtherParticipant(conversation: Conversation, myId: string | null): Participants | undefined {
  // Backend returns `participant` (singular object), not `participants` (array)
  if (conversation.participant) {
    return normalizeParticipant(conversation.participant);
  }
  const participants = (conversation.participants as any[])?.map(normalizeParticipant);
  if (!participants?.length) return undefined;
  const other = participants.find((p) => p.userId !== myId);
  return other ?? participants[0];
}

function timeAgo(dateStr?: string): string {
  if (!dateStr) return "";
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "now";
  if (diffMin < 60) return `${diffMin}m`;
  const diffHrs = Math.floor(diffMin / 60);
  if (diffHrs < 24) return `${diffHrs}h`;
  const diffDays = Math.floor(diffHrs / 24);
  if (diffDays < 7) return `${diffDays}d`;
  return new Date(dateStr).toLocaleDateString([], { month: "short", day: "numeric" });
}

function roleLabel(role?: string): string {
  if (role === "SURROGATE") return "Surrogate";
  if (role === "INTENDED_PARENT") return "Parent";
  if (role === "AGENT") return "Agent";
  return role ?? "";
}

export default function ChatListScreen() {
  const router = useRouter();
  const setChatUnreadCount = useAuthStore((s) => s.setChatUnreadCount);
  const chatStore = useChatStore();
  const [conversations, setConversations] = useState<Conversation[]>(chatStore.conversations);
  const [isLoading, setIsLoading] = useState(!chatStore.initialized);
  const currentUser = useAuthStore((s) => s.user);
  const myId = currentUser?.id ?? null;
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setIsLoading(true);

    try {
      const result = await GetAllChat();
      if (Array.isArray(result)) {
        console.log("Chat conversations:", JSON.stringify(result[0]?.participants, null, 2));
        chatStore.setConversations(result);
        setConversations(result);
        const total = result.reduce((sum, c) => sum + (c.unreadCount ?? 0), 0);
        setChatUnreadCount(total);
      }
    } catch (err) {
      console.warn("Chat list failed:", err);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [currentUser?.id]);

  // Skip re-fetch on focus if already initialized (preloaded by bootstrapper)
  useFocusEffect(
    useCallback(() => {
      if (!chatStore.initialized) {
        fetchData();
      }
    }, [chatStore.initialized, fetchData]),
  );

  const filtered = conversations.filter((c) => {
    const other = getOtherParticipant(c, myId);
    const name = other?.name ?? "";
    return name.toLowerCase().includes(search.toLowerCase());
  });

  const renderItem = ({ item }: { item: Conversation }) => {
    const other = getOtherParticipant(item, myId);
    const isUnread = (item.unreadCount ?? 0) > 0;

    return (
      <TouchableOpacity
        style={styles.chatRow}
        activeOpacity={0.6}
        onPress={() =>
          router.push({
            pathname: "/(tabs)/chat/conversation",
            params: {
              conversationId: item.id,
              otherName: other?.name ?? "",
              otherRole: other?.role ?? "",
              otherAvatar: other?.avatarUrl ?? "",
              otherUserId: other?.userId ?? "",
            },
          })
        }
      >
        <View style={styles.avatarWrap}>
          <Avatar circular size={52}>
            {other?.avatarUrl ? (
              <Avatar.Image src={other.avatarUrl} />
            ) : null}
            <Avatar.Fallback backgroundColor="#E0E0E0">
              <Text style={styles.avatarText}>
                {(other?.name?.charAt(0) ?? "?").toUpperCase()}
              </Text>
            </Avatar.Fallback>
          </Avatar>

        </View>

        <View style={styles.chatContent}>
          <View style={styles.chatTopRow}>
            <Text style={styles.chatName} numberOfLines={1}>
              {other?.name ?? "Unknown"}
            </Text>
            <Text style={styles.chatTime}>
              {timeAgo(item.lastMessage?.createdAt)}
            </Text>
          </View>

          <View style={styles.chatBottomRow}>
            <Text style={styles.chatLastMessage} numberOfLines={1}>
              {item.lastMessage?.content ?? "No messages yet"}
            </Text>

            <View style={styles.chatBottomRight}>
              {other?.role && other.role !== "ALL" && (
                <View style={styles.roleBadge}>
                  <Text style={styles.roleBadgeText}>
                    {roleLabel(other.role)}
                  </Text>
                </View>
              )}

              {isUnread && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadBadgeText}>
                    {item.unreadCount! > 99 ? "99+" : item.unreadCount}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.headerTitle}>Messages</Text>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={18} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search conversations..."
            placeholderTextColor="#aaa"
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Ionicons name="close-circle" size={18} color="#999" />
            </TouchableOpacity>
          )}
        </View>

        {/* List */}
        {isLoading ? (
          <ActivityIndicator size="large" color="#0E0E55" style={{ marginTop: 40 }} />
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            refreshing={refreshing}
            onRefresh={() => fetchData(true)}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyWrap}>
                <Ionicons name="chatbubbles-outline" size={48} color="#ccc" />
                <Text style={styles.emptyText}>
                  {search
                    ? "No matching conversations"
                    : "No conversations yet"}
                </Text>
              </View>
            }
          />
        )}
      </View>

      <HelpServiceButton />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  inner: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },

  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0E0E55",
    marginBottom: 12,
  },

  /* Search */
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 40,
    marginBottom: 12,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 14, color: "#111", padding: 0 },

  /* List */
  listContent: { paddingBottom: 80 },

  /* Row */
  chatRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#EEE",
  },

  /* Avatar */
  avatarWrap: {
    position: "relative",
    marginRight: 14,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#555",
  },
  /* Content */
  chatContent: { flex: 1 },
  chatTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  chatName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
    flex: 1,
    marginRight: 8,
  },
  chatTime: { fontSize: 12, color: "#999" },

  chatBottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 2,
  },
  chatLastMessage: { fontSize: 14, color: "#666", flex: 1, marginRight: 8 },

  chatBottomRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  roleBadge: {
    backgroundColor: "#F0F0F0",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  roleBadgeText: { fontSize: 10, fontWeight: "500", color: "#555" },
  unreadBadge: {
    backgroundColor: "red",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  unreadBadgeText: { fontSize: 11, fontWeight: "700", color: "#FFF" },

  /* Empty */
  emptyWrap: { alignItems: "center", marginTop: 60 },
  emptyText: { fontSize: 14, color: "#aaa", marginTop: 12 },
});
