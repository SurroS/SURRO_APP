import { useAgentProfile } from "@/hooks/useAgentProfile";
import { Feather, Ionicons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Image, Text, XStack, YStack } from "tamagui";

const ProfileData = () => {
  const { agentProfile, updateAgentProfile } = useAgentProfile();

  const handleStatusPress = async () => {
    if (agentProfile) {
      try {
        await updateAgentProfile({ isAvailable: !agentProfile.isAvailable });
        console.log("Status updated:", !agentProfile.isAvailable);
      } catch (error) {
        console.error("Failed to update status:", error);
      }
    }
  };

  return (
    <XStack margin={2} gap="$4" alignItems="flex-start" height={150} flex={1}>
      <Image
        source={
          agentProfile?.profilePicture
            ? { uri: agentProfile.profilePicture }
            : require("@/assets/images/femaleAvatar.png")
        }
        width={"45%"}
        height={"100%"}
        borderRadius="$3"
      />

      <YStack gap="$3">
        <XStack alignItems="center" gap="$2">
          <Text color="black" fontSize="$4" fontWeight={"bold"} textWrap="wrap">
            {agentProfile ? `${agentProfile.userName}` : "User Name"}
          </Text>
          {/* Add verification status if available */}
        </XStack>

        <XStack alignItems="center" gap="$2">
          <Ionicons name="location-outline" size={19} color="#666" />
          <Text color="black" fontSize="$3">
            {agentProfile?.countryOfResidence || "Location not set"}
          </Text>
        </XStack>

        <XStack alignItems="center" gap="$2">
          <Feather name="calendar" size={19} color="#666" />
          <Text color="black" fontSize="$3">
            {agentProfile?.dateOfBirth || "DOB not set"}
          </Text>
        </XStack>

        <TouchableOpacity
          onPress={handleStatusPress}
          style={[styles.statusButton, { backgroundColor: agentProfile?.isAvailable ? "#80cdb1ff" : "#b4b4b3ff" }]}
        >
          <Text color="black" fontSize="$3" fontWeight={'bold'} >
            {agentProfile?.isAvailable ? "Available" : "Not Available"}
          </Text>
        </TouchableOpacity>
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
    alignItems: "center"
  },
});
