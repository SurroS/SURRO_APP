// components/notifications/NotificationItem.tsx
import React from "react";
import { XStack, YStack, Text, Separator, Image } from "tamagui";

export type Notification = {
  id: string;
  type: "profile" | "message" | "profileSetup" | "views";
  title: string;
  message: string;
  time: string;
};

// Local icon imports
import messageIcon from "@/assets/images/message-icon.png";
import profileSetup2 from "@/assets/images/profile-setup-2.png";
import profileSetupIcon from "@/assets/images/profile-setup-icon.png";
import profileView from "@/assets/images/profile-view.png";

type Props = {
  item: Notification;
};

// Icon mapping (without colored circle)
const iconStyles: Record<Notification["type"], { icon: any }> = {
  profile: { icon: profileSetupIcon },
  message: { icon: messageIcon },
  profileSetup: { icon: profileSetup2 },
  views: { icon: profileView },
};

// Font sizes and line heights based on Figma design
const FONT = {
  title: { fontSize: 16, lineHeight: 26 }, // Body/Base: 16px, line-height 160%
  message: { fontSize: 14, lineHeight: 21 }, // Body/Small Base: 14px, line-height 150%
};

const NotificationItem = ({ item }: Props) => {
  const { icon } = iconStyles[item.type];

  return (
    <YStack>
      <XStack
        alignItems="center"
        justifyContent="space-between"
        paddingVertical="$3"
        paddingHorizontal="$4"
      >
        {/* Left section: Icon + text */}
        <XStack alignItems="center" gap="$3" flex={1}>
          {/* Icon  */}
          <Image source={icon} width={22} height={22} resizeMode="contain" />

          {/* Title and message */}
          <YStack flex={1}>
            <Text
              fontFamily="Body/Base"
              fontWeight="600" // Regular
              fontSize={FONT.title.fontSize}
              lineHeight={FONT.title.lineHeight}
              color="#212121"
            >
              {item.title}
            </Text>
            <Text
              fontFamily="Body/Small Base"
              fontWeight="600" // Regular
              fontSize={FONT.message.fontSize}
              lineHeight={FONT.message.lineHeight}
              color="#545453"
              numberOfLines={2}
            >
              {item.message}
            </Text>
          </YStack>
        </XStack>

        {/* Right section: Time */}
        <Text
          fontFamily="Body/Small Base"
          fontWeight="600"
          fontSize={FONT.message.fontSize}
          lineHeight={FONT.message.lineHeight}
          color="#545453"
        >
          {item.time}
        </Text>
      </XStack>

      {/* Subtle separator line */}
      <Separator borderColor="$text" opacity={0.1} marginLeft={60} />
    </YStack>
  );
};

export default NotificationItem;
