// components/roles/agent/AgentBio.tsx
import React from "react";
import { YStack } from "tamagui";
import RoleCommonProfile from "@/components/editBio/RoleCommonProfile";
import InfoRowCard from "@/components/editBio/infoRowCard";
import { router } from "expo-router";

interface AgentBioProps {
  profileImage?: { uri: string };
  onChangePicture: () => void;
  onEditBio: () => void;
}

export default function SurrogateBio(props: AgentBioProps) {

  return (
    <YStack gap="$3" width="100%">
      <RoleCommonProfile {...props} />
      {/* Agent-specific info */}
      <InfoRowCard
        title="Medical history"
        subtitle="Tell us about your health"
        icon={History}
        onPress={() => router.navigate("/settings/medical")}
      />
    </YStack>
  );
}
