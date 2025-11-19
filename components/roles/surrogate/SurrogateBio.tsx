// components/roles/agent/AgentBio.tsx
import React from "react";
import { YStack } from "tamagui";
import RoleCommonProfile from "@/components/editBio/RoleCommonProfile";
import InfoRowCard from "@/components/editBio/infoRowCard";
import { router } from "expo-router";

interface AgentBioProps {
  profileImage?: { uri: string };
  onChangePicture: () => void;
  onEditBio: () => void;
}

export default function SurrogateBio(props: AgentBioProps) {

  return (
    <YStack gap="$3" width="100%">
      <RoleCommonProfile {...props} />
      {/* Agent-specific info */}
      <InfoRowCard
        title="Medical history"
        subtitle="Tell us about your health"
        icon={History}
        onPress={() => router.navigate("/settings/medical")}
      />
    </YStack>
  );
}

// import React, { useState } from "react";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { YStack, XStack, Text, ScrollView, Separator } from "tamagui";
// import { Alert } from "react-native";
// import { router } from "expo-router";
// import { User, Contact, LogOut, History } from "@tamagui/lucide-icons";
// import { Toast } from "toastify-react-native";
// import { ToastType } from "toastify-react-native/utils/interfaces";
// import * as ImagePicker from "expo-image-picker";

// import colors from "@/hooks/colors";
// import { ScreenHeader } from "@/components/auth";
// import ProfileImageCard from "@/components/editBio/profileImageCard";
// import InfoRowCard from "@/components/editBio/infoRowCard";
// import EditProfileModal from "@/components/editBio/BioInputModal";
// import { useAuth } from "@/hooks/useAuth";

// export default function EditBioView() {
//   const [isDanger, setIsDanger] = useState(false);
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [profileImage, setProfileImage] = useState<string | null>(null);
//   const { logout } = useAuth();

//   //  Handle logout
//   const handleLogout = () => {
//     logout();
//     Toast.show({
//       text1: "Logged out successfully",
//       type: "customSuccess" as ToastType,
//       text2: "You have been logged out",
//     });
//     router.replace("/(auth)/login");
//   };

//   //  Handle delete account
//   const handleDeleteAccount = () => {
//     Alert.alert(
//       "DANGER",
//       "Are you sure you want to delete your account? This process is not reversible.",
//       [
//         {
//           text: "OK",
//           onPress: () => {
//             console.log("Account deleted");
//           },
//           style: "destructive",
//         },
//         {
//           text: "Cancel",
//           style: "cancel",
//         },
//       ]
//     );
//   };

//   // Pick profile image
//   const handleChangePicture = async () => {
//     try {
//       const permission =
//         await ImagePicker.requestMediaLibraryPermissionsAsync();
//       if (permission.status !== "granted") {
//         Alert.alert(
//           "Permission needed",
//           "We need access to your photo gallery to update your profile picture."
//         );
//         return;
//       }

//       const result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         allowsEditing: true,
//         aspect: [1, 1],
//         quality: 0.8,
//       });

//       if (!result.canceled) {
//         const uri = result.assets[0].uri;
//         setProfileImage(uri);
//         Toast.show({
//           text1: "Profile picture updated!",
//           type: "customSuccess" as ToastType,
//         });
//       }
//     } catch (error) {
//       console.error("Image picker error:", error);
//       Alert.alert("Error", "Something went wrong while selecting the image.");
//     }
//   };

//   // Open edit bio modal
//   const handleEditBio = () => {
//     setIsModalVisible(true);
//   };

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF", paddingTop:20, padding:20 }}>
//       <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
//         <YStack padding="$4" gap="$4" alignItems="center">
//           {/* Header */}
//           <ScreenHeader
//             title="Profile Information"
//             onBackPress={() => router.back()}
//           />

//           {/* Profile Image */}
//           <YStack width="100%" alignItems="center" marginTop="$4">
//             <ProfileImageCard
//               onChangePicture={handleChangePicture}
//               onEditBio={handleEditBio}
//               imageSrc={profileImage ? { uri: profileImage } : undefined}
//             />
//           </YStack>

//           {/* Info Rows */}
//           <YStack gap="$3" marginTop="$3">
//             <InfoRowCard
//               title="Personal details"
//               subtitle="Tell us more about yourself"
//               icon={User}
//               onPress={() => router.navigate("/settings/profile/personalDetails")}
//             />
//             <InfoRowCard
//               title="Contact information"
//               subtitle="How can we reach you?"
//               icon={Contact}
//               onPress={() => router.navigate("/settings/profile/contactInformation")}
//             />
//             <InfoRowCard
//               title="Medical history"
//               subtitle="Tell us about your health"
//               icon={History}
//               onPress={() => router.navigate("/settings/medical")}
//             />
//           </YStack>
//           {/* Danger + Logout */}
//           <YStack marginTop="$5" gap="$3" alignItems="center">
//             <XStack alignItems="center" gap="$2">
//               <LogOut size={16} color={colors.primary} />
//               <Text
//                 color={colors.primary}
//                 fontWeight="600"
//                 fontSize={14}
//                 onPress={handleLogout}
//               >
//                 Log out
//               </Text>
//             </XStack>

//             <YStack alignItems="center" marginTop="$2">
//               <Text
//                 color="#E63946"
//                 fontWeight="600"
//                 onPress={() => setIsDanger(!isDanger)}
//               >
//                 Danger zone
//               </Text>
//               {isDanger && (
//                 <Text
//                   marginTop="$2"
//                   color="#E63946"
//                   fontWeight="600"
//                   onPress={handleDeleteAccount}
//                 >
//                   Deactivate account
//                 </Text>
//               )}
//             </YStack>
//           </YStack>
//         </YStack>
//       </ScrollView>

//       {/* Bio Edit Modal */}
//       <EditProfileModal
//         onSave={() => {
//           console.log("bio saved");
//           Toast.show({
//             text1: "Bio updated!",
//             type: "customSuccess" as ToastType,
//           });
//         }}
//         visible={isModalVisible}
//         onClose={() => setIsModalVisible(false)}
//       />
//     </SafeAreaView>
//   );
// }
