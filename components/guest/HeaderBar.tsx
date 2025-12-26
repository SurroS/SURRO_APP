// components/guest/HeaderBar.tsx
import React from "react";
import { XStack, YStack, Text, Avatar } from "tamagui";
import { useRouter } from "expo-router";
import { Bell } from "@tamagui/lucide-icons";
import { useProfile } from "@/hooks/useProfile";

const ICON_SIZE = 24;

const HeaderBar: React.FC = (surrogateProfile: any) => {
  const displayName = surrogateProfile?.firstName || "Guest";
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase();

  return (
    <XStack
      justifyContent="space-between"
      alignItems="center"
      paddingTop="$md"
      paddingHorizontal="$md"
    >
      {/* Left side: avatar or initials */}
      <YStack alignItems="center" justifyContent="center">
   
      </YStack>
    </XStack>
  );
};

export default HeaderBar;
