import React, { useEffect, useState } from "react";
import { ScrollView, Modal, ActivityIndicator, TouchableOpacity, View } from "react-native";
import { YStack, XStack, Text, Button } from "tamagui";
import { Ionicons } from "@expo/vector-icons";
import { AppNotification } from "@/store/notifications/types";
import { useNotificationStore } from "@/store/notifications";
import NotificationItem from "@/components/notifications/NotificationItem";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenHeader } from "@/components/auth";
import colors from "@/hooks/colors";
import { router } from "expo-router";

const NotificationsScreen = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const notifications = useNotificationStore((s) => s.notifications);
  const selected = useNotificationStore((s) => s.selected);
  const isLoadingNotifications = useNotificationStore((s) => s.isLoadingNotifications);
  const markRead = useNotificationStore((s) => s.markRead);
  const deleteNotification = useNotificationStore((s) => s.deleteNotification);
  const selectNotification = useNotificationStore((s) => s.selectNotification);
  const deselectNotification = useNotificationStore(
    (s) => s.deselectNotification,
  );
  const selectAll = useNotificationStore((s) => s.selectAll);
  const clearSelection = useNotificationStore((s) => s.clearSelection);
  const fetchNotifications = useNotificationStore((s) => s.fetchNotifications);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const [viewingNotification, setViewingNotification] =
    useState<AppNotification | null>(null);

  const handlePress = (n: AppNotification) => {
    if (selected.length > 0) {
      selected.includes(n.id)
        ? deselectNotification(n.id)
        : selectNotification(n.id);
    } else {
      markRead(n.id);
      setViewingNotification(n);
    }
  };

  const handleLongPress = (n: AppNotification) => {
    if (!selected.includes(n.id)) selectNotification(n.id);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 4 }}>
        <ScreenHeader title="Notifications" onBackPress={() => router.back()} />
      </View>

      <YStack flex={1} paddingHorizontal={16} paddingTop={8}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
          <YStack gap={10}>
            {isLoadingNotifications ? (
              <View style={{ alignItems: "center", marginTop: 60 }}>
                <ActivityIndicator size="large" color={colors.primary} />
              </View>
            ) : notifications.length === 0 ? (
              <View style={{ alignItems: "center", marginTop: 80, gap: 16 }}>
                <View
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: 36,
                    backgroundColor: "#F0F0FF",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Ionicons name="notifications-off-outline" size={32} color={colors.primary} />
                </View>
                <Text fontSize={17} fontWeight="600" color="#333">
                  No notifications yet
                </Text>
                <Text fontSize={14} color="#999" textAlign="center" maxWidth={260}>
                  When you get notifications from matches, payments, and updates, they'll show up here.
                </Text>
                <TouchableOpacity
                  onPress={() => fetchNotifications()}
                  style={{
                    marginTop: 8,
                    paddingHorizontal: 24,
                    paddingVertical: 10,
                    borderRadius: 20,
                    backgroundColor: colors.primary,
                  }}
                >
                  <Text color="#fff" fontWeight="600" fontSize={14}>
                    Refresh
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              notifications.map((n) => (
                <NotificationItem
                  key={n.id}
                  item={n}
                  selected={selected.includes(n.id)}
                  onPress={() => handlePress(n)}
                  onLongPress={() => handleLongPress(n)}
                />
              ))
            )}
          </YStack>
        </ScrollView>

        {/* Selection Actions */}
        {selected.length > 0 && (
          <View
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              paddingHorizontal: 16,
              paddingVertical: 12,
              paddingBottom: 28,
              backgroundColor: "#fff",
              borderTopWidth: 1,
              borderTopColor: "#f0f0f0",
            }}
          >
            <XStack gap={10}>
              <Button
                flex={1}
                height={44}
                backgroundColor="#f5f5f5"
                borderRadius={10}
                color="#333"
                fontWeight="600"
                fontSize={14}
                onPress={() => { selectAll(); }}
                disabled={isProcessing}
              >
                Select All
              </Button>
              <Button
                flex={1}
                height={44}
                backgroundColor="#f5f5f5"
                borderRadius={10}
                color="#333"
                fontWeight="600"
                fontSize={14}
                onPress={() => {
                  if (isProcessing) return;
                  setIsProcessing(true);
                  selected.forEach((id) => markRead(id));
                  clearSelection();
                  setIsProcessing(false);
                }}
                disabled={isProcessing}
              >
                Mark Read
              </Button>
              <Button
                flex={1}
                height={44}
                backgroundColor="#FEE2E2"
                borderRadius={10}
                color="#DC2626"
                fontWeight="600"
                fontSize={14}
                onPress={() => {
                  if (isProcessing) return;
                  setIsProcessing(true);
                  selected.forEach((id) => deleteNotification(id));
                  clearSelection();
                  setIsProcessing(false);
                }}
                disabled={isProcessing}
              >
                Delete
              </Button>
            </XStack>
          </View>
        )}
      </YStack>

      {/* Detail Modal */}
      <Modal visible={!!viewingNotification} transparent animationType="fade">
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setViewingNotification(null)}
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
            padding: 24,
          }}
        >
          <TouchableOpacity activeOpacity={1} onPress={() => {}} style={{ width: "100%", maxWidth: 360 }}>
            <YStack
              backgroundColor="#fff"
              borderRadius={16}
              padding={24}
              gap={16}
              maxHeight={420}
            >
              <XStack justifyContent="space-between" alignItems="flex-start">
                <Text fontWeight="700" fontSize={18} color="#1A1A1A" flex={1} mr={12}>
                  {viewingNotification?.title}
                </Text>
                <TouchableOpacity onPress={() => setViewingNotification(null)}>
                  <Ionicons name="close" size={22} color="#999" />
                </TouchableOpacity>
              </XStack>

              <ScrollView
                style={{ maxHeight: 260 }}
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled
              >
                <Text
                  fontSize={15}
                  lineHeight={22}
                  color="#555"
                >
                  {viewingNotification?.body || "No content available."}
                </Text>
              </ScrollView>
            </YStack>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

export default NotificationsScreen;
