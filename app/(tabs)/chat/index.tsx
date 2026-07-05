import React, { useCallback, useEffect, useState } from "react";
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
import { secureGet } from "@/utils/storage";
import { GetAllChat } from "@/services/chatApi";
import type { Conversation, Participants } from "@/types/chat";

const ROLES = [
  { key: "ALL", label: "All" },
  { key: "SURROGATE", label: "Surrogate" },
  { key: "INTENDED_PARENT", label: "Parent" },
  { key: "AGENT", label: "Agent" },
] as const;

function getOtherParticipant(conversation: Conversation, myId: string | null): Participants | undefined {
  return conversation.participants?.find((p) => p.id !== myId) ?? conversation.participants?.[0];
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
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [myId, setMyId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    const uid = await secureGet("userId");
    setMyId(uid ?? null);

    try {
      const result = await GetAllChat();
      if (Array.isArray(result)) {
        setConversations(result);
      }
    } catch (err) {
      console.warn("Chat list failed:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData]),
  );

  const filtered = conversations.filter((c) => {
    const other = getOtherParticipant(c, myId);
    const name = other?.name ?? "";
    const matchesSearch = name.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "ALL" || other?.role === roleFilter;
    return matchesSearch && matchesRole;
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
            params: { conversationId: item.id },
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

          {isUnread && <View style={styles.unreadDot} />}
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

        {/* Role filter chips */}
        <View style={styles.filterRow}>
          {ROLES.map((r) => (
            <TouchableOpacity
              key={r.key}
              style={[styles.filterChip, roleFilter === r.key && styles.filterChipActive]}
              onPress={() => setRoleFilter(r.key)}
            >
              <Text style={[styles.filterChipText, roleFilter === r.key && styles.filterChipTextActive]}>
                {r.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* List */}
        {isLoading ? (
          <ActivityIndicator size="large" color="#0E0E55" style={{ marginTop: 40 }} />
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyWrap}>
                <Ionicons name="chatbubbles-outline" size={48} color="#ccc" />
                <Text style={styles.emptyText}>
                  {search || roleFilter !== "ALL"
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

  /* Filter chips */
  filterRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#F0F0F0",
  },
  filterChipActive: {
    backgroundColor: "#0E0E55",
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#666",
  },
  filterChipTextActive: {
    color: "#FFF",
  },

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
  unreadDot: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#0E0E55",
    borderWidth: 2,
    borderColor: "#FFF",
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
    backgroundColor: "#0E0E55",
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
