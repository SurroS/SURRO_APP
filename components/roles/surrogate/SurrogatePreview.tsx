import { ChevronRight, Users } from "@tamagui/lucide-icons";
import { router } from "expo-router";
import { Image as RNImage, StyleSheet } from "react-native";
import { Button, Card, Text, XStack, YStack } from "tamagui";
import { useEffect } from "react";
import { Toast } from "toastify-react-native";
import { ToastType } from "toastify-react-native/utils/interfaces";
import { useSurrogateStore } from "@/store/surrogates"; // custom hook

const SurrogatePreview = ({ style }: { style?: any }) => {
  const { surrogates, isLoading, fetchSurrogates } = useSurrogateStore();

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

  const handleNavigate = () => {
    router.push({
      pathname: "/(tabs)/home/surrogateList",
      params: {
        surrogates: JSON.stringify(validSurrogates),
      },
    });
  };

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
          Suggested Surrogates
        </Text>
      </XStack>

      {/* Avatars Stack */}
      <YStack alignItems="center" justifyContent="center" flex={1} width="100%">
        {displayAvatars.map((img, index) => (
          <RNImage
            key={index}
            source={typeof img === "string" ? { uri: img } : img}
            style={{
              width:"90%",
              height: "100%",
              position: "absolute",
              left: index * 35,
              zIndex: displayAvatars.length - index,
              borderWidth: 2,
              borderColor: "white",
              shadowColor: "#000",
              shadowOpacity: 0.15,
              shadowOffset: { width: 0, height: 2 },
              shadowRadius: 3,
              backgroundColor: "#f5f5f5",
              rotation:10
              
            }}
            resizeMode="cover"
          />
        ))}

        {/* Button overlay */}

      </YStack>
    </Card>
  );
};

export default SurrogatePreview;

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
