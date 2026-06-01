import React, { useState } from "react";
import { ScrollView, Modal } from "react-native";
import { YStack, XStack, Text, Button, View } from "tamagui";
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
  const markRead = useNotificationStore((s) => s.markRead);
  const deleteNotification = useNotificationStore((s) => s.deleteNotification);
  const selectNotification = useNotificationStore((s) => s.selectNotification);
  const deselectNotification = useNotificationStore(
    (s) => s.deselectNotification,
  );
  const selectAll = useNotificationStore((s) => s.selectAll);
  const clearSelection = useNotificationStore((s) => s.clearSelection);

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
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <View margin={20}>
        <ScreenHeader title="Notifications" onBackPress={() => router.back()} />
      </View>

      <YStack flex={1} paddingHorizontal="$4" paddingTop="$4" gap="$4">
        {/* Notification List */}
        <ScrollView showsVerticalScrollIndicator={false}>
          <YStack gap="$2" paddingBottom="$8">
            {notifications.length === 0 ? (
              <YStack alignItems="center" marginTop={40}>
                <Text color="#777" fontSize={14}>
                  No notifications yet
                </Text>
              </YStack>
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
          <XStack justifyContent="space-around" marginBottom={10}>
            <Button backgroundColor="#0E0E55" onPress={() => { if (isProcessing) return; selectAll(); }} disabled={isProcessing}>
              Select All
            </Button>

            <Button
              backgroundColor="#0E0E55"
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
              backgroundColor={colors.primary}
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
        )}
      </YStack>

      <Modal visible={!!viewingNotification} transparent animationType="fade">
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
                alignSelf="center"
                color="#333"
                fontWeight={600}
                marginBottom={20}
              >
                {viewingNotification?.body || "No Notifications at the moment."}
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
