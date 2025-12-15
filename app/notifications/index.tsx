import React, { useState } from "react";
import { ScrollView, Modal } from "react-native";
import { YStack, XStack, Text, Button, View } from "tamagui";
import { useNotificationStore, Notification } from "@/store/notifications";
import NotificationItem from "@/components/notifications/NotificationItem";
import colors from "@/hooks/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenHeader } from "@/components/auth";
import { router } from "expo-router";

const NotificationsScreen = () => {
  const notifications = useNotificationStore((s) => s.notifications);
  const selected = useNotificationStore((s) => s.selected);
  const markRead = useNotificationStore((s) => s.markRead);
  const deleteNotification = useNotificationStore((s) => s.deleteNotification);
  const selectNotification = useNotificationStore((s) => s.selectNotification);
  const deselectNotification = useNotificationStore(
    (s) => s.deselectNotification
  );
  const selectAll = useNotificationStore((s) => s.selectAll);
  const clearSelection = useNotificationStore((s) => s.clearSelection);

  const [viewingNotification, setViewingNotification] =
    useState<Notification | null>(null);

  const handlePress = (n: Notification) => {
    if (selected.length > 0) {
      selected.includes(n.id)
        ? deselectNotification(n.id)
        : selectNotification(n.id);
    } else {
      markRead(n.id);
      setViewingNotification(n);
    }
  };

  const handleLongPress = (n: Notification) => {
    if (!selected.includes(n.id)) selectNotification(n.id);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
      <View margin={20}>
        <ScreenHeader title="Notifications" onBackPress={() => router.back()} />
      </View>

      <YStack flex={1} paddingHorizontal="$4" paddingTop="$4" gap="$4">
        {/* Notification List */}
        <ScrollView showsVerticalScrollIndicator={false}>
          <YStack gap="$2" paddingBottom="$8">
            {notifications.map((n) => (
              <NotificationItem
                key={n.id}
                item={n}
                selected={selected.includes(n.id)}
                onPress={() => handlePress(n)}
                onLongPress={() => handleLongPress(n)}
              />
            ))}
          </YStack>
        </ScrollView>

        {/* Selection Actions */}
        {selected.length > 0 && (
          <XStack justifyContent="space-around" marginBottom={10}>
            <Button backgroundColor={colors.primary} onPress={selectAll}>
              Select All
            </Button>

            <Button
              backgroundColor={colors.primary}
              onPress={() => {
                selected.forEach((id) => markRead(id));
                clearSelection();
              }}
            >
              Mark Read
            </Button>
            <Button
              backgroundColor={colors.primary}
              onPress={() => {
                selected.forEach((id) => deleteNotification(id));
                clearSelection();
              }}
            >
              Delete
            </Button>
          </XStack>
        )}
      </YStack>

      {/* Custom modal for full notification (scrollable) */}
      <Modal visible={!viewingNotification} transparent animationType="fade">
        <YStack
          flex={1}
          backgroundColor="rgba(0,0,0,0.5)"
          justifyContent="center"
          alignItems="center"
          padding={20}
        >
          <YStack
            width="100%"
            maxHeight="80%"
            backgroundColor="white"
            borderRadius={12}
            padding={20}
          >
            <ScrollView>
              <Text fontWeight="700" fontSize={18} marginBottom={10}>
                {viewingNotification?.title}
              </Text>
              <Text
                fontSize={14}
                lineHeight={22}
                color="#333"
                marginBottom={20}
              >
                {viewingNotification?.body || "No details provided."}
              </Text>
            </ScrollView>
            <Button
              backgroundColor={colors.primary}
              onPress={() => setViewingNotification(null)}
            >
              Close
            </Button>
          </YStack>
        </YStack>
      </Modal>
    </SafeAreaView>
  );
};

export default NotificationsScreen;
