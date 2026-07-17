// components/guest/ProfileCard.tsx
import React from "react";
import { View, Text } from "react-native";
import { YStack, XStack, Image } from "tamagui";
import { MapPin, Calendar, AtSign } from "@tamagui/lucide-icons";
import { useSurrogateProfile } from "@/hooks/profile/useSurrogateProfile";

const VERIFY_ICON = require("../../assets/images/verify-icon.png");

const ProfileCard = () => {
  const { surrogateProfile } = useSurrogateProfile();
  const fullName = surrogateProfile?.userName || surrogateProfile?.firstName || "Guest Name";
  const username = surrogateProfile?.userName ? `@${surrogateProfile.userName}` : "@guest";
  const location =
    surrogateProfile?.stateOfResidence ||
    surrogateProfile?.stateOfOrigin ||
    "no state ";
  const age = surrogateProfile?.dateOfBirth?.split("T")[0];
  const isAvailable = surrogateProfile?.isAvailable ?? true;
  const hasProfileImage = !!surrogateProfile?.profilePicture;

  return (
    <XStack gap={25} alignItems="center" justifyContent="center">
      {/* Profile Image */}
      <YStack width={147} height={147} overflow="hidden" borderRadius={12}>
        {hasProfileImage ? (
          <Image
            source={{ uri: surrogateProfile!.profilePicture }}
            width={"100%"}
            height={"100%"}
            resizeMode="cover"
          />
        ) : (
          <View
            style={{
              flex: 1,
              backgroundColor: "#E0E0E0",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#666", fontSize: 12, textAlign: "center" }}>
              Profile Picture
            </Text>
          </View>
        )}
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
