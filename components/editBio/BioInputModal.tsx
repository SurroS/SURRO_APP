// components/editBio/BioInputModal.tsx
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Platform,
  Animated,
  EmitterSubscription,
} from "react-native";
import { YStack, XStack, Text, Button } from "tamagui";
import colors from "@/hooks/colors";
import PlatformInput from "./SocialSelector"; // adjust path if needed
import { SafeAreaView } from "react-native-safe-area-context";
import { useProfile } from "@/hooks/useProfile";
import { SurrogateProfileUpdate } from "@/types/profile";
import { Toast } from "toastify-react-native";
import { ToastType } from "toastify-react-native/utils/interfaces";

type Social = { platform: string; handle: string };

type EditProfileModalProps = {
  visible: boolean;
  onClose: () => void;
  onSave?: (data: {
    username: string;
    about: string;
    socials: Social[];
  }) => void;
};

export default function BioInputModal({
  visible,
  onClose,
  onSave,
}: EditProfileModalProps) {
  const { surrogateProfile, createProfile, updateProfile, isLoading } = useProfile();
  const [username, setUsername] = React.useState("");
  const [about, setAbout] = React.useState("");
  const [socials, setSocials] = React.useState<Social[]>([]);

  // keyboard state
  const [keyboardHeight, setKeyboardHeight] = useState<number>(0);
  const anim = useRef(new Animated.Value(0)).current; // animate translateY

  // register keyboard listeners
  useEffect(() => {
    let showSub: EmitterSubscription;
    let hideSub: EmitterSubscription;

    const onShow = (e: any) => {
      const h = e.endCoordinates?.height ?? 0;
      setKeyboardHeight(h);
      Animated.timing(anim, {
        toValue: h*0.5,
        duration: 200,
        useNativeDriver: true,
      }).start();
    };

    const onHide = () => {
      setKeyboardHeight(0);
      Animated.timing(anim, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }).start();
    };

    if (Platform.OS === "ios") {
      showSub = Keyboard.addListener("keyboardWillShow", onShow);
      hideSub = Keyboard.addListener("keyboardWillHide", onHide);
    } else {
      // android
      showSub = Keyboard.addListener("keyboardDidShow", onShow);
      hideSub = Keyboard.addListener("keyboardDidHide", onHide);
    }

    return () => {
      showSub?.remove();
      hideSub?.remove();
    };
  }, [anim]);

  // Fetch profile when modal opens if not already loaded
  // useEffect(() => {
  //   if (visible && !surrogateProfile) {
  //     fetchProfile();
  //   }
  // }, [visible, surrogateProfile, fetchProfile]);

  // Initialize form fields from existing profile
  useEffect(() => {
    if (visible && surrogateProfile) {
      setUsername(surrogateProfile.userName || "");
      setAbout(surrogateProfile.aboutMe || "");
      
      // Map profile social fields to socials array
      const socialsArray: Social[] = [];
      if (surrogateProfile.facebookProfile) {
        socialsArray.push({ platform: "Facebook", handle: surrogateProfile.facebookProfile });
      }
      if (surrogateProfile.instagramProfile) {
        socialsArray.push({ platform: "Instagram", handle: surrogateProfile.instagramProfile });
      }
      if (surrogateProfile.twitterProfile) {
        socialsArray.push({ platform: "Twitter", handle: surrogateProfile.twitterProfile });
      }
      if (surrogateProfile.threadsProfile) {
        socialsArray.push({ platform: "Threads", handle: surrogateProfile.threadsProfile });
      }
      setSocials(socialsArray);
    } else if (visible && !surrogateProfile) {
      // Reset form when creating new profile
      setUsername("");
      setAbout("");
      setSocials([]);
    }
  }, [visible, surrogateProfile]);

  // reset state when closed (optional)
  useEffect(() => {
    if (!visible) {
      setKeyboardHeight(0);
      Animated.timing(anim, {
        toValue: 0,
        duration: 1,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, anim]);

  // socials handlers
  const handleAddSocial = (platform: string, handle: string) => {
    if (socials.some((s) => s.platform === platform)) return;
    setSocials((p) => [{ platform, handle }, ...p]);
  };

  const handleRemoveSocial = (platform: string) => {
    setSocials((p) => p.filter((s) => s.platform !== platform));
  };

  const handleSave = async () => {
    try {
      // Map socials array to individual profile fields
      const facebookProfile = socials.find(s => s.platform === "Facebook")?.handle;
      const instagramProfile = socials.find(s => s.platform === "Instagram")?.handle;
      const twitterProfile = socials.find(s => s.platform === "Twitter")?.handle;
      const threadsProfile = socials.find(s => s.platform === "Threads")?.handle;

      if (surrogateProfile) {
        // Update existing profile - only include fields with values
        const updateData: SurrogateProfileUpdate = {};
        
        if (username) updateData.userName = username;
        if (about) updateData.aboutMe = about;
        if (facebookProfile) updateData.facebookProfile = facebookProfile;
        if (instagramProfile) updateData.instagramProfile = instagramProfile;
        if (twitterProfile) updateData.twitterProfile = twitterProfile;
        if (threadsProfile) updateData.threadsProfile = threadsProfile;

        await updateProfile(updateData);
        
        Toast.show({
          text1: "Profile updated successfully",
          type: "customSuccess" as ToastType,
        });
      } else {
        // Create new profile - only include fields with values
        const createData: any = {};
        
        if (username) createData.userName = username;
        if (about) createData.aboutMe = about;
        if (facebookProfile) createData.facebookProfile = facebookProfile;
        if (instagramProfile) createData.instagramProfile = instagramProfile;
        if (twitterProfile) createData.twitterProfile = twitterProfile;
        if (threadsProfile) createData.threadsProfile = threadsProfile;

        await createProfile(createData);
        
        Toast.show({
          text1: "Profile created successfully",
          type: "customSuccess" as ToastType,
        });
      }

      // Call optional onSave callback if provided
      if (onSave) {
        onSave({ username, about, socials });
      }
      
      onClose();
    } catch (error: any) {
      Toast.show({
        text1: surrogateProfile ? "Failed to update profile" : "Failed to create profile",
        text2: error.response?.data?.message || "Please try again",
        type: "customError" as ToastType,
      });
    }
  };

  if (!visible) return null;

  return (
    <SafeAreaView style={styles.full}>
      {/* backdrop */}
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
          onClose();
        }}
      >
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      {/* bottom sheet - translateY animated to avoid keyboard */}
      <Animated.View
        style={[styles.sheetWrapper, { transform: [{ translateY: anim }] }]}
        pointerEvents="box-none"
      >
        <View style={styles.sheet}>
          {/* header */}
          <XStack
            justifyContent="space-between"
            alignItems="center"
            style={{ marginBottom: 8 }}
          >
            <Text fontSize={18} fontWeight="700" color={colors.primary}>
              Edit Profile
            </Text>

            <TouchableOpacity onPress={onClose}>
              <Text color={colors.primary}>Close</Text>
            </TouchableOpacity>
          </XStack>

          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{
              paddingBottom: Math.max(24, keyboardHeight + 24),
            }}
            keyboardShouldPersistTaps="handled"
          >
            {/* Username */}
            <YStack marginBottom={12}>
              <Text
                fontWeight="600"
                color="#0E0E55"
                marginBottom={6}
                fontSize={14}
              >
                Username
              </Text>
              <TextInput
                placeholder="@username, no real names"
                value={username}
                placeholderTextColor={"gray"}
                onChangeText={setUsername}
                style={styles.input}
                returnKeyType="next"
              />
            </YStack>

            {/* About */}
            <YStack marginBottom={12}>
              <Text
                fontWeight="600"
                color="#0E0E55"
                marginBottom={6}
                fontSize={14}
              >
                About
              </Text>
              <TextInput
                multiline
                placeholderTextColor={"gray"}
                value={about}
                onChangeText={(text) => {
                  if (text.length <= 300) setAbout(text);
                }}
                style={[styles.input, styles.textArea]}
                placeholder="Tell us how much this opportunity means to you..."
                textAlignVertical="top"
              />
              <Text
                alignSelf="flex-end"
                fontSize={12}
                color={about.length < 300 ? colors.primary : colors.danger}
                marginTop={6}
              >
                {about.length}/300
              </Text>
            </YStack>

            {/* Socials */}
            <Text
              fontWeight="600"
              color="#0E0E55"
              fontSize={14}
              marginBottom={8}
            >
              Add Socials
            </Text>

            <PlatformInput
              onAdd={handleAddSocial}
              initialPlatform="Instagram"
            />

            {/* List of added socials
            {socials.length > 0 && (
              <YStack marginTop={12} gap={8}>
                {socials.map((s) => (
                  <XStack
                    key={s.platform}
                    justifyContent="space-between"
                    alignItems="center"
                    style={styles.addedRow}
                  >
                    <XStack alignItems="center" gap={8}>
                      <Text fontWeight="600" color="#0E0E55">
                        {s.platform}:
                      </Text>
                      <Text>{s.handle}</Text>
                    </XStack>
                  </XStack>
                ))}
              </YStack>
            )} */}

            <Button
              onPress={handleSave}
              backgroundColor={colors.primary}
              color="#fff"
              borderRadius={10}
              height={50}
              marginTop={18}
              disabled={isLoading}
              opacity={isLoading ? 0.6 : 1}
            >
              {isLoading ? "Saving..." : surrogateProfile ? "Update Profile" : "Create Profile"}
            </Button>
          </ScrollView>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  full: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 999
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  sheetWrapper: {
    // bottom sheet wrapper anchored to bottom
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "97%",
    minHeight: 220,
  },
  input: {
    borderColor: colors.primary,
    backgroundColor: "#F8F8FA",
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 44,
    color: colors.primary,
  },
  textArea: {
    height: 120,
    paddingVertical: 10,
  },
  addedRow: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    backgroundColor: "#F8F8FA",
    borderRadius: 8,
  },
});
