import { Image as RNImage, StyleSheet } from "react-native";
import { Card, Text, XStack, YStack } from "tamagui";
import { useEffect } from "react";
import { Toast } from "toastify-react-native";
import { ToastType } from "toastify-react-native/utils/interfaces";
import { useAgentListStore } from "@/store/agents";
import colors from "@/hooks/colors";

const AgentPreview = ({ style }: { style?: any }) => {
  const { agents, isLoading, fetchAgents } = useAgentListStore();

  useEffect(() => {
    fetchAgents(true).catch((err: any) => {
      Toast.show({
        text1: "Failed to load agents",
        type: "customError" as ToastType,
        text2: err?.response?.data?.message || "Please try again.",
      });
    });
  }, [fetchAgents]);

  // Only accept agents with valid avatars
  const validAgents =
  Array.isArray(agents) && agents.length > 0 ? agents : [];

const displayAvatars =
  validAgents.length > 0
    ? validAgents.slice(0, 3).map((a) => a.avatar ?? require("@/assets/images/emptyGallery.png"))
    : [require("@/assets/images/emptyGallery.png")];
  return (
    <Card
      bordered
      borderColor="#E5E5E5"
      backgroundColor={colors.white}
      padding="$3"
      borderRadius="$4"
      style={[style, styles.card]}
    >
      {/* Header */}
      <XStack alignItems="center" gap="$2" marginBottom="$3">
        <Text fontSize="$3.5" fontWeight="600" color="#0E0E55">
          Suggested Agents
        </Text>
      </XStack>

      {/* Avatar Overlap Stack */}
      <YStack
        alignItems="center"
        justifyContent="center"
        width="100%"
        height={110} // FIX: proper container height
        overflow="visible"
      >
        {displayAvatars.map((img, index) => (
          <RNImage
            key={index}
            source={typeof img === "string" ? { uri: img } : img}
            style={[
              styles.avatar,
              {
                left: index * 15, // spread slightly
                zIndex: displayAvatars.length - index,
                transform: [
                  {
                    rotate:
                      index === 0 ? "-6deg" : index === 1 ? "3deg" : "-3deg",
                  },
                ],
              },
            ]}
            resizeMode="cover"
          />
        ))}
      </YStack>
    </Card>
  );
};

export default AgentPreview;

const styles = StyleSheet.create({
  card: {
    overflow: "visible",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },

  avatar: {
    width: 85, // FIX: Remove "85%" height stretch
    height: 110,
    position: "absolute",
    borderRadius: 10,
    backgroundColor: "#f5f5f5",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
});
