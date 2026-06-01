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
  ActivityIndicator,
} from "react-native";
import { YStack, XStack, Text, Button } from "tamagui";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import colors from "@/hooks/colors";
import PlatformInput from "./SocialSelector";
import { Toast } from "toastify-react-native";
import { ToastType } from "toastify-react-native/utils/interfaces";

export type Social = {
  platform: string;
  handle: string;
};

export type EditProfileModalProps = {
  visible: boolean;
  onClose: () => void;
  onSave: (data: {
    userName: string;
    aboutMe: string;
    socials: Social[];
  }) => Promise<void>;
  profile?: {
    userName?: string;
    aboutMe?: string;
    socials?: Social[];
  };
  isLoading?: boolean;
};

export default function EditProfileModal({
  visible,
  onClose,
  onSave,
  profile,
  isLoading = false,
}: EditProfileModalProps) {
  const [username, setUsername] = useState("");
  const [about, setAbout] = useState("");
  const [socials, setSocials] = useState<Social[]>([]);

  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [aboutInputHeight, setAboutInputHeight] = useState(44);
  const anim = useRef(new Animated.Value(0)).current;

  /* ---------- Populate from API ---------- */
  useEffect(() => {
    if (!visible) return;

    setUsername(profile?.userName || "");
    setAbout(profile?.aboutMe || "");
    setSocials(profile?.socials || []);
  }, [visible]);

  /* ---------- Keyboard ---------- */
  useEffect(() => {
    let showSub: EmitterSubscription;
    let hideSub: EmitterSubscription;

    const onShow = (e: any) => {
      const h = e.endCoordinates?.height ?? 0;
      setKeyboardHeight(h);
      Animated.timing(anim, {
        toValue: h * 0.5,
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
      showSub = Keyboard.addListener("keyboardDidShow", onShow);
      hideSub = Keyboard.addListener("keyboardDidHide", onHide);
    }

    return () => {
      showSub?.remove();
      hideSub?.remove();
    };
  }, [anim]);

  /* ---------- Add / Update Social ---------- */
  const handleAddSocial = (platform: string, handle: string) => {
    setSocials((prev) => {
      const exists = prev.find((s) => s.platform === platform);
      if (exists) {
        return prev.map((s) =>
          s.platform === platform ? { platform, handle } : s
        );
      }
      return [...prev, { platform, handle }];
    });
  };

  /* ---------- Remove Social ---------- */
  const handleRemoveSocial = (platform: string) => {
    if (isLoading) return;
    setSocials((prev) => prev.filter((s) => s.platform !== platform));
  };

  /* ---------- Save ---------- */
  const handleSave = async () => {
    if (isLoading) return;

    await onSave({
      userName: username.trim(),
      aboutMe: about.trim(),
      socials: socials.filter(
        (s) => s.handle && s.handle.trim().length > 0
      ),
    });

    Toast.show({
      text1: "Bio updated successfully",
      type: "customSuccess" as ToastType,
    });

    onClose();
  };

  if (!visible) return null;

  return (
    <SafeAreaView style={styles.full}>
      <TouchableWithoutFeedback
        disabled={isLoading}
        onPress={() => {
          Keyboard.dismiss();
          if (!isLoading) onClose();
        }}
      >
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      <Animated.View
        style={[styles.sheetWrapper, { transform: [{ translateY: anim }] }]}
      >
        <View style={styles.sheet}>
          {/* Header */}
          <XStack justifyContent="space-between" alignItems="center">
            <Text  color={colors.text} fontSize={18} fontWeight="700">
              Edit Bio
            </Text>
            <TouchableOpacity disabled={isLoading} onPress={onClose}>
              <Text color={isLoading ? "#999" : colors.primary}>Close</Text>
            </TouchableOpacity>
          </XStack>

          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              paddingBottom: Math.max(24, keyboardHeight + 24),
            }}
          >
            {/* Username */}
            <YStack marginTop={16}>
              <Text color={colors.text} fontWeight="600">Username</Text>
              <TextInput 
                value={username}
                editable={!isLoading}
                onChangeText={setUsername}
                style={styles.input}
              />
            </YStack>

            {/* About */}
            <YStack marginTop={16}>
              <Text color={colors.text} fontWeight="600">About</Text>
              <TextInput
                multiline
                editable={!isLoading}
                value={about}
                onChangeText={(t) => t.length <= 300 && setAbout(t)}
                onContentSizeChange={(e) =>
                  setAboutInputHeight(
                    Math.min(Math.max(44, e.nativeEvent.contentSize.height), 200)
                  )
                }
                style={[
                  styles.input,
                  { height: aboutInputHeight, paddingVertical: 10 },
                ]}
              />
              <Text alignSelf="flex-end" fontSize={12}>
                {about.length}/300
              </Text>
            </YStack>

            {/* Existing Socials */}
            {socials.length > 0 && (
              <YStack marginTop={18}>
                <Text color={colors.text} fontWeight="600" marginBottom={8}>
                  Your Socials
                </Text>

                {socials.map((social) => (
                  <XStack
                    key={social.platform}
                    alignItems="center"
                    justifyContent="space-between"
                    style={styles.socialRow}
                  >
                    <Text color={colors.text}>
                      {social.platform}: @{social.handle}
                    </Text>

                    <TouchableOpacity
                      disabled={isLoading}
                      onPress={() => handleRemoveSocial(social.platform)}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={18}
                        color={isLoading ? "#ccc" : colors.danger}
                      />
                    </TouchableOpacity>
                  </XStack>
                ))}
              </YStack>
            )}

            {/* Add / Update Social */}
            <YStack marginTop={16}>
              <Text fontWeight="600" marginBottom={8}>
                Add Social
              </Text>
              <PlatformInput
                onAdd={handleAddSocial}
                disabled={isLoading}
              />
            </YStack>

            {/* Save */}
            <Button
              height={50}
              marginTop={20}
              borderRadius={10}
              backgroundColor={colors.primary}
              disabled={isLoading}
              opacity={isLoading ? 0.6 : 1}
              onPress={handleSave}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                "Save Changes"
              )}
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
    inset: 0,
    zIndex: 999,
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  sheetWrapper: {
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
  },
  input: {
    backgroundColor: "#F8F8FA",
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 44,
    color: "$color"
  },
  textArea: {
    height: 120,
    paddingVertical: 10,
  },
  socialRow: {
    backgroundColor: "#F6F6F8",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
  },
});
