import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { YStack, XStack, Text, ScrollView, Button, Separator } from "tamagui";
import { Alert, Modal } from "react-native";
import { router } from "expo-router";
import { User, Contact, LogOut, History } from "@tamagui/lucide-icons";
import { Toast } from "toastify-react-native";
import { ToastType } from "toastify-react-native/utils/interfaces";
import colors from "@/hooks/colors";

import { ScreenHeader } from "@/components/auth";
import ProfileImageCard from "@/components/editBio/profileImageCard";
import InfoRowCard from "@/components/editBio/infoRowCard";
import EditProfileModal from "@/components/editBio/BioInputModal";
import BottomModal from "@/components/BottomModal";
import { useAuth } from "@/hooks/useAuth";

export default function EditBioView() {
  const [isDanger, setIsDanger] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { logout } = useAuth();

  const handleUpdateBio = () => {
    console.log("Bio complete");
  };

  const handleLogout = () => {
    logout();
    Toast.show({
      text1: "Logged out successfully",
      type: "customSuccess" as ToastType,
      text2: "You have been logged out",
    });
    router.replace("/onboarding/screen1");
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "DANGER",
      "Are you sure you want to delete your account? This process is not reversible.",
      [
        {
          text: "OK",
          onPress: () => {
            console.log("Account deleted");
          },
          style: "destructive",
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ]
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <YStack padding="$4" gap="$4" alignItems="center">
          {/* Header */}
          <ScreenHeader
            title="Profile Information"
            onBackPress={() => router.back()}
          />

          {/* Profile image */}
          <YStack width="100%" alignItems="center" marginTop="$4">
            <ProfileImageCard
              onChangePicture={() => setIsModalVisible(true)}
              onEditBio={() =>setIsModalVisible(!isModalVisible)}
            />
          </YStack>

          {/* Info Rows */}
          <YStack width="100%" maxWidth={360} gap="$3" marginTop="$3">
            <InfoRowCard
              title="Personal details"
              subtitle="Tell us more about yourself"
              icon={User}
              onPress={() => {}}
            />
            <InfoRowCard
              title="Contact information"
              subtitle="How can we reach you?"
              icon={Contact}
              onPress={() => {}}
            />
            <InfoRowCard
              title="Medical history"
              subtitle="Tell us about your health"
              icon={History}
              onPress={() => {}}
            />
          </YStack>

          <Separator marginTop="$6" />

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
      onSave={()=>{console.log("bio saved")}}    
      visible={isModalVisible}
      onClose={()=>setIsModalVisible(false)}
      />

    </SafeAreaView>
  );
}
