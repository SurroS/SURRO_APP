import React from "react";
import { ScrollView } from "react-native";
import { YStack, XStack, Text, Separator, Paragraph } from "tamagui";
import { useRouter } from "expo-router";

// Mock notification data (replace later with API or Zustand store)
const notifications = [
  {
    id: "1",
    type: "profile",
    title: "Profile setup",
    message: "You need to update your profile information",
    time: "1hr",
    icon: "⚠️",
  },
  {
    id: "2",
    type: "message",
    title: "Message",
    message: "You have 1 unread message",
    time: "1hr",
    icon: "💬",
  },
  {
    id: "3",
    type: "profile",
    title: "Profile setup",
    message: "You have successfully set up your profile",
    time: "1hr",
    icon: "✅",
  },
  {
    id: "4",
    type: "views",
    title: "Profile views",
    message: "Your profile was viewed once today",
    time: "1hr",
    icon: "👀",
  },
];

const NotificationScreen = () => {
  const router = useRouter();

  return (
    <YStack flex={1} backgroundColor="$background" paddingHorizontal="$4" paddingTop="$4">
      {/* Header */}
      <XStack justifyContent="space-between" alignItems="center" marginBottom="$3">
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

      {/* Notifications list */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {notifications.map((item, index) => (
          <YStack key={item.id}>
            <XStack alignItems="center" justifyContent="space-between" paddingVertical="$3">
              {/* Left side icon and message */}
              <XStack alignItems="center" gap="$3" flex={1}>
                <Text fontSize={20}>{item.icon}</Text>
                <YStack flex={1}>
                  <Text fontWeight="600" color="$text">
                    {item.title}
                  </Text>
                  <Paragraph color="$gray10" fontSize={14}>
                    {item.message}
                  </Paragraph>
                </YStack>
              </XStack>

              {/* Right side time */}
              <Text color="$gray9" fontSize={13}>
                {item.time}
              </Text>
            </XStack>

            {/* Divider except after last item */}
            {index !== notifications.length - 1 && (
              <Separator borderColor="$gray5" marginVertical="$1" />
            )}
          </YStack>
        ))}
      </ScrollView>
    </YStack>
  );
};

export default NotificationScreen;