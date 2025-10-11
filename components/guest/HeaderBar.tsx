// components/guess/HeaderBar.tsx
import React from "react";
import { XStack, YStack, Pressable } from "tamagui";
import { useRouter } from "expo-router";
import { Bell } from "@tamagui/lucide-icons";
import Colors from "@/constants/colors";
import Spacing from "@/constants/Spacing";

const AVATAR_SIZE = 36;
const ICON_SIZE = 24;

const HeaderBar: React.FC = () => {
  const router = useRouter();

  return (
    <XStack
      justifyContent="space-between"
      alignItems="center"
      paddingTop={Spacing.md}
      paddingHorizontal={Spacing.md} // <- replaces paddingX
    >
      {/* Left side avatar circle */}
      <YStack
        width={AVATAR_SIZE}
        height={AVATAR_SIZE}
        borderRadius={AVATAR_SIZE / 2}
        alignItems="center"
        justifyContent="center"
        backgroundColor={Colors.white}
        elevation={2}
      >
        {/* Optional: Add avatar initial or image here */}
      </YStack>

      {/* Right side bell icon */}
      <Pressable
        onPress={() => router.push("/notifications")}
        width={AVATAR_SIZE}
        height={AVATAR_SIZE}
        alignItems="center"
        justifyContent="center"
        backgroundColor={Colors.white}
        borderRadius={AVATAR_SIZE / 2}
        pressStyle={{ scale: 0.95, opacity: 0.8 }}
        hoverStyle={{ opacity: 0.85 }}
        elevation={2}
      >
        <Bell size={ICON_SIZE} color={Colors.primary} />
      </Pressable>
    </XStack>
  );
};

export default HeaderBar;
