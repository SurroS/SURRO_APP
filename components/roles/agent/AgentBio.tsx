import React from "react";
import { YStack, Text } from "tamagui";
import RoleCommonProfile from "@/components/editBio/RoleCommonProfile";
import InfoRowCard from "@/components/editBio/InfoRowCard";
import { Briefcase, MapPin, Globe, ListChecks } from "@tamagui/lucide-icons";
import { router } from "expo-router";

interface AgentBioProps {
  profileImage?: { uri: string };
  onChangePicture: () => void;
  onEditBio: () => void;

  // Agent info fields
  experience?: string;
  specializations?: string[];
  coverage?: string[];
  languages?: string[];
}

export default function AgentBio({
  profileImage,
  onChangePicture,
  onEditBio,
  experience,
  specializations,
  coverage,
  languages,
}: AgentBioProps) {
  return (
    <YStack gap="$4" width="100%">
      <RoleCommonProfile
        profileImage={profileImage}
        onChangePicture={onChangePicture}
        onEditBio={onEditBio}
      />

      {/* EXPERIENCE */}

      <InfoRowCard
        title="Experience"
        subtitle={experience || "Tell us about your experience"}
        icon={Briefcase}
        onPress={() =>
          router.push("/profile/AgentExperienceSection")
        }
      />

      {/* SPECIALIZATIONS */}

      <InfoRowCard
        title="Specializations"
        subtitle={
          specializations?.length
            ? specializations.join(", ")
            : "What do you specialize in?"
        }
        icon={ListChecks}
        onPress={() =>
          router.push("/profile/AgentSpecializationSection")
        }
      />

      {/* COVERAGE AREAS */}

      <InfoRowCard
        title="Coverage Areas"
        subtitle={
          coverage?.length
            ? coverage.join(", ")
            : "How far can you go on a job?"
        }
        icon={MapPin}
        onPress={() =>
          router.push("/profile/AgentCoverageSection")
        }
      />

      {/* LANGUAGES */}

      <InfoRowCard
        title="Languages Spoken"
        subtitle={
          languages?.length
            ? languages.join(", ")
            : "What languages do you speak?"
        }
        icon={Globe}
        onPress={() =>
          router.push("/profile/AgentLanguagesSection")
        }
      />
    </YStack>
  );
}
