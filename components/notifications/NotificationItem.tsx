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
        backgroundColor={selected ? "#EEF0FF" : "#fff"}
        borderRadius={14}
        paddingVertical={14}
        paddingHorizontal={16}
        gap={14}
        alignItems="flex-start"
        style={{
          borderWidth: 1,
          borderColor: selected ? colors.primary : "#f0f0f0",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.08,
          shadowRadius: 4,
          elevation: 3,
        }}
      >
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
          <XStack justifyContent="space-between" alignItems="flex-start">
            <Text
              fontSize={15}
              color="#1A1A1A"
              fontWeight={item.read ? "500" : "700"}
              flex={1}
              numberOfLines={2}
            >
              {item.title}
            </Text>
            {!item.read && (
              <View
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: 3.5,
                  backgroundColor: "#E63946",
                  marginTop: 6,
                  marginLeft: 6,
                }}
              />
            )}
          </XStack>

          {item.body ? (
            <Text fontSize={13} color="#777" numberOfLines={2} lineHeight={18}>
              {item.body}
            </Text>
          ) : null}

          <Text fontSize={11} color="#aaa" marginTop={2}>
            {relativeTime(item.createdAt)}
          </Text>
        </YStack>
      </XStack>
    </TouchableOpacity>
  );
};

export default NotificationItem;
