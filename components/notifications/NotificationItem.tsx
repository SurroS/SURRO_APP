import React from "react";
import { TouchableOpacity } from "react-native";
import { XStack, YStack, Text, Image } from "tamagui";
import { AppNotification } from "@/store/notifications/types";

import colors from "@/hooks/colors";

// Icons
import messageIcon from "@/assets/images/message-icon.png";
import profileSetup2 from "@/assets/images/profile-setup-2.png";
import profileSetupIcon from "@/assets/images/profile-setup-icon.png";
import profileView from "@/assets/images/profile-view.png";

type Props = {
  item?: AppNotification;
  selected?: boolean;
  onPress?: () => void;
  onLongPress?: () => void;
};

const iconByType: Partial<Record<AppNotification["type"], any>> = {
  GENERAL: messageIcon,
  PROFILE_SETUP: profileSetupIcon,
  PROFILE_VIEWS: profileView,
  PROFILE_BOOST: profileSetup2,
  INACTIVITY: messageIcon, // keep it neutral
};

const FONT = {
  title: { fontSize: 16, lineHeight: 26 },
};

const formatTime = (timestamp: number) =>
  new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

const NotificationItem = ({ item, selected, onPress, onLongPress }: Props) => {
  if (!item) return null;

  const icon = iconByType[item.type] ?? messageIcon;

  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.7}
    >
      <YStack
        backgroundColor={selected ? "#dde6ff" : "#fff"}
        borderRadius={10}
        borderWidth={0.5}
        borderColor={colors.gray}
      >
        <XStack
          alignItems="center"
          justifyContent="space-between"
          paddingVertical="$3"
          paddingHorizontal="$4"
        >
          <XStack alignItems="center" gap="$3" flex={1}>
            <Image source={icon} width={22} height={22} resizeMode="contain" />
            <Text
              fontSize={FONT.title.fontSize}
              lineHeight={FONT.title.lineHeight}
              color="#212121"
              fontWeight={item.read ? "500" : "800"}

            >
              {item.title}
            </Text>
            {item.source === "SYSTEM" && (
              <Text fontSize={12} color="#888">
                System
              </Text>
            )}
          </XStack>

          <XStack alignItems="center" gap={5}>
            <Text fontWeight="600" color="#545453">
              {formatTime(item.createdAt)}
            </Text>

            {/* Red dot for unread messages */}
            {!item.read && (
              <YStack
                width={10}
                height={10}
                borderRadius={5}
                backgroundColor="#E63946"
              />
            )}
          </XStack>
        </XStack>
      </YStack>
    </TouchableOpacity>
  );
};

export default NotificationItem;
