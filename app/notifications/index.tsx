// app/(tabs)/notifications/index.tsx
import React from "react";
import { ScrollView, TouchableOpacity } from "react-native";
import { YStack, XStack, Text } from "tamagui";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons"; // <- react-native icon
import NotificationItem from "@/components/notifications/NotificationItem";
import { notifications } from "@/constants/notifications";
import { Colors } from "@/constants/Colors";

const NotificationScreen = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <YStack
        flex={1}
        backgroundColor="$background"
        paddingHorizontal="$4"
        paddingTop="$4"
        gap="$4"
      >
        {/* Header */}
        <XStack alignItems="center" justifyContent="space-between" height={40}>
          {/* Back button (Feather chevron-left) */}
          <TouchableOpacity activeOpacity={0.7} onPress={() => router.back()}>
            <Feather name="chevron-left" size={22} color={Colors.light.text} />
          </TouchableOpacity>

          {/* Centered title */}
          <Text
            fontSize={20}
            fontWeight="700"
            color="$text"
            position="absolute"
            left="50%"
            style={{ transform: [{ translateX: -50 }] }}
          >
            Notifications
          </Text>

          {/* Spacer to balance layout */}
          <YStack width={28} />
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
