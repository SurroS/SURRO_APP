// components/guess/HeaderBar.tsx
import React from "react";
import { XStack, YStack } from "tamagui";
import { useRouter } from "expo-router";
import { Bell } from "@tamagui/lucide-icons";

const ICON_SIZE = 24;

const HeaderBar: React.FC = () => {
  const router = useRouter();

  return (
    <XStack
      justifyContent="space-between"
      alignItems="center"
      paddingTop="$md"
      paddingHorizontal="$md"
    >

      <YStack />

      {/* Right side: bell icon */}
      
      <Bell
        size={ICON_SIZE}
        color="#000"
        onPress={() => router.push("/notifications")}
      />
    </XStack>
  );
};

export default HeaderBar;
