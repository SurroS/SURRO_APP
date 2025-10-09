import React from "react";
import { YStack, XStack, Text, Image } from "tamagui";

const PROFILE_IMAGE = require("../../assets/images/profile-icon.png");

const ProfileCard = () => {
  return (
    <XStack gap={25} alignItems="flex-start">
      {/* Profile Image */}
      <YStack
        width={147}
        height={147}
        borderRadius={12}
        overflow="hidden"
        backgroundColor="$secondary"
        alignItems="center"
        justifyContent="center"
      >
        <Image
          source={PROFILE_IMAGE}
          width={120}
          height={120}
          borderRadius={12}
          resizeMode="cover" // or "cover" if you want it to fill
        />
      </YStack>

      {/* Info Section */}
      <YStack width={155} gap="$3">
        <XStack alignItems="center" gap={8}>
          <Text fontSize={18} fontWeight="700" color="$text">
            Michelle John
          </Text>
          <YStack
            backgroundColor="$success"
            borderRadius={6}
            padding={4}
            alignItems="center"
            justifyContent="center"
          >
            <Text color="$white" fontSize={12}>
              ✓
            </Text>
          </YStack>
        </XStack>

        <Text color="$text">@Micah</Text>

        <XStack alignItems="center" gap={8}>
          <Text>📍</Text>
          <Text color="$text">California</Text>
        </XStack>

        <XStack alignItems="center" gap={8}>
          <Text>📅</Text>
          <Text color="$text">29 Years</Text>
        </XStack>

        <YStack
          backgroundColor="$success"
          borderRadius={20}
          paddingHorizontal={12}
          paddingVertical={4}
          alignSelf="flex-start"
        >
          <Text color="$white" fontSize={12}>
            Available
          </Text>
        </YStack>
      </YStack>
    </XStack>
  );
};

export default ProfileCard;
