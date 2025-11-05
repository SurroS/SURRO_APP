import React, { useState } from "react";
import {
  Modal,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  TextInput,
  Platform,
} from "react-native";
import { YStack, XStack, Text, Button, Select, SelectIcon } from "tamagui";
import colors from "@/hooks/colors";
import KeyboardAvoidingWrapper from "../keyboardAvoidingWrapper";
import { Ionicons } from "@expo/vector-icons";
import PlatformInput from "./SocialSelector";

type Social = { platform: string; handle: string };

type EditProfileModalProps = {
  visible: boolean;
  onClose: () => void;
  onSave: (data: {
    username: string;
    about: string;
    socials: Social[];
  }) => void;
};

export default function EditProfileModal({
  visible,
  onClose,
  onSave,
}: EditProfileModalProps) {
  const [username, setUsername] = useState("");
  const [about, setAbout] = useState("");
  const [socials, setSocials] = useState<Social[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState("Instagram");
  const [socialInput, setSocialInput] = useState("");

  const addSocial = () => {
    if (!socialInput.trim()) return;
    const exists = socials.some((s) => s.platform === selectedPlatform);
    if (exists) return;
    setSocials((prev) => [
      ...prev,
      { platform: selectedPlatform, handle: socialInput.trim() },
    ]);
    setSocialInput("");
  };

  const removeSocial = (platform: string) => {
    setSocials((prev) => prev.filter((s) => s.platform !== platform));
  };

  const handleSave = () => {
    onSave({ username, about, socials });
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <KeyboardAvoidingWrapper>
        <YStack
          flex={1}
          justifyContent="flex-end" 
          backgroundColor="rgba(0,0,0,0.5)"
        >
          <YStack
            backgroundColor="#FFFFFF"
            borderTopLeftRadius={25}
            borderTopRightRadius={25}
            padding={20}
            maxHeight="90%"
          >
            {/* Header */}
            <XStack
              justifyContent="space-between"
              alignItems="center"
              marginBottom={12}
            >
              <Text fontSize={18} fontWeight="700" color={colors.primary}>
                Edit Profile
              </Text>
              <TouchableOpacity onPress={onClose}>
                <Text color={colors.primary}>Close</Text>
              </TouchableOpacity>
            </XStack>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 80 }}
            >
              {/* Username */}
              <YStack marginBottom={20}>
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
                  style={{
                    borderColor: colors.primary,
                    backgroundColor: "#F8F8FA",
                    borderRadius: 8,
                    paddingHorizontal: 10,
                    height: 44,
                    color: colors.primary,
                  }}
                />
              </YStack>

              {/* About */}
              <YStack marginBottom={20}>
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
                  style={{
                    borderColor: colors.primary,
                    backgroundColor: "#F8F8FA",
                    borderRadius: 8,
                    paddingHorizontal: 10,
                    height: 100,
                    color: colors.primary,
                    paddingVertical: 10,
                    textAlignVertical: "top",
                  }}
                  placeholder="Write something about yourself..."
                />
                <Text
                  alignSelf="flex-end"
                  fontSize={12}
                  color={about.length < 300 ? colors.primary : colors.danger}
                  marginTop={4}
                >
                  {about.length}/300
                </Text>
              </YStack>

              {/* Add Socials */}
              <Text
                fontWeight="600"
                color="#0E0E55"
                fontSize={14}
                marginBottom={8}
              >
                Add Socials
              </Text> 
                <PlatformInput /> 
              
            </ScrollView>
 
            <Button
              backgroundColor={colors.primary}
              color="#FFFFFF"
              borderRadius={10}
              height={50}
              onPress={handleSave}
              marginTop={10}
            >
              Save
            </Button>
          </YStack>
        </YStack>
      </KeyboardAvoidingWrapper>
    </Modal>
  );
}

