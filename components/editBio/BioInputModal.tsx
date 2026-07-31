import React, { useEffect, useState, useRef } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { YStack, XStack, Text, Button } from "tamagui";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
  role?: string;
};

export default function EditProfileModal({
  visible,
  onClose,
  onSave,
  profile,
  isLoading = false,
  role,
}: EditProfileModalProps) {
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const [username, setUsername] = useState("");
  const [about, setAbout] = useState("");
  const [socials, setSocials] = useState<Social[]>([]);
  const [aboutInputHeight, setAboutInputHeight] = useState(80);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const aboutY = useRef(0);
  const socialsY = useRef(0);

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", (e) =>
      setKeyboardHeight(e.endCoordinates.height)
    );
    const hideSub = Keyboard.addListener("keyboardDidHide", () =>
      setKeyboardHeight(0)
    );
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  useEffect(() => {
    if (!visible) return;
    setUsername(profile?.userName || "");
    setAbout(profile?.aboutMe || "");
    setSocials(profile?.socials || []);
  }, [visible]);

  const handleAddSocial = (platform: string, handle: string) => {
    setSocials((prev) => {
      const exists = prev.find((s) => s.platform === platform);
      if (exists) {
        return prev.map((s) =>
          s.platform === platform ? { platform, handle } : s,
        );
      }
      return [...prev, { platform, handle }];
    });
  };

  const [usernameError, setUsernameError] = useState("");

  const handleSave = async () => {
    if (isLoading) return;
    const trimmed = username.trim();
    if (!/\d/.test(trimmed) || !/[^a-zA-Z0-9\s]/.test(trimmed)) {
      setUsernameError("Username must include at least one number and one special character");
      return;
    }
    setUsernameError("");
    await onSave({
      userName: trimmed,
      aboutMe: about.trim(),
      socials: socials.filter((s) => s.handle && s.handle.trim().length > 0),
    });
    Toast.show({
      text1: "Bio updated successfully",
      type: "customSuccess" as ToastType,
    });
    onClose();
  };

  if (!visible) return null;

  // Reduce the effective keyboard offset so the sheet doesn't move too high when
  // the keyboard opens. Subtract 50px from the keyboard height (minimum 0).
  const effectiveKeyboardOffset = Math.max(0, keyboardHeight - 50);

  return (
    <View style={[styles.full, { paddingBottom: insets.bottom || 16 }]}>
      <TouchableWithoutFeedback
        disabled={isLoading}
        onPress={() => {
          Keyboard.dismiss();
          if (!isLoading) onClose();
        }}
      >
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>
      <View style={styles.sheetWrapper}>
        <View style={styles.sheet}>
          <XStack
            justifyContent="space-between"
            alignItems="center"
            paddingHorizontal={20}
            paddingTop={20}
          >
            <Text color={colors.text} fontSize={18} fontWeight="700">
              Edit Bio
            </Text>
            <TouchableOpacity disabled={isLoading} onPress={onClose}>
              <Text color={isLoading ? "#999" : colors.primary}>Close</Text>
            </TouchableOpacity>
          </XStack>
          <ScrollView
            ref={scrollRef}
            contentContainerStyle={{
              paddingHorizontal: 20,
              // Use a slightly reduced keyboard height so the modal doesn't get pushed up too far
              paddingBottom: effectiveKeyboardOffset + 20,
            }}
            keyboardShouldPersistTaps="handled"
          >
            <YStack
              marginTop={16}
              onLayout={(e) => { aboutY.current = e.nativeEvent.layout.y; }}
            >
              <Text color={colors.text} fontWeight="600">
                Username
              </Text>
              <TextInput
                value={username}
                editable={!isLoading}
                onChangeText={(t) => { setUsername(t); setUsernameError(""); }}
                placeholder="no real names hear"
                placeholderTextColor="#999"
                style={styles.input}
                maxLength={10}
                onFocus={() => scrollRef.current?.scrollTo({ y: 0, animated: true })}
              />
              <Text alignSelf="flex-end" fontSize={12} color={colors.textSecondary ?? "#666"} marginTop={4}>
                {username.length}/10
              </Text>
              {usernameError ? (
                <Text fontSize={12} color={colors.danger} marginTop={4}>
                  {usernameError}
                </Text>
              ) : null}
            </YStack>
             <YStack marginTop={16}>
               <Text color={colors.text} fontWeight="600">
                 About
               </Text>
               <TextInput
                 multiline
                 editable={!isLoading}
                 value={about}
                 onChangeText={(t) => t.length <= 300 && setAbout(t)}
                 placeholder={role === "AGENT" ? "tell us why you want to be an agent" : "tell us why you need this, no one else can see this."}
                 placeholderTextColor="#999"
                 onContentSizeChange={(e) =>
                   setAboutInputHeight(
                     Math.min(Math.max(80, e.nativeEvent.contentSize.height), 200),
                   )
                 }
                 style={[
                   styles.input,
                   { height: aboutInputHeight, paddingVertical: 10 },
                 ]}
                 onFocus={() => scrollRef.current?.scrollTo({ y: aboutY.current, animated: true })}
               />
               <Text alignSelf="flex-end" fontSize={12}>
                 {about.length}/300
               </Text>
             </YStack>
            <YStack marginTop={16}>
              <Text color={colors.text} fontWeight="600" marginBottom={4}>
                Socials
              </Text>
              <Text fontSize={13} color={colors.textSecondary ?? "#555"} marginBottom={4} lineHeight={18}>
                Your social profiles help us verify your identity. This information is kept private and will not be shared with anyone.
              </Text>
              <Text fontSize={13} color={colors.textSecondary ?? "#555"} marginBottom={12} lineHeight={18}>
                Please enter links to your social profiles (e.g. Facebook, Instagram).
              </Text>
              <YStack
                onLayout={(e) => { socialsY.current = e.nativeEvent.layout.y; }}
              >
              <Text fontWeight="600" marginBottom={8}>
                Add Social
              </Text>
              <PlatformInput
                onAdd={handleAddSocial}
                disabled={isLoading}
                onInputFocus={() => scrollRef.current?.scrollTo({ y: socialsY.current, animated: true })}
              />

              {socials.length > 0 && (
                <YStack marginTop={12}>
                  {socials.map((s) => (
                    <XStack
                      key={s.platform}
                      alignItems="center"
                      gap="$2"
                      backgroundColor="#F8F8FA"
                      borderRadius={10}
                      padding={10}
                      marginBottom={8}
                    >
                      <Ionicons name="link" size={18} color="#666" />
                      <Text flex={1} fontSize={14} color="#111">
                        {s.platform}: <Text fontWeight="700">{s.handle}</Text>
                      </Text>
                      <TouchableOpacity
                        onPress={() =>
                          setSocials((prev) =>
                            prev.filter((x) => x.platform !== s.platform),
                          )
                        }
                      >
                        <Text color="#E63946" fontWeight="700">delete</Text>
                      </TouchableOpacity>
                    </XStack>
                  ))}
                </YStack>
              )}
            </YStack>
            </YStack>
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
      </View>
    </View>
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
    maxHeight: "90%",
    minHeight: 200,
  },
  input: {
    backgroundColor: "#F8F8FA",
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 44,
    color: "#000",
  },
  socialRow: {
    backgroundColor: "#F6F6F8",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
  },
});
