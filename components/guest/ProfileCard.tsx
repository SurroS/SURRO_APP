import React from "react";
import { YStack, XStack, Text, Image } from "tamagui";
import { MapPin, Calendar } from "@tamagui/lucide-icons";

const PROFILE_IMAGE = require("../../assets/images/profile-icon.png");
const VERIFY_ICON = require("../../assets/images/verify-icon.png");

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
          resizeMode="cover"
        />
      </YStack>

      {/* Info Section */}
      <YStack width={155} gap="$3">
        <XStack alignItems="center" gap={8}>
          <Text fontSize={18} fontWeight="700" color="$text">
            Michelle John
          </Text>
          {/* Verify Badge */}
          <Image
            source={VERIFY_ICON}
            width={27.71}   // Figma width
            height={32}     // Figma height
            resizeMode="contain"
          />
        </XStack>

        <Text color="$text">@Micah</Text>

        {/* Location */}
        <XStack alignItems="center" gap={8}>
          <MapPin size={16} color="$text" />
          <Text color="$text">California</Text>
        </XStack>

        {/* Age */}
        <XStack alignItems="center" gap={8}>
          <Calendar size={16} color="$text" />
          <Text color="$text">29 Years</Text>
        </XStack>

        {/* Available Badge */}
        <XStack
          width={107}
          borderRadius={12}
          paddingVertical={4}
          paddingHorizontal={14}
          backgroundColor="#A6F4D8"
          justifyContent="center"
          alignItems="center"
        >
          <Text color="$text" fontSize={12}>
            Available
          </Text>
        </XStack>
      </YStack>
    </XStack>
  );
};

export default ProfileCard;
