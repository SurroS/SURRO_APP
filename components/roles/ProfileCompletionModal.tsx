import React from "react";
import { router } from "expo-router";
import BottomModal from "@/components/BottomModal";
import { SurrogateProfile } from "@/types/profile";
import { calculateProfileProgress } from "@/utils/profileHelpers";

interface ProfileCompletionModalProps {
  visible: boolean;
  onClose: () => void;
  profile: SurrogateProfile | null;
}

export default function ProfileCompletionModal({
  visible,
  onClose,
  profile,
}: ProfileCompletionModalProps) {
  const progress = calculateProfileProgress(profile);
  const hasProfile = profile !== null;

  // Determine message based on profile state
  const title = hasProfile
    ? "Complete Your Profile"
    : "Create Your Profile";
  
  const message = hasProfile
    ? `Your profile is ${progress}% complete. Please complete your profile to get the most out of the platform.`
    : "You haven't created a profile yet. Create your profile to get started and connect with others.";

  const handleCreateProfile = () => {
    onClose();
    router.push("/(tabs)/settings/profile");
  };

  return (
    <BottomModal
      visible={visible}
      onClose={onClose}
      icon="person-circle"
      iconColor="#0E0E55"
      title={title}
      message={message}
      buttons={[
        {
          label: hasProfile ? "Complete Profile" : "Create Profile",
          color: "#0E0E55",
          textColor: "#fff",
          onPress: handleCreateProfile,
        },
        {
          label: "Later",
          color: "#E5E5E5",
          textColor: "#333",
          onPress: onClose,
        },
      ]}
      orientation="column"
    />
  );
}

