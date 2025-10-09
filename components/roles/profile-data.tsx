import { useAuth } from "@/hooks/useAuth";
import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Image, Text, XStack, YStack } from "tamagui";

const ProfileData = () => {
  const { user } = useAuth();

  const [available, setAvailable] = useState<boolean>(true);
  const handleStatusPress = () => {
    setAvailable(!available);
    console.log("Status pressed:", available);
  };

  return (
    <XStack margin={2} gap="$4" alignItems="flex-start" height={150} flex={1}>
      <Image
        source={
          user?.profilePictureUrl
            ? { uri: user.profilePictureUrl }
            : require("@/assets/images/avatar.jpg")
        }
        width={"45%"}
        height={"100%"}
        borderRadius="$3"
      />

      <YStack gap="$3">
        <XStack alignItems="center" gap="$2">
          <Text color="black" fontSize="$4" fontWeight={"bold"} textWrap="wrap">
            {user?.username || user?.name || "User Name"}
          </Text>
          {user?.isVerified && (
            <MaterialIcons name="verified" size={19} color="#0E0E55" />
          )}
        </XStack>

        <XStack alignItems="center" gap="$2">
          <Ionicons name="location-outline" size={19} color="#666" />
          <Text color="black" fontSize="$3">
            {user?.location || "Location not set"}
          </Text>
        </XStack>

        <XStack alignItems="center" gap="$2">
          <Feather name="calendar" size={19} color="#666" />
          <Text color="black" fontSize="$3">
            {user?.dob || "DOB not set"}
          </Text>
        </XStack>

        <TouchableOpacity
          onPress={handleStatusPress}
          style={[styles.statusButton,{backgroundColor: available? "#80cdb1ff":"#b4b4b3ff"}]}
        >
          <Text color="black" fontSize="$3" fontWeight={'bold'} margin={"auto"} >
            {available? "Available" : "Not Available"}
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
    height:"24%"
  },
});
