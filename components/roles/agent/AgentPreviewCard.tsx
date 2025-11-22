import { Image as RNImage, StyleSheet } from "react-native";
import { Card, Text, XStack, YStack } from "tamagui"; 
import { useEffect } from "react";
import { Toast } from "toastify-react-native";
import { ToastType } from "toastify-react-native/utils/interfaces";
import { useAgentListStore } from "@/store/agents";

const AgentPreview = ({ style }: { style?: any }) => {
  const { agents, isLoading, fetchAgents } = useAgentListStore();

  useEffect(() => {
    console.log("Agents =", agents)
    fetchAgents(true).catch((err: any) => {
      Toast.show({
        text1: "Failed to load agents",
        type: "customError" as ToastType,
        text2: err?.response?.data?.message || "Please try again.",
      });
    });
  }, [fetchAgents]);

  const validAgents =
    Array.isArray(agents) && agents.length > 0
      ? agents.filter((a) => a && a.avatar)
      : [];

  const displayAvatars =
    validAgents.length > 0
      ? validAgents.slice(0, 3).map((a) => a.avatar)
      : [require("@/assets/images/emptyGallery.png")];

  return (
    <Card
      bordered
      borderColor="#E5E5E5"
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

      {/* Avatars Stack */}
      <YStack alignItems="center" justifyContent="center" flex={1} width="100%">
        {displayAvatars.map((img, index) => (
          <RNImage
            key={index}
            source={typeof img === "string" ? { uri: img } : img}
            style={{
              width: "85%",
              height: "100%",
              position: "absolute",
              left: index * 8,
              zIndex: displayAvatars.length - index,
              shadowColor: "#000",
              shadowOpacity: 0.5,
              shadowOffset: { width: 0, height: 2 },
              shadowRadius: 3,
              backgroundColor: "#f5f5f5",
              borderRadius: 5,
              transform: [{ rotate: "-8deg" }],
            }}
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
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
});
