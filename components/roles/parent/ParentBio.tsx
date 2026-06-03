import React from "react";
import { YStack } from "tamagui";
import RoleCommonProfile from "@/components/editBio/RoleCommonProfile";
import InfoRowCard from "@/components/editBio/InfoRowCard";
import { FileText } from "@tamagui/lucide-icons";
import { router } from "expo-router";

interface ParentBioProps {
  profileImage?: { uri: string };
  onChangePicture: () => void;
  onEditBio: () => void;
}

export default function ParentBio(props: ParentBioProps) {
  return (
    <YStack gap="$3" width="100%">
      <RoleCommonProfile {...props} />

      <InfoRowCard
        title="Profile Summary"
        subtitle="View your complete profile"
        icon={FileText}
        onPress={() => router.navigate("/medical/medicalHistorySummary")}
      />
    </YStack>
  );
}

