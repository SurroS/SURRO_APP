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
import PlatformInput from "./SocialSelector";
import { SafeAreaView } from "react-native-safe-area-context";

export type Social = { platform: string; handle: string };

export type EditProfileModalProps = {
  visible: boolean;
  onClose: () => void;
  onSave: (data: {
    username: string;
    about: string;
    socials: Social[];
  }) => Promise<void> | void;
  profile?: {
    username?: string;
    about?: string;
    socials?: Social[];
  };
  isLoading?: boolean;
};

export default function EditProfileModal({
  visible,
  onClose,
  onSave,
  profile,
  isLoading,
}: EditProfileModalProps) {
  const [username, setUsername] = useState(profile?.username || "");
  const [about, setAbout] = useState(profile?.about || "");
  const [socials, setSocials] = useState<Social[]>(profile?.socials || []);

  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setUsername(profile?.username || "");
    setAbout(profile?.about || "");
    setSocials(profile?.socials || []);
  }, [profile, visible]);

  useEffect(() => {
    let showSub: EmitterSubscription;
    let hideSub: EmitterSubscription;

    const onShow = (e: any) => {
      const h = e.endCoordinates?.height ?? 0;
      setKeyboardHeight(h);
      Animated.timing(anim, { toValue: h * 0.5, duration: 200, useNativeDriver: true }).start();
    };
    const onHide = () => {
      setKeyboardHeight(0);
      Animated.timing(anim, { toValue: 0, duration: 180, useNativeDriver: true }).start();
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

  const handleAddSocial = (platform: string, handle: string) => {
    if (socials.some((s) => s.platform === platform)) return;
    setSocials((p) => [{ platform, handle }, ...p]);
  };

  const handleRemoveSocial = (platform: string) => {
    setSocials((p) => p.filter((s) => s.platform !== platform));
  };

  const handleSave = async () => {
    if (onSave) await onSave({ username, about, socials });
    onClose();
  };

  if (!visible) return null;

  return (
    <SafeAreaView style={styles.full}>
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
          onClose();
        }}
      >
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      <Animated.View style={[styles.sheetWrapper, { transform: [{ translateY: anim }] }]} pointerEvents="box-none">
        <View style={styles.sheet}>
          <XStack justifyContent="space-between" alignItems="center" style={{ marginBottom: 8 }}>
            <Text fontSize={18} fontWeight="700" color={colors.primary}>Edit Profile</Text>
            <TouchableOpacity onPress={onClose}>
              <Text color={colors.primary}>Close</Text>
            </TouchableOpacity>
          </XStack>

          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: Math.max(24, keyboardHeight + 24) }} keyboardShouldPersistTaps="handled">
            {/* Username */}
            <YStack marginBottom={12}>
              <Text fontWeight="600" color="#0E0E55" marginBottom={6} fontSize={14}>Username</Text>
              <TextInput
                placeholder="@username, no real names"
                value={username}
                placeholderTextColor="gray"
                onChangeText={setUsername}
                style={styles.input}
                returnKeyType="next"
              />
            </YStack>

            {/* About */}
            <YStack marginBottom={12}>
              <Text fontWeight="600" color="#0E0E55" marginBottom={6} fontSize={14}>About</Text>
              <TextInput
                multiline
                placeholder="Tell us about yourself..."
                placeholderTextColor="gray"
                value={about}
                onChangeText={(text) => { if (text.length <= 300) setAbout(text); }}
                style={[styles.input, styles.textArea]}
                textAlignVertical="top"
              />
              <Text alignSelf="flex-end" fontSize={12} color={about.length < 300 ? colors.primary : colors.danger} marginTop={6}>
                {about.length}/300
              </Text>
            </YStack>

            {/* Socials */}
            <Text fontWeight="600" color="#0E0E55" fontSize={14} marginBottom={8}>Add Socials</Text>
            <PlatformInput onAdd={handleAddSocial} initialPlatform="Instagram" />

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
              {isLoading ? "Saving..." : profile ? "Update Profile" : "Create Profile"}
            </Button>
          </ScrollView>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  full: { position: "absolute", left: 0, right: 0, top: 0, bottom: 0, zIndex: 999 },
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)" },
  sheetWrapper: { position: "absolute", left: 0, right: 0, bottom: 0 },
  sheet: { backgroundColor: "#fff", borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: "97%", minHeight: 220 },
  input: { borderColor: colors.primary, backgroundColor: "#F8F8FA", borderRadius: 8, paddingHorizontal: 10, height: 44, color: colors.primary },
  textArea: { height: 120, paddingVertical: 10 },
});
