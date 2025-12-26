// components/guest/ProfileCard.tsx
import React from "react";
import { YStack, XStack, Text, Image } from "tamagui";
import { MapPin, Calendar, AtSign } from "@tamagui/lucide-icons";
import { useSurrogateProfile } from "@/hooks/profile/useSurrogateProfile";

const VERIFY_ICON = require("../../assets/images/verify-icon.png");
const DEFAULT_PROFILE_IMAGE = require("../../assets/images/profile-icon.png");

const ProfileCard = () => {
  const { surrogateProfile } = useSurrogateProfile();
  const fullName = surrogateProfile?.firstName || "Guest Name";
  const username = surrogateProfile?.userName || "@guest";
  const location =
    surrogateProfile?.stateOfResidence ||
    surrogateProfile?.stateOfOrigin ||
    "no state ";
  const age = surrogateProfile?.dateOfBirth?.split("T")[0];
  const isAvailable = surrogateProfile?.isAvailable ?? true;
  const profileImage = surrogateProfile?.profilePicture
    ? { uri: surrogateProfile.profilePicture }
    : DEFAULT_PROFILE_IMAGE;

  return (
    <XStack gap={25} alignItems="center" justifyContent="center">
      {/* Profile Image */}
      <YStack width={147} height={147} overflow="hidden" borderRadius={12}>
        <Image
          source={profileImage}
          width={"100%"}
          height={"100%"}
          resizeMode="cover"
        />
      </YStack>

      {/* Info Section */}
      <YStack width={155} gap="$3">
        <XStack alignItems="center" gap={8}>
          <Text fontSize={18} fontWeight="700" color="$text">
            {fullName}
          </Text>
          {/* Verify Badge */}
          <Image
            source={VERIFY_ICON}
            width={27.71}
            height={32}
            resizeMode="contain"
          />
        </XStack>
        <XStack>
          <AtSign size={16} color="$text" />
          <Text color="$text">{username}</Text>
        </XStack>

        {/* Location */}
        <XStack alignItems="center" gap={8}>
          <MapPin size={16} color="$text" />
          <Text color="$text">{location}</Text>
        </XStack>

        {/* Age */}
        <XStack alignItems="center" gap={8}>
          <Calendar size={16} color="$text" />
          <Text color="$text">{age}</Text>
        </XStack>

        {/* Available Badge */}
        <XStack
          width={107}
          borderRadius={12}
          paddingVertical={4}
          paddingHorizontal={14}
          backgroundColor={isAvailable ? "#A6F4D8" : "#F4A6A6"}
          justifyContent="center"
          alignItems="center"
        >
          <Text color="$text" fontSize={12}>
            {isAvailable ? "Available" : "Unavailable"}
          </Text>
        </XStack>
      </YStack>
    </XStack>
  );
};

export default ProfileCard;
