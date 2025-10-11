// components/guess/HeaderBar.tsx
import React from "react";
import { XStack, YStack, Text } from "tamagui";
import { useRouter } from "expo-router";

const HeaderBar = () => {
  const router = useRouter();

  return (
    <XStack justifyContent="space-between" alignItems="center" paddingTop={8}>
      {/* Left side avatar circle */}
      <YStack
        width={36}
        height={36}
        borderRadius={18}
        alignItems="center"
        justifyContent="center"
        backgroundColor="$white"
        elevation={2}
      >
        {/* <Text color="$primary" fontWeight="700">
          B
        </Text> */}
      </YStack>

      {/* Right side "Pressable" bell */}
      <YStack
        onPress={() => console.log("Bell pressed")} // or router.push("/notifications")
        width={36}
        height={36}
        alignItems="center"
        justifyContent="center"
        backgroundColor="$white"
        borderRadius={18}
        pressStyle={{ scale: 0.9, opacity: 0.8 }}
        hoverStyle={{ opacity: 0.85 }}
        elevation={2}
      >
        <Text fontSize={20}>🔔</Text>
      </YStack>
    </XStack>
  );
};

export default HeaderBar;
