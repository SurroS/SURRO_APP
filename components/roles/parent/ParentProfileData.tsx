import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { Image, Text, XStack, YStack } from "tamagui";
import { useParentProfileStore } from "@/store/profile/parent";

const ParentProfileDataView = () => {
  const { parentProfile, updateParentProfile } = useParentProfileStore();

  return (
    <XStack margin={2} gap="$4" alignItems="flex-start" height={150} flex={1}>
      {parentProfile?.profilePicture ? (
        <Image
          source={{ uri: parentProfile.profilePicture }}
          width={"45%"}
          height={"100%"}
          borderRadius="$3"
        />
      ) : (
        <View
          style={{
            width: "45%",
            height: "100%",
            backgroundColor: "#E0E0E0",
            borderRadius: 8,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#666", fontSize: 12, textAlign: "center" }}>
            Profile Picture
          </Text>
        </View>
      )}

      <YStack gap="$3">
        <XStack alignItems="center" gap="$2">
          <Text color="black" fontSize="$4" fontWeight="bold" textWrap="wrap">
            {parentProfile?.fullName || "Full Name"}
          </Text>
        </XStack>
        <XStack alignItems="center" gap="$2">
          <Text color="black" fontSize="$3" textWrap="wrap">
            {parentProfile ? `@${parentProfile?.userName}` : "@UserName"}
          </Text>
        </XStack>

        <XStack alignItems="center" gap="$2">
          <Ionicons name="location-outline" size={19} color="#666" />
          <Text color="black" fontSize="$3">
            {parentProfile?.countryOfResidence || "Set Locetion"}
          </Text>
        </XStack>

        {/* <XStack alignItems="center" gap="$2">
          <Text
            color={parentProfile?.isAvailable ? "green" : "red"}
            fontSize="$3"
            onPress={handleStatusPress}
          >
            {parentProfile?.isAvailable ? "Available" : "Unavailable"}
          </Text>
        </XStack> */}
      </YStack>
    </XStack>
  );
};

export default ParentProfileDataView;

const styles = StyleSheet.create({
  statusButton: {
    borderRadius: 30,
    height: "24%",
    flexGrow: 0.5,
    justifyContent: "center",
    alignItems: "center",
  },
});
