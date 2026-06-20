import { Feather, Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";
import { Text, XStack, YStack } from "tamagui";

type ProfileHeaderProps = {
  name?: string | null;
  avatarUrl?: string | null;
  location?: string | null;
  dateOfBirth?: string | null;
  isAvailable?: boolean | null;
  onToggleAvailability?: (next: boolean) => Promise<void>;
};

const ProfileHeader = ({
  name,
  avatarUrl,
  location,
  dateOfBirth,
  isAvailable,
  onToggleAvailability,
}: ProfileHeaderProps) => {
  const [imgFailed, setImgFailed] = useState(false);
  const handleStatusPress = async () => {
    if (!onToggleAvailability || isAvailable == null) return;
    await onToggleAvailability(!isAvailable);
  };

  const noImage = !avatarUrl;
  const showFallback = noImage || imgFailed;

  return (
    <XStack margin={2} gap="$4" alignItems="flex-start" height={150} flex={1}>
      {showFallback ? (
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
          {noImage && (
            <Text style={{ color: "#666", fontSize: 12, textAlign: "center" }}>
              Profile Picture
            </Text>
          )}
        </View>
      ) : (
        <Image
          source={avatarUrl!}
          style={{ width: "45%", height: "100%", borderRadius: 8 }}
          contentFit="cover"
          cachePolicy="memory-disk"
          onError={() => setImgFailed(true)}
        />
      )}

      <YStack gap="$3">
        <Text color="black" fontSize="$4" fontWeight="bold">
          {name || "User Name"}
        </Text>

        <XStack alignItems="center" gap="$2">
          <Ionicons name="location-outline" size={18} color="#666" />
          <Text color="black">
            {location || "Location not set"}
          </Text>
        </XStack>

        <XStack alignItems="center" gap="$2">
          <Feather name="calendar" size={18} color="#666" />
          <Text color="black">
            {dateOfBirth || "DOB not set"}
          </Text>
        </XStack>

        {onToggleAvailability && (
          <TouchableOpacity
            onPress={handleStatusPress}
            style={[
              styles.statusButton,
              {
                backgroundColor: isAvailable
                  ? "#80cdb1ff"
                  : "#b4b4b3ff",
              },
            ]}
          >
            <Text fontWeight="bold">
              {isAvailable ? "Available" : "Not Available"}
            </Text>
          </TouchableOpacity>
        )}
      </YStack>
    </XStack>
  );
};

export default ProfileHeader;

const styles = StyleSheet.create({
  statusButton: {
    borderRadius: 30,
    height: 32,
    paddingHorizontal: 14,
    justifyContent: "center",
    alignItems: "center",
  },
});
