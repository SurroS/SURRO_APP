import { useAgentProfile } from "@/hooks/profile/useAgentProfile";
import { Feather, Ionicons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Image, Text, XStack, YStack } from "tamagui";

const AgentProfileDataView = () => {
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
      {agentProfile?.profilePicture ? (
        <Image
          source={{ uri: agentProfile.profilePicture }}
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
          <Text color="black" fontSize="$4" fontWeight={"bold"} textWrap="wrap">
            {agentProfile ? `${agentProfile.fullName || agentProfile.user?.email || "User Name"}` : "User Name"}
          </Text>
          {/* Add verification status if available */}
        </XStack>

        <XStack alignItems="center" gap="$2">
          <Ionicons name="location-outline" size={19} color="#666" />
          <Text color="black" fontSize="$3">
            {agentProfile?.country || "Location not set"}
          </Text>
        </XStack>

        {agentProfile?.dateOfBirth && (
          <XStack alignItems="center" gap="$2">
            <Feather name="calendar" size={19} color="#666" />
            <Text color="black" fontSize="$3">
              {(() => { const d = new Date(agentProfile.dateOfBirth); return `${String(d.getDate()).padStart(2,"0")}/${String(d.getMonth()+1).padStart(2,"0")}/${d.getFullYear()}`; })()}
            </Text>
          </XStack>
        )}

        <TouchableOpacity
          onPress={handleStatusPress}
          style={[
            styles.statusButton,
            {
              backgroundColor: agentProfile?.isAvailable
                ? "#80cdb1ff"
                : "#b4b4b3ff",
            },
          ]}
        >
          <Text color="black" fontSize="$2" fontWeight={"bold"}>
            {agentProfile?.isAvailable ? "Available" : "Not Available"}
          </Text>
        </TouchableOpacity>
      </YStack>
    </XStack>
  );
};

export default AgentProfileDataView;

const styles = StyleSheet.create({
  statusButton: {
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 12,
    alignSelf: "flex-start",
  },
});
