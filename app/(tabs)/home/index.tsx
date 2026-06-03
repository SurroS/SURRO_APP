import { useCallback, useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Pressable, View, StyleSheet, ScrollView, RefreshControl } from "react-native";
import { YStack, Text } from "tamagui";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import AgentScreen from "@/components/roles/agent/agent";
import ParentScreen from "@/components/roles/parent/parent";
import SurrogateScreen from "@/components/roles/surrogate/surrogate";

import { useAuth } from "@/hooks/useAuth";
import { useNotificationStore } from "@/store/notifications";
import { useSurrogateProfile } from "@/hooks/profile/useSurrogateProfile";
import { useAgentProfile } from "@/hooks/profile/useAgentProfile";
import { useParentProfile } from "@/hooks/profile/useParentProfile";

export default function HomeIndex() {
  const router = useRouter();
  const { user } = useAuth();
  const role = user?.role?.trim();

  const { fetchProfile: fetchSurrogate, surrogateProfile } = useSurrogateProfile();
  const { fetchProfile: fetchAgent, agentProfile } = useAgentProfile();
  const { fetchProfile: fetchParent, parentProfile } = useParentProfile();

  const notifications = useNotificationStore((s) => s.notifications);
  const unreadCount = notifications.filter((n) => !n.read).length;
  const fetchNotifications = useNotificationStore((s) => s.fetchNotifications);
  const [refreshing, setRefreshing] = useState(false);

  // ---- AUTO-FETCH PROFILE ON MOUNT ----
  useEffect(() => {
    fetchNotifications();
    switch (role) {
      case "SURROGATE":
        fetchSurrogate();
        break;
      case "AGENT":
        fetchAgent();
        break;
      case "INTENDED_PARENT":
        fetchParent();
        break;
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchNotifications();
      if (role === "SURROGATE") {
        await fetchSurrogate(true);
      } else if (role === "AGENT") {
        await fetchAgent();
      } else if (role === "INTENDED_PARENT") {
        await fetchParent(true);
      }
    } catch (e) {
      console.error("[HomeIndex] Refresh failed", e);
    } finally {
      setRefreshing(false);
    }
  }, [role, fetchSurrogate, fetchAgent, fetchParent, fetchNotifications]);

  return (
    <YStack style={{ flex: 1, backgroundColor: "#FFFFFF" }} padding="$4">
      <SafeAreaView
        style={{ flex: 1, backgroundColor: "#FFFFFF" }}
        edges={["top", "left", "right"]}
      >
        <Pressable
          onPress={() => router.push("/notifications")}
          style={{ alignSelf: "flex-end", paddingBottom: 8 }}
        >
          <MaterialCommunityIcons name="bell-outline" size={24} color="black" />
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </Pressable>

        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#0E0E55"]}
            />
          }
          showsVerticalScrollIndicator={false}
        >
          {role === "SURROGATE" && <SurrogateScreen />}
          {role === "AGENT" && <AgentScreen />}
          {role === "INTENDED_PARENT" && <ParentScreen />}
        </ScrollView>
      </SafeAreaView>
    </YStack>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: "absolute",
    top: -6,
    right: -6,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 3,
  },
  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "700",
  },
});
