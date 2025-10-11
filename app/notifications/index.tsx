import React from "react";
import { ScrollView } from "react-native";
import { YStack, XStack, Text } from "tamagui";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import NotificationItem from "@/components/notifications/NotificationItem";
import { notifications } from "@/constants/notifications";

const NotificationScreen = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <YStack flex={1} backgroundColor="$background" paddingHorizontal="$4" paddingTop="$4" gap="$4">
        {/* Header */}
        <XStack justifyContent="space-between" alignItems="center">
          <Text fontSize={20} fontWeight="700" color="$text">
            Notifications
          </Text>
          <Text
            fontSize={16}
            color="$blue10"
            onPress={() => router.back()}
            pressStyle={{ opacity: 0.6 }}
          >
            Back
          </Text>
        </XStack>

        {/* Notification List */}
        <ScrollView showsVerticalScrollIndicator={false}>
          <YStack gap="$2" paddingBottom="$8">
            {notifications.map((item) => (
              <NotificationItem key={item.id} item={item} />
            ))}
          </YStack>
        </ScrollView>
      </YStack>
    </SafeAreaView>
  );
};

export default NotificationScreen;
