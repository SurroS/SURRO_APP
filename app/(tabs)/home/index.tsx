import { useEffect, useState, useCallback } from "react";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Pressable, View, StyleSheet, ScrollView, RefreshControl } from "react-native";
import { Text, YStack, Spinner } from "tamagui";
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

  const [hydrated, setHydrated] = useState(false);

  const { surrogateProfile, fetchProfile: fetchSurrogate } =
    useSurrogateProfile();
  const { agentProfile, fetchProfile: fetchAgent } = useAgentProfile();
  const { parentProfile, fetchProfile: fetchParent } = useParentProfile();

  const notifications = useNotificationStore((s) => s.notifications);
  const unreadCount = notifications.filter((n) => !n.read).length;
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      if (role === "SURROGATE") {
        await fetchSurrogate(true);
      } else if (role === "AGENT") {
        await fetchAgent();
      } else if (role === "INTENDED_PARENT") {
        await fetchParent(true);
      }
    } catch (e) {
      console.error("Refresh failed", e);
    } finally {
      setRefreshing(false);
    }
  }, [role, fetchSurrogate, fetchAgent, fetchParent]);

  useEffect(() => {
    const hydrate = async () => {
      if (!role) return;

      console.log("[HomeIndex] Hydrating role:", role);

      try {
        if (role === "SURROGATE" && !surrogateProfile) {
          await fetchSurrogate();
        }

        if (role === "AGENT" && !agentProfile) {
          await fetchAgent();
        }

        if (role === "INTENDED_PARENT" && !parentProfile) {
          await fetchParent();
        }
      } catch (e) {
        console.error("[HomeIndex] Hydration failed", e);
      } finally {
        setHydrated(true);
        console.log("[HomeIndex] Hydration complete");
      }
    };

    hydrate();
  }, [role]);

  if (!hydrated) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <YStack flex={1} justifyContent="center" alignItems="center" gap="$3">
          <Spinner size="large" color="#0E0E55" />
          <Text color="#1E1E1E" fontWeight="600">
            Loading your dashboard…
          </Text>
        </YStack>
      </SafeAreaView>
    );
  }

  return (
    <YStack style={{ flex: 1, backgroundColor: "#FFFFFF" }} padding="$4">
      <SafeAreaView
        style={{ flex: 1, backgroundColor: "#FFFFFF" }}
        edges={["top", "left", "right"]}
      >
        <Pressable
          onPress={() => router.push("/notifications")}
          style={{ paddingBottom: 8 }}
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

          {role === "SURROGATE" && surrogateProfile && <SurrogateScreen />}
          {role === "AGENT" && agentProfile && <AgentScreen />}
          {role === "INTENDED_PARENT" && parentProfile && <ParentScreen />}
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
