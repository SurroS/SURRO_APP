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
              {/* Added socials list */}
              
            </ScrollView>

            {/* Save button */}
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

// import React, { useEffect,useState, useRef } from "react";
// import {
//   Modal,
//   View,
//   Image,
//   TouchableOpacity,
//   Animated,
//   StyleSheet,
//   Dimensions,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
//  import { YStack, XStack, Text, Input, Button, Select } from "tamagui";
// import colors from "@/hooks/colors";
// import KeyboardAvoidingWrapper from "../keyboardAvoidingWrapper";

// const { height } = Dimensions.get("window");
// type Social = { platform: string; handle: string };

// export default function BottomModal({
//   visible,
//   onClose,
//   onSave
// }: {
//   visible: boolean;
//   onClose?: () => void;
//   onSave?:()=>void

// }) {

//    const [username, setUsername] = useState("");
//   const [about, setAbout] = useState("");
//   const [socials, setSocials] = useState<Social[]>([]);
//   const [selectedPlatform, setSelectedPlatform] = useState("Instagram");
//   const [socialInput, setSocialInput] = useState("");

//   const addSocial = () => {
//     if (!socialInput.trim()) return;
//     const exists = socials.some((s) => s.platform === selectedPlatform);
//     if (exists) return;
//     setSocials((prev) => [
//       ...prev,
//       { platform: selectedPlatform, handle: socialInput.trim() },
//     ]);
//     setSocialInput("");
//   };

//   const removeSocial = (platform: string) => {
//     setSocials((prev) => prev.filter((s) => s.platform !== platform));
//   };

//   const handleSave = () => {
//   console.log("data sent to backend")
//   };

//   if (!visible) return null;

//   return (
//     <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
//       <View style={styles.overlay}>
//              <YStack marginBottom={20}>
//                <Text
//                   fontWeight="600"
//                   color="#0E0E55"
//                   marginBottom={6}
//                   fontSize={14}
//                 >
//                   Username
//                 </Text>
//               {/* <Input
//                   placeholder="@username"
//                   value={username}
//                   onChangeText={setUsername}
//                   borderColor="#E6E6E6"
//                   backgroundColor="#F8F8FA"
//                   borderRadius={8}
//                   paddingHorizontal={10}
//                   height={44}
//                 /> * */}
//               </YStack>

//               {/* About */}
//               <YStack marginBottom={20}>
//                 <Text
//                   fontWeight="600"
//                   color="#0E0E55"
//                   marginBottom={6}
//                   fontSize={14}
//                 >
//                   About
//                 </Text>
//                 {/* <Input
//                   multiline
//                   numberOfLines={4}
//                   value={about}
//                   onChangeText={(text) => {
//                     if (text.length <= 100) setAbout(text);
//                   }}
//                   placeholder="Write something about yourself..."
//                   borderColor="#E6E6E6"
//                   backgroundColor="#F8F8FA"
//                   borderRadius={8}
//                   paddingHorizontal={10}
//                   paddingVertical={10}
//                   textAlignVertical="top"
//                 /> */}
//                  <Button
//                   backgroundColor="#0E0E55"
//                   color="#FFFFFF"
//                   height={44}
//                   borderRadius={8}
//                   paddingHorizontal={14}
//                   disabled={!socialInput.trim()}
//                   onPress={addSocial}
//                 >
//                   Add
//                 </Button>
//             </YStack>

//       </View>
//     </Modal>
//   );
// }

// const styles = StyleSheet.create({
//   overlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.4)",
//     justifyContent: "flex-end",
//   },
//   modalCard: {
//     backgroundColor: "#fff",
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     padding: 24,
//     alignItems: "center",
//   },
//   successWrap: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     backgroundColor: "#E9F8F1",
//     alignItems: "center",
//     justifyContent: "center",
//     marginBottom: 10,
//   },
//   iconImage: {
//     width: 70,
//     height: 70,
//     marginBottom: 10,
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: "700",
//     color: "#111",
//     textAlign: "center",
//     marginBottom: 4,
//   },
//   message: {
//     fontSize: 14,
//     color: "#555",
//     textAlign: "center",
//     marginBottom: 20,
//   },
//   buttonWrap: {
//     width: "100%",
//     flexDirection: "row",
//     justifyContent: "space-between",
//   },
//   button: {
//     flex: 1,
//     paddingVertical: 12,
//     borderRadius: 10,
//     alignItems: "center",
//     marginHorizontal: 6,
//   },
// });
