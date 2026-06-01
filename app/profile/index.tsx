import React, { useState, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { YStack, XStack, Text, ScrollView } from "tamagui";
import { RefreshControl, ActivityIndicator } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { LogOut } from "@tamagui/lucide-icons";
import { Toast } from "toastify-react-native";
import { ToastType } from "toastify-react-native/utils/interfaces";
import * as ImagePicker from "expo-image-picker";

import {
  surrogateToUIProfile,
  uiProfileToSurrogate,
  agentToUIProfile,
  uiProfileToAgent,
  parentToUIProfile,
  uiProfileToParent,
} from "@/utils/profileAdapter";
import { logProfileFlow } from "@/utils/profileLoger";

import colors from "@/hooks/colors";
import { ScreenHeader } from "@/components/auth";
import EditProfileModal from "@/components/editBio/BioInputModal";
import { useAuth } from "@/hooks/useAuth";

import { useSurrogateProfile } from "@/hooks/profile/useSurrogateProfile";
import { useAgentProfile } from "@/hooks/profile/useAgentProfile";
import { useParentProfile } from "@/hooks/profile/useParentProfile";
import { uploadAvatar } from "@/services/profileApi";

import AgentBio from "@/components/roles/agent/AgentBio";
import ParentBio from "@/components/roles/parent/ParentBio";
import SurrogateBio from "@/components/roles/surrogate/SurrogateBio";

export default function EditBioView() {
  const [isDanger, setIsDanger] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [initialFetchDone, setInitialFetchDone] = useState(false);

  const { logout, user } = useAuth();
  const Role = user?.role?.trim();

  // -------------------------------
  // Hooks for profile by role
  // -------------------------------
  const {
    surrogateProfile,
    fetchProfile: fetchSurrogate,
    updateProfile: updateSurrogate,
    createProfile: createSurrogate,
  } = useSurrogateProfile();

  const {
    agentProfile,
    fetchProfile: fetchAgent,
    updateProfile: updateAgent,
    createProfile: createAgent,
  } = useAgentProfile();

  const {
    parentProfile,
    fetchProfile: fetchParent,
    updateProfile: updateParent,
    createProfile: createParent,
  } = useParentProfile();

  // -------------------------------
  // Determine current profile & functions
  // -------------------------------
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchCurrentProfile(true);
    } catch (e) {
      console.error("Refresh failed", e);
    } finally {
      setRefreshing(false);
    }
  }, [Role]);

  const currentProfile =
    Role === "SURROGATE"
      ? surrogateProfile
      : Role === "AGENT"
      ? agentProfile
      : parentProfile;

  const fetchCurrentProfile =
    Role === "SURROGATE"
      ? fetchSurrogate
      : Role === "AGENT"
      ? fetchAgent
      : fetchParent;

  const updateCurrentProfile =
    Role === "SURROGATE"
      ? updateSurrogate
      : Role === "AGENT"
      ? updateAgent
      : updateParent;

  const createCurrentProfile =
    Role === "SURROGATE"
      ? createSurrogate
      : Role === "AGENT"
      ? createAgent
      : createParent;

  // -------------------------------
  // Map to UI profile
  // -------------------------------

  const rawProfile =
    Role === "SURROGATE"
      ? surrogateProfile
      : Role === "AGENT"
      ? agentProfile
      : parentProfile;

  const uiProfile: any = rawProfile
    ? Role === "SURROGATE"
      ? surrogateToUIProfile(rawProfile)
      : Role === "AGENT"
      ? agentToUIProfile(rawProfile)
      : parentToUIProfile(rawProfile)
    : null;

  // Refresh profile on mount and whenever screen gains focus
  useFocusEffect(
    useCallback(() => {
      setInitialFetchDone(false);
      if (Role === "SURROGATE") fetchSurrogate(true).finally(() => setInitialFetchDone(true));
      else if (Role === "AGENT") fetchAgent(true).finally(() => setInitialFetchDone(true));
      else fetchParent(true).finally(() => setInitialFetchDone(true));
    }, [Role, fetchSurrogate, fetchAgent, fetchParent])
  );

  const showSpinner = !initialFetchDone;

  // -------------------------------
  // Logout / Danger zone
  // -------------------------------
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    logout();
    Toast.show({
      text1: "Logged out successfully",
      type: "customSuccess" as ToastType,
      text2: "You have been logged out",
    });
    router.replace("/(auth)/login");
  };

  const [isDeactivating, setIsDeactivating] = useState(false);

  const handleDeleteAccount = () => {
    if (isDeactivating) return;
    setIsDeactivating(true);
    Toast.show({
      text1: "Contact support to delete account",
      text2: "This action requires support team assistance",
      type: "customError" as ToastType,
    });
  };

  const handleChangePicture = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permission.status !== "granted") {
        Toast.show({
          text1: "Permission needed",
          text2: "We need access to your photo gallery",
          type: "customError" as ToastType,
        });
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;

        const formData = new FormData();
        formData.append("file", {
          uri,
          type: "image/jpeg",
          name: "avatar.jpg",
        } as any);

        setIsLoading(true);
        const avatarRes = await uploadAvatar(formData);
        const avatarUrl = avatarRes?.data?.url || avatarRes?.url;
        if (avatarUrl) {
          await updateCurrentProfile({ profilePicture: avatarUrl });
          setProfileImage(avatarUrl);
        }
        await fetchCurrentProfile(true);
        setIsLoading(false);

        Toast.show({
          text1: "Profile picture updated!",
          type: "customSuccess" as ToastType,
        });
      }
    } catch (err) {
      console.error(err);
      Toast.show({
        text1: "Error",
        text2: "Something went wrong while updating your profile picture.",
        type: "customError" as ToastType,
      });
    }
  };

  // -------------------------------
  // Open modal and ensure profile is ready
  // -------------------------------
  const handleOpenModal = async () => {
    await fetchCurrentProfile(); // ensure latest data
    setIsModalVisible(true);
  };

  // -------------------------------
  // Save bio (create or update)
  // -------------------------------
  const handleSaveBio = async (data: typeof uiProfile) => {
    logProfileFlow("UI_INPUT", data);
    console.log("profile from Edit bioscreen", uiProfile);

    switch (Role) {
      case "SURROGATE": {
        const payload = uiProfileToSurrogate(data);
        logProfileFlow("SURROGATE_PAYLOAD", payload);
        surrogateProfile
          ? await updateSurrogate(payload as any)
          : await createSurrogate(payload);
        break;
      }

      case "AGENT": {
        const payload = uiProfileToAgent(data);
        logProfileFlow("AGENT_PAYLOAD", payload);
        agentProfile ? await updateAgent(payload) : await createAgent(payload);
        break;
      }

      case "INTENDED_PARENT": {
        const payload = uiProfileToParent(data);
        logProfileFlow("PARENT_PAYLOAD", payload);
        parentProfile
          ? await updateParent(payload)
          : await createParent(payload);
        break;
      }
    }

    // Refresh profile after save
    fetchCurrentProfile();
  };

  // -------------------------------
  // Render role-specific UI
  // -------------------------------
  const getProfileImageSrc = (backendUrl: string | undefined) => {
    const url = profileImage || backendUrl;
    return url ? { uri: url } : undefined;
  };

  const renderRoleContent = () => {
    switch (Role) {
      case "AGENT":
        return (
          <AgentBio
            profileImage={getProfileImageSrc(agentProfile?.profilePicture)}
            onChangePicture={handleChangePicture}
            onEditBio={handleOpenModal}
          />
        );
      case "INTENDED_PARENT":
        return (
          <ParentBio
            profileImage={getProfileImageSrc(parentProfile?.profilePicture)}
            onChangePicture={handleChangePicture}
            onEditBio={handleOpenModal}
          />
        );
      case "SURROGATE":
        return (
          <SurrogateBio
            profileImage={getProfileImageSrc(surrogateProfile?.profilePicture)}
            onChangePicture={handleChangePicture}
            onEditBio={handleOpenModal}
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
      {showSpinner ? (
        <YStack flex={1} justifyContent="center" alignItems="center">
          <ActivityIndicator size="large" color={colors.primary} />
        </YStack>
      ) : (
        <> 
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#0E0E55"]}
          />
        }
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <YStack gap="$6" alignItems="center">
          <ScreenHeader
            title="Profile Information"
            onBackPress={() => router.back()}
          />
          {renderRoleContent()}

          {/* Danger + Logout */}
          <YStack marginTop="$2" gap="$3" alignItems="center">
            <XStack alignItems="center" gap="$2">
              <LogOut size={16} color={colors.primary} />
              <Text
                color={colors.primary}
                fontWeight="600"
                fontSize={14}
                onPress={handleLogout}
                opacity={isLoggingOut ? 0.5 : 1}
              >
                {isLoggingOut ? "Logging out..." : "Log out"}
              </Text>
            </XStack>

            <YStack alignItems="center" marginTop="$2">
              <Text
                color="#E63946"
                fontWeight="600"
                onPress={() => !isDeactivating && setIsDanger(!isDanger)}
                opacity={isDeactivating ? 0.5 : 1}
              >
                Danger zone
              </Text>
              {isDanger && (
                <Text
                  marginTop="$2"
                  color="#E63946"
                  fontWeight="600"
                  onPress={handleDeleteAccount}
                  opacity={isDeactivating ? 0.5 : 1}
                >
                  Deactivate account
                </Text>
              )}
            </YStack>
          </YStack>
        </YStack>
      </ScrollView>

      {/* Edit Profile Modal */}
      {isModalVisible && (
        <EditProfileModal
          isLoading={isLoading}
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          onSave={handleSaveBio}
          profile={uiProfile}
        />
      )}
      </>
      )}
    </SafeAreaView>
  );
}