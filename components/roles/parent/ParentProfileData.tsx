import { Ionicons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import { Image, Text, XStack, YStack } from "tamagui";
import { useParentProfileStore } from "@/store/profile/parent";

const ProfileData = () => {
  const { parentProfile, updateParentProfile } = useParentProfileStore();

  const handleStatusPress = async () => {
    if (parentProfile) {
      try {
        await updateParentProfile({ isAvailable: !parentProfile.isAvailable });
        console.log("Status updated:", !parentProfile.isAvailable);
      } catch (error) {
        console.error("Failed to update status:", error);
      }
    }
  };

  return (
    <XStack margin={2} gap="$4" alignItems="flex-start" height={150} flex={1}>
      <Image
        source={
          parentProfile?.profilePicture
            ? { uri: parentProfile.profilePicture }
            : require("@/assets/images/femaleAvatar.png")
        }
        width={"45%"}
        height={"100%"}
        borderRadius="$3"
      />

      <YStack gap="$3">
        <XStack alignItems="center" gap="$2">
          <Text color="black" fontSize="$4" fontWeight="bold" textWrap="wrap">
            {parentProfile?.userName || "User Name"}
          </Text>
        </XStack>

        <XStack alignItems="center" gap="$2">
          <Ionicons name="location-outline" size={19} color="#666" />
          <Text color="black" fontSize="$3">
            {parentProfile?.countryOfResidence || "Location not set"}
          </Text>
        </XStack>

        <XStack alignItems="center" gap="$2">
          <Text
            color={parentProfile?.isAvailable ? "green" : "red"}
            fontSize="$3"
            onPress={handleStatusPress}
          >
            {parentProfile?.isAvailable ? "Available" : "Unavailable"}
          </Text>
        </XStack>
      </YStack>
    </XStack>
  );
};

export default ProfileData;

const styles = StyleSheet.create({
  statusButton: {
    borderRadius: 30,
    height: "24%",
    flexGrow: 0.5,
    justifyContent: "center",
    alignItems: "center",
  },
});
