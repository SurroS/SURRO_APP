import { useProfile } from "@/hooks/useProfile";
import { Feather, Ionicons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Image, Text, XStack, YStack } from "tamagui";

const SurrogateProfileDataView = () => {
  const { surrogateProfile, updateProfile } = useProfile();

  const handleStatusPress = async () => {
    if (surrogateProfile) {
      try {
        await updateProfile({ isAvailable: !surrogateProfile.isAvailable });
        console.log("Status updated:", !surrogateProfile.isAvailable);
      } catch (error) {
        console.error("Failed to update status:", error);
      }
    }
  };

  return (
    <XStack margin={2} gap="$4" alignItems="flex-start" height={150} flex={1}>
      <Image
        source={
          surrogateProfile?.profilePicture
            ? { uri: surrogateProfile?.profilePicture }
            : require("@/assets/images/femaleAvatar.png")
        }
        width={"45%"}
        height={"100%"}
        borderRadius="$3"
      />

      <YStack gap="$3">
        <XStack alignItems="center" gap="$2">
          <Text color="black" fontSize="$4" fontWeight={"bold"} textWrap="wrap">
            {surrogateProfile ? `${surrogateProfile.userName}` : "User Name"}
          </Text>
        </XStack>

        <XStack alignItems="center" gap="$2">
          <Ionicons name="location-outline" size={19} color="#666" />
          <Text color="black" fontSize="$3">
            {surrogateProfile?.countryOfResidence || "Location not set"}
          </Text>
        </XStack>

        <XStack alignItems="center" gap="$2">
          <Feather name="calendar" size={19} color="#666" />
          <Text color="black" fontSize="$3">
            {surrogateProfile?.dateOfBirth?.split("T00") || "DOB not set"}
          </Text>
        </XStack>

        <TouchableOpacity
          onPress={handleStatusPress}
          style={[
            styles.statusButton,
            {
              backgroundColor: surrogateProfile?.isAvailable
                ? "#80cdb1ff"
                : "#b4b4b3ff",
            },
          ]}
        >
          <Text color="black" fontSize="$3" fontWeight={"bold"}>
            {surrogateProfile?.isAvailable ? "Available" : "Not Available"}
          </Text>
        </TouchableOpacity>
      </YStack>
    </XStack>
  );
};

export default SurrogateProfileDataView;

const styles = StyleSheet.create({
  statusButton: {
    borderRadius: 30,
    height: "24%",
    flexGrow: 0.5,
    justifyContent: "center",
    alignItems: "center",
  },
});
