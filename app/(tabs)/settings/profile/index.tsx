import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { YStack, XStack, Text, ScrollView } from "tamagui";
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

// Optional: role-specific subcomponents
import AgentBio from "@/components/roles/agent/AgentBio";
import ParentBio from "@/components/roles/parent/ParentBio";
import SurrogateBio from "@/components/roles/surrogate/SurrogateBio";

export default function EditBioView() {
  const [isDanger, setIsDanger] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const { logout, user } = useAuth();

  const Role = user?.role?.trim();

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
        const uri = result.assets[0].uri;
        setProfileImage(uri);
        Toast.show({
          text1: "Profile picture updated!",
          type: "customSuccess" as ToastType,
        });
      }
    } catch (error) {
      console.error("Image picker error:", error);
      Alert.alert("Error", "Something went wrong while selecting the image.");
    }
  };

  const handleEditBio = () => {
    //handle push and zustand update here
    setIsModalVisible(true);
  };

  // Role-based rendering
  const renderRoleContent = () => {
    switch (Role) {
      case "AGENT":
        return (
          // <AgentBio
          //   onChangePicture={handleChangePicture}
          //   onEditBio={handleEditBio}
          // />
               <ParentBio
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

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#FFF", paddingTop: 20, padding: 20 }}
    >
      <ScrollView contentContainerStyle={{ flex: 1 }}>
        <YStack gap="$6" alignItems="center">
          <ScreenHeader
            title="Profile Information"
            onBackPress={() => router.back()}
          />

          {/* Role-based profile content */}
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
        onSave={() => {
          console.log("Bio saved");
          Toast.show({
            text1: "Bio updated!",
            type: "customSuccess" as ToastType,
          });
        }}
      />
    </SafeAreaView>
  );
}
