import React from "react";
import { router } from "expo-router";
import BottomModal from "@/components/modals/BottomModal";
import { calculateProfileProgress } from "@/utils/profileHelpers";

interface ProfileCompletionModalProps<TProfile = any> {
  visible: boolean;
  onClose: () => void;
  profile: TProfile | null;
  redirectPath?: string; // Path to navigate when creating/completing profile
  profileTypeName?: string; // Optional name like "Surrogate", "Agent", "Parent"
}

export default function ProfileCompletionModal<TProfile>({
  visible,
  onClose,
  profile,
  redirectPath,
  profileTypeName = "Profile",
}: ProfileCompletionModalProps<TProfile>) {
  const progress = calculateProfileProgress(profile as any);
  const hasProfile = !!profile;

  const title = hasProfile
    ? `Complete Your ${profileTypeName}`
    : `Create Your ${profileTypeName}`;

  const message = hasProfile
    ? `Your ${profileTypeName.toLowerCase()} is ${progress}% complete. Please complete it to get the most out of the platform.`
    : `You haven't created a ${profileTypeName.toLowerCase()} yet. Create one to get started and connect with others.`;

  // Use router.replace to ensure the screen remounts
  const handleCreateProfile = () => {
    onClose();
    router.navigate(redirectPath as any);
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
