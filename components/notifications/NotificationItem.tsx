import React from "react";
import { XStack, YStack, Text, Paragraph, Separator } from "tamagui";

export type Notification = {
  id: string;
  type: string;
  title: string;
  message: string;
  time: string;
  icon: string;
};

type Props = {
  item: Notification;
};

const NotificationItem = ({ item }: Props) => {
  return (
    <>
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

      <Separator borderColor="$gray5" marginVertical="$1" />
    </>
  );
};

export default NotificationItem;
