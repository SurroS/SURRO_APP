// import React, { useEffect } from "react";
// import {
//   View,
//   TouchableOpacity,
//   TextInput,
//   StyleSheet,
//   KeyboardAvoidingView,
//   Platform,
//   TouchableWithoutFeedback,
//   Keyboard,
//   ScrollView,
// } from "react-native";
// import { YStack, XStack, Text, Button } from "tamagui";
// import colors from "@/hooks/colors";
// import PlatformInput from "./SocialSelector"; // adjust path if needed
// import { SafeAreaView } from "react-native-safe-area-context";
// import KeyboardAvoidingWrapper from "../keyboardAvoidingWrapper";

// type Social = { platform: string; handle: string };

// type EditProfileModalProps = {
//   visible: boolean;
//   onClose: () => void;
//   onSave: (data: {
//     username: string;
//     about: string;
//     socials: Social[];
//   }) => void;
// };

// export default function BioInputModal({
//   visible,
//   onClose,
//   onSave,
// }: EditProfileModalProps) {
//   const [username, setUsername] = React.useState("");
//   const [about, setAbout] = React.useState("");
//   const [socials, setSocials] = React.useState<Social[]>([]);

//   // reset when opened/closed if you prefer
//   useEffect(() => {
//     if (!visible) {
//       // keep fields if you want; uncomment to reset on close
//       // setUsername("");
//       // setAbout("");
//       // setSocials([]);
//     }
//   }, [visible]);

//   // add callback from PlatformInput: we'll pass onAdd prop
//   const handleAddSocial = (platform: string, handle: string) => {
//     // avoid duplicates of same platform
//     if (socials.some((s) => s.platform === platform)) return;
//     setSocials((p) => [{ platform, handle }, ...p]);
//   };

//   const handleRemoveSocial = (platform: string) => {
//     setSocials((p) => p.filter((s) => s.platform !== platform));
//   };

//   const handleSave = () => {
//     onSave({ username, about, socials });
//     onClose();
//   };

//   if (!visible) return null;

//   return (
//     <SafeAreaView style={styles.full}>
//       <TouchableWithoutFeedback onPress={onClose}>
//         <View style={styles.backdrop} />
//       </TouchableWithoutFeedback>

//      <KeyboardAvoidingWrapper>
//   <View style={styles.sheetWrapper}>
//     <View style={styles.sheet}>
//       {/* Header */}
//       <XStack
//         justifyContent="space-between"
//         alignItems="center"
//         style={{ marginBottom: 8 }}
//       >
//         <Text fontSize={18} fontWeight="700" color={colors.primary}>
//           Edit Profile
//         </Text>

//         <TouchableOpacity onPress={onClose}>
//           <Text color={colors.primary}>Close</Text>
//         </TouchableOpacity>
//       </XStack>

//       <ScrollView
//         style={{ flex: 1 }}
//         contentContainerStyle={{ paddingBottom: 24 }}
//         keyboardShouldPersistTaps="handled"
//       >
//         {/* Username */}
//         <YStack marginBottom={12}>
//           <Text fontWeight="600" color="#0E0E55" marginBottom={6} fontSize={14}>
//             Username
//           </Text>
//           <TextInput
//             placeholder="@username, no real names"
//             value={username}
//             placeholderTextColor={"gray"}
//             onChangeText={setUsername}
//             style={styles.input}
//             returnKeyType="next"
//           />
//         </YStack>

//         {/* About */}
//         <YStack marginBottom={12}>
//           <Text fontWeight="600" color="#0E0E55" marginBottom={6} fontSize={14}>
//             About
//           </Text>
//           <TextInput
//             multiline
//             placeholderTextColor={"gray"}
//             value={about}
//             onChangeText={(text) => {
//               if (text.length <= 300) setAbout(text);
//             }}
//             style={[styles.input, styles.textArea]}
//             placeholder="Write something about yourself..."
//             textAlignVertical="top"
//           />
//           <Text
//             alignSelf="flex-end"
//             fontSize={12}
//             color={about.length < 300 ? colors.primary : colors.danger}
//             marginTop={6}
//           >
//             {about.length}/300
//           </Text>
//         </YStack>

//         {/* Socials */}
//         <Text
//           fontWeight="600"
//           color="#0E0E55"
//           fontSize={14}
//           marginBottom={8}
//         >
//           Add Socials
//         </Text>

//         <PlatformInput onAdd={handleAddSocial} initialPlatform="Instagram" />

//         {/* List of socials */}
//         {socials.length > 0 && (
//           <YStack marginTop={12} gap={8}>
//             {socials.map((s) => (
//               <XStack
//                 key={s.platform}
//                 justifyContent="space-between"
//                 alignItems="center"
//                 style={styles.addedRow}
//               >
//                 <XStack alignItems="center" gap={8}>
//                   <Text fontWeight="600" color="#0E0E55">
//                     {s.platform}:
//                   </Text>
//                   <Text>{s.handle}</Text>
//                 </XStack>

//                 <TouchableOpacity onPress={() => handleRemoveSocial(s.platform)}>
//                   <Text color={colors.danger}>Remove</Text>
//                 </TouchableOpacity>
//               </XStack>
//             ))}
//           </YStack>
//         )}

//         <Button
//           onPress={handleSave}
//           backgroundColor={colors.primary}
//           color="#fff"
//           borderRadius={10}
//           height={50}
//           marginTop={18}
//         >
//           Save
//         </Button>
//       </ScrollView>
//     </View>
//   </View>
// </KeyboardAvoidingWrapper>

//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   full: {
//     position: "absolute",
//     left: 0,
//     right: 0,
//     top: 0,
//     bottom: 0,
//     zIndex: 999,
//   },
//   backdrop: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.45)",
//   },
//   sheetWrapper: {
//     // bottom sheet wrapper anchored to bottom
//     position: "absolute",
//     left: 0,
//     right: 0,
//     bottom: 0,
//   },
//   sheet: {
//     flex:1,
//     backgroundColor: "#fff",
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     padding: 20,
//     maxHeight: "97%",
//     minHeight: "97%",
//   },
//   input: {
//     borderColor: colors.primary,
//     backgroundColor: "#F8F8FA",
//     borderRadius: 8,
//     paddingHorizontal: 10,
//     height: 44,
//     color: colors.primary,
//   },
//   textArea: {
//     height: 120,
//     paddingVertical: 10,
//   },
//   addedRow: {
//     paddingVertical: 8,
//     paddingHorizontal: 8,
//     backgroundColor: "#F8F8FA",
//     borderRadius: 8,
//   },
// });

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

export default function BioInputModal({
  visible,
  onClose,
  onSave,
}: EditProfileModalProps) {
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
        toValue: -h*0.1,
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

  const handleSave = () => {
    onSave({ username, about, socials });
    onClose();
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
                placeholder="Write something about yourself..."
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

            <Button
              onPress={handleSave}
              backgroundColor={colors.primary}
              color="#fff"
              borderRadius={10}
              height={50}
              marginTop={18}
            >
              Save
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
    zIndex: 999,
    elevation: 999,
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
