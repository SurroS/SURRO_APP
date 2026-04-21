// components/editBio/RoleCommonProfile.tsx
import React from "react";
import { YStack } from "tamagui";
import ProfileImageCard from "./ProfileImageCard";
import InfoRowCard from "./InfoRowCard";
import { User, Contact } from "@tamagui/lucide-icons";
import { router } from "expo-router";

interface RoleCommonProfileProps {
  profileImage?: { uri: string };
  onChangePicture: () => void;
  onEditBio: () => void;
}

export default function RoleCommonProfile({
  profileImage,
  onChangePicture,
  onEditBio,
}: RoleCommonProfileProps) {
  return (
    <YStack width="100%" marginTop="$6">
      <ProfileImageCard
        imageSrc={profileImage}
        onChangePicture={onChangePicture}
        onEditBio={onEditBio}
      />

      <YStack gap="$3" marginTop="$3">
        <InfoRowCard
          title="Personal details"
          subtitle="Tell us more about yourself"
          icon={User}
          onPress={() => router.navigate("/profile/personalDetails")}
        />
        <InfoRowCard
          title="Contact information"
          subtitle="How can we reach you?"
          icon={Contact}
          onPress={() =>
            router.navigate("/profile/contactInformation")
          }
        />
      </YStack>
    </YStack>
  );
}
