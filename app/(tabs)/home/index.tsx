import { useRouter } from "expo-router";
import AgentScreen from "@/components/roles/agent/agent";
import ParentScreen from "@/components/roles/parent/parent";
import SurrogateScreen from "@/components/roles/surrogate/surrogate";
import { useAuth } from "@/hooks/useAuth";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, YStack, Spinner, XStack } from "tamagui";
import { Pressable, View, StyleSheet } from "react-native";
import InactivityDemo from "@/components/notifications/inactivityDemo";
import { useNotificationStore } from "@/store/notifications";

export default function HomeIndex() {
  const Role = useAuth().user?.role?.trim();
  const router = useRouter();

  // Check if there are unread notifications

  const notifications = useNotificationStore((s) => s.notifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <YStack flex={1} padding="$4">
      <SafeAreaView>
        {/* Header */}
        <Pressable
  onPress={() => router.push("/notifications")}
  style={{ justifyContent: "center", alignItems: "flex-end" }}
>
  <MaterialCommunityIcons name="bell-outline" size={24} color="black" />

  {/* Unread count badge */}
  {unreadCount > 0 && (
    <View
      style={{
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
      }}
    >
      <Text style={{ color: "white", fontSize: 10, fontWeight: "700" }}>
        {unreadCount}
      </Text>
    </View>
  )}
</Pressable>

        {/* Role-based content */}
        {Role === "SURROGATE" ? (
          <SurrogateScreen />
        ) : Role === "INTENDED_PARENT" ? (
          <ParentScreen />
        ) : Role === "AGENT" ? (
          <AgentScreen />
        ) : (
          <YStack flex={1} justifyContent="center" alignItems="center">
            <Spinner size="large" />
          </YStack>
        )}

        <InactivityDemo />
      </SafeAreaView>
    </YStack>
  );
}

const styles = StyleSheet.create({
  redDot: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "red",
    borderWidth: 1,
    borderColor: "white",
  },
});
