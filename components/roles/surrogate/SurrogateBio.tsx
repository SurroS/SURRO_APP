// components/roles/agent/AgentBio.tsx
import React from "react";
import { YStack } from "tamagui";
import RoleCommonProfile from "@/components/editBio/RoleCommonProfile";
import InfoRowCard from "@/components/editBio/InfoRowCard";
import { router } from "expo-router";
import { History, FileText } from "@tamagui/lucide-icons";

interface SurrogateBioProps {
  profileImage?: { uri: string };
  onChangePicture: () => void;
  onEditBio: () => void;
}

export default function SurrogateBio(props: SurrogateBioProps) {
  return (
    <YStack gap="$3" width="100%">
      <RoleCommonProfile {...props} />
      {/* Agent-specific info */}
      <InfoRowCard
        title="Medical history"
        subtitle="Tell us about your health"
        icon={History}
        onPress={() => router.navigate("/medical")}
      />
      <InfoRowCard
        title="Surrogacy Experience"
        subtitle="Tell us about your experience"
        icon={History}
        onPress={() =>
          router.navigate("/profile/experienceForm")
        }
      />
      <InfoRowCard
        title="Profile Summary"
        subtitle="View your complete profile"
        icon={FileText}
        onPress={() => router.navigate("/medical/medicalHistorySummary")}
      />
    </YStack>
  );
}
