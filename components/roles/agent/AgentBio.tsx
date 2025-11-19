// components/roles/agent/AgentBio.tsx
import React from "react";
import { YStack, Text } from "tamagui";
import RoleCommonProfile from "@/components/editBio/RoleCommonProfile";

interface AgentBioProps {
  profileImage?: { uri: string };
  onChangePicture: () => void;
  onEditBio: () => void;
}

export default function AgentBio(props: AgentBioProps) {
  return (
    <YStack gap="$3" width="100%">
      <RoleCommonProfile {...props} />
      {/* Agent-specific info */}
 
    </YStack>
  );
}
