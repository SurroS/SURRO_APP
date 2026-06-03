import React from "react";
import { TouchableOpacity, View } from "react-native";
import { XStack, YStack, Text } from "tamagui";
import { Ionicons } from "@expo/vector-icons";
import { AppNotification } from "@/store/notifications/types";

import colors from "@/hooks/colors";

type Props = {
  item?: AppNotification;
  selected?: boolean;
  onPress?: () => void;
  onLongPress?: () => void;
};

const iconConfig: Record<string, { name: keyof typeof Ionicons.glyphMap; bg: string }> = {
  GENERAL: { name: "notifications-outline", bg: "#E3F2FD" },
  PROFILE_SETUP: { name: "person-add-outline", bg: "#E8F5E9" },
  PROFILE_VIEWS: { name: "eye-outline", bg: "#FFF3E0" },
  PAYMENT: { name: "wallet-outline", bg: "#E8F5E9" },
  REFERRAL: { name: "gift-outline", bg: "#FCE4EC" },
  SURROGATE_BOOST: { name: "trending-up-outline", bg: "#E8F5E9" },
  KYC: { name: "shield-checkmark-outline", bg: "#E3F2FD" },
  PROFILE_BOOST: { name: "rocket-outline", bg: "#F3E5F5" },
  INACTIVITY: { name: "time-outline", bg: "#FFF3E0" },
};

const relativeTime = (timestamp: number): string => {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString();
};

const NotificationItem = ({ item, selected, onPress, onLongPress }: Props) => {
  if (!item) return null;

  const icon = iconConfig[item.type] ?? iconConfig.GENERAL;

  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.7}
      style={{ marginHorizontal: 0 }}
    >
      <XStack
        backgroundColor={selected ? "#EEF0FF" : item.read ? "#fff" : "#F8F9FF"}
        borderRadius={14}
        paddingVertical={14}
        paddingHorizontal={16}
        gap={14}
        alignItems="flex-start"
        style={{
          borderWidth: 1,
          borderColor: selected ? colors.primary : "transparent",
        }}
      >
        {/* Unread dot */}
        {!item.read && (
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: "#E63946",
              position: "absolute",
              left: 6,
              top: 18,
              zIndex: 1,
            }}
          />
        )}

        {/* Icon circle */}
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: icon.bg,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 2,
          }}
        >
          <Ionicons
            name={icon.name}
            size={20}
            color={item.read ? "#888" : "#333"}
          />
        </View>

        {/* Content */}
        <YStack flex={1} gap={4}>
          <XStack justifyContent="space-between" alignItems="center">
            <Text
              fontSize={15}
              color="#1A1A1A"
              fontWeight={item.read ? "500" : "700"}
              flex={1}
              numberOfLines={1}
            >
              {item.title}
            </Text>
            <Text fontSize={12} color="#999" marginLeft={8}>
              {relativeTime(item.createdAt)}
            </Text>
          </XStack>

          {item.body ? (
            <Text fontSize={13} color="#777" numberOfLines={2} lineHeight={18}>
              {item.body}
            </Text>
          ) : null}
        </YStack>
      </XStack>
    </TouchableOpacity>
  );
};

export default NotificationItem;
