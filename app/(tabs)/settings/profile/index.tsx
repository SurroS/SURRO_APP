import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { YStack, XStack, Text, ScrollView, Button } from "tamagui";
import { Alert } from "react-native";
import { router } from "expo-router";
import { LogOut } from "@tamagui/lucide-icons";
import { Toast } from "toastify-react-native";
import { ToastType } from "toastify-react-native/utils/interfaces";
import * as ImagePicker from "expo-image-picker";

import colors from "@/hooks/colors";
import { ScreenHeader } from "@/components/auth";
import EditProfileModal from "@/components/editBio/BioInputModal";
import { useAuth } from "@/hooks/useAuth";

// Role-specific stores/hooks
import { useSurrogateStore } from "@/store/surrogates";
import { useAgentStore, useParentStore } from "@/store/allUsers";
import { useSurrogateProfile } from "@/hooks/profile/useSurrogateProfile";
import { useAgentProfile } from "@/hooks/profile/useAgentProfile";
import { useParentProfile } from "@/hooks/profile/useParentProfile";

// Optional: role-based UI
import AgentBio from "@/components/roles/agent/AgentBio";
import ParentBio from "@/components/roles/parent/ParentBio";
import SurrogateBio from "@/components/roles/surrogate/SurrogateBio";

export default function EditBioView() {
  const [isDanger, setIsDanger] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const { logout, user } = useAuth();
  const Role = user?.role?.trim();

  // Role-specific profile hooks
  const {
    surrogateProfile: surrogateProfile,
    updateProfile: updateSurrogate,
    createProfile: createSurrogate,
  } = useSurrogateProfile();
  const {
    agentProfile: agentProfile,
    updateProfile: updateAgent,
    createProfile: createAgent,
  } = useAgentProfile();
  const {
    parentProfile: parentProfile,
    updateProfile: updateParent,
    createProfile: createParent,
  } = useParentProfile();

  const handleLogout = () => {
    logout();
    Toast.show({
      text1: "Logged out successfully",
      type: "customSuccess" as ToastType,
      text2: "You have been logged out",
    });
    router.replace("/(auth)/login");
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "DANGER",
      "Are you sure you want to delete your account? This process is not reversible.",
      [
        {
          text: "OK",
          onPress: () => console.log("Account deleted"),
          style: "destructive",
        },
        { text: "Cancel", style: "cancel" },
      ]
    );
  };

  const handleChangePicture = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permission.status !== "granted") {
        Alert.alert(
          "Permission needed",
          "We need access to your photo gallery to update your profile picture."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!result.canceled) {
        setProfileImage(result.assets[0].uri);
        Toast.show({
          text1: "Profile picture updated!",
          type: "customSuccess" as ToastType,
        });
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Something went wrong while selecting the image.");
    }
  };

  const handleSaveBio = async (data: {
    username: string;
    about: string;
    socials: any[];
  }) => {
    try {
      if (!Role) return;

      // Map to role-specific backend fields
      const mappedData =
        Role === "SURROGATE"
          ? {
              userName: data.username,
              aboutMe: data.about,
              facebookProfile: data.socials.find(
                (s) => s.platform === "Facebook"
              )?.handle,
              instagramProfile: data.socials.find(
                (s) => s.platform === "Instagram"
              )?.handle,
              twitterProfile: data.socials.find((s) => s.platform === "Twitter")
                ?.handle,
              threadsProfile: data.socials.find((s) => s.platform === "Threads")
                ?.handle,
            }
          : {
              fullName: data.username,
              bio: data.about,
              facebookProfile: data.socials.find(
                (s) => s.platform === "Facebook"
              )?.handle,
              instagramProfile: data.socials.find(
                (s) => s.platform === "Instagram"
              )?.handle,
              twitterProfile: data.socials.find((s) => s.platform === "Twitter")
                ?.handle,
              threadsProfile: data.socials.find((s) => s.platform === "Threads")
                ?.handle,
            };

      switch (Role) {
        case "SURROGATE":
          surrogateProfile
            ? await updateSurrogate(mappedData)
            : await createSurrogate(mappedData);
          break;
        case "AGENT":
          agentProfile
            ? await updateAgent(mappedData)
            : await createAgent(mappedData);
          break;
        case "INTENDED_PARENT":
          parentProfile
            ? await updateParent(mappedData)
            : await createParent(mappedData);
          break;
      }

      Toast.show({
        text1: "Profile updated!",
        type: "customSuccess" as ToastType,
      });
    } catch (err: any) {
      Toast.show({
        text1: "Failed to save profile",
        text2: err.message || "Try again",
        type: "customError" as ToastType,
      });
    }
  };

  // ----------------------
  // Render role-specific content (UI stays same)
  // ----------------------
  const currentProfile =
    Role === "SURROGATE"
      ? surrogateProfile
      : Role === "AGENT"
      ? agentProfile
      : parentProfile;

  const handleEditBio = () => setIsModalVisible(true);

  const renderRoleContent = () => {
    switch (Role) {
      case "AGENT":
        return (
          <AgentBio
            onChangePicture={handleChangePicture}
            onEditBio={handleEditBio}
          />
        );
      case "INTENDED_PARENT":
        return (
          <ParentBio
            onChangePicture={handleChangePicture}
            onEditBio={handleEditBio}
          />
        );
      case "SURROGATE":
        return (
          <SurrogateBio
            onChangePicture={handleChangePicture}
            onEditBio={handleEditBio}
          />
        );
      default:
        return (
          <YStack flex={1} justifyContent="center" alignItems="center">
            <Text>Loading...</Text>
          </YStack>
        );
    }
  };

  // Pass correct profile & handlers to modal
  const modalProfile =
    Role === "SURROGATE"
      ? surrogateProfile
      : Role === "AGENT"
      ? agentProfile
      : parentProfile;
  const modalUpdate =
    Role === "SURROGATE"
      ? updateSurrogate
      : Role === "AGENT"
      ? updateAgent
      : updateParent;
  const modalCreate =
    Role === "SURROGATE"
      ? createSurrogate
      : Role === "AGENT"
      ? createAgent
      : createParent;

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#FFF", paddingTop: 20, padding: 20 }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <YStack gap="$6" alignItems="center">
          <ScreenHeader
            title="Profile Information"
            onBackPress={() => router.back()}
          />

          {renderRoleContent()}

          {/* Danger + Logout */}
          <YStack marginTop="$5" gap="$3" alignItems="center">
            <XStack alignItems="center" gap="$2">
              <LogOut size={16} color={colors.primary} />
              <Text
                color={colors.primary}
                fontWeight="600"
                fontSize={14}
                onPress={handleLogout}
              >
                Log out
              </Text>
            </XStack>
            <YStack alignItems="center" marginTop="$2">
              <Text
                color="#E63946"
                fontWeight="600"
                onPress={() => setIsDanger(!isDanger)}
              >
                Danger zone
              </Text>
              {isDanger && (
                <Text
                  marginTop="$2"
                  color="#E63946"
                  fontWeight="600"
                  onPress={handleDeleteAccount}
                >
                  Deactivate account
                </Text>
              )}
            </YStack>
          </YStack>
        </YStack>
      </ScrollView>
      <EditProfileModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSave={handleSaveBio}
        profile={{
          username: currentProfile?.userName || currentProfile?.fullName,
          about: currentProfile?.aboutMe || currentProfile?.bio,
          socials: [
            { platform: "Facebook", handle: currentProfile?.facebookProfile },
            { platform: "Instagram", handle: currentProfile?.instagramProfile },
            { platform: "Twitter", handle: currentProfile?.twitterProfile },
            { platform: "Threads", handle: currentProfile?.threadsProfile },
          ].filter((s) => s.handle),
        }}
        isLoading={false}
      />
    </SafeAreaView>
  );
}
