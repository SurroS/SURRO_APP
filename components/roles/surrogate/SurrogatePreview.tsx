import { Image as RNImage, StyleSheet } from "react-native";
import { Card, Text, XStack, YStack } from "tamagui";
import { useEffect } from "react";
import { Toast } from "toastify-react-native";
import { ToastType } from "toastify-react-native/utils/interfaces";
import { useSurrogateStore } from "@/store/surrogates";
import colors from "@/hooks/colors";

const SurrogatePreview = ({ style }: { style?: any }) => {
  const { surrogates, isLoading, fetchSurrogates, savedIds } = useSurrogateStore();

  useEffect(() => {
    fetchSurrogates(true).catch((err: any) => {
      Toast.show({
        text1: "Failed to load surrogates",
        type: "customError" as ToastType,
        text2: err?.response?.data?.message || "Please try again.",
      });
    });
  }, [fetchSurrogates]);

  const validSurrogates =
    Array.isArray(surrogates) && surrogates.length > 0
      ? surrogates.filter((s) => s && s.avatar)
      : [];

  const displayAvatars =
    validSurrogates.length > 0
      ? validSurrogates.slice(0, 3).map((s) => s.avatar)
      : [require("@/assets/images/emptyGallery.png")];

  return (
    <Card
      bordered
      backgroundColor={colors.white}
      borderColor="#E5E5E5"
      padding="$3"
      borderRadius="$4"
      style={[style, styles.card]}
    >
      {/* Header */}
      <XStack alignItems="center" gap="$2" marginBottom="$3">
        <Text fontSize="$3.5" fontWeight="600" color="#0E0E55">
          Suggested Surrogates
        </Text>
      </XStack>

      {/* Avatar Stack */}
      <YStack
        alignItems="center"
        justifyContent="center"
        width="100%"
        height={110}
        overflow="visible"
      >
        {displayAvatars.map((img, index) => (
          <RNImage
            key={index}
            source={typeof img === "string" ? { uri: img } : img}
            style={[
              styles.avatar,
              {
                left: index * 15,
                zIndex: displayAvatars.length - index,
                transform: [
                  { rotate: index === 0 ? "-6deg" : index === 1 ? "4deg" : "-3deg" },
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

export default SurrogatePreview;

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
    width: 85,
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
