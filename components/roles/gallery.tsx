import { ChevronRight, Images } from "@tamagui/lucide-icons";
import { router } from "expo-router";
import { Image as RNImage, StyleSheet } from "react-native";
import { Button, Card, Text, XStack, YStack } from "tamagui";
import { useGallery } from "@/hooks/useGallery";
import { useEffect } from "react";
import { Toast } from "toastify-react-native";
import { ToastType } from "toastify-react-native/utils/interfaces";

const Gallery = ({ style }: { style?: any }) => {
  const { images, isLoading, fetchImages } = useGallery();

  // Fetch images on component mount
  useEffect(() => {
    fetchImages(true).catch((err: any) => {
      Toast.show({
        text1: "Failed to load gallery",
        type: "customError" as ToastType,
        text2: err?.response?.data?.message || "Please try again.",
      });
    });
  }, [fetchImages]);

  const validImages =
    Array.isArray(images) && images.length > 0
      ? images.filter((img) => img && img.url)
      : [];

  const displayImages =
    validImages.length > 0
      ? validImages.slice(0, 3).map((img) => img.url)
      : [require("../../assets/images/emptyGallery.png")];

  const handleNavigate = () => {
    router.push({
      pathname: "/(tabs)/home/galleryAction",
      params: {
        images: JSON.stringify(validImages.map((img) => img.url)),
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
      <XStack alignItems="center" gap="$2">
        <Images color="#0E0E55" size={18} />
        <Text fontSize="$4" fontWeight="600" color="#0E0E55">
          Gallery
        </Text>
      </XStack>

      {/* Image Stack */}
      <YStack
        alignItems="center"
        justifyContent="center"
        flex={1}
        width="100%"
        height="100%"
        position="relative"
      >
        {displayImages.map((img, index) => (
          <RNImage
            key={index}
            source={typeof img === "string" ? { uri: img } : img}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 10,
              position: "absolute",
              top: 0,
              left: index * 12,
              zIndex: displayImages.length - index,
              borderWidth: 2,
              borderColor: "white",
              shadowColor: "#000",
              shadowOpacity: 0.15,
              shadowOffset: { width: 0, height: 2 },
              shadowRadius: 3,
              backgroundColor: "#f5f5f5",
            }}
            resizeMode="cover"
          />
        ))}

        {/* Button overlay */}
        <Button
          size="$2"
          position="absolute"
          bottom={-10}
          right={10}
          zIndex={10000}
          iconAfter={ChevronRight}
          variant="outlined"
          borderColor="#0E0E55"
          borderRadius="$5"
          color="#0E0E55"
          onPress={handleNavigate}
          disabled={isLoading}
        >
          <Text color="#0E0E55">{validImages.length}</Text>
        </Button>
      </YStack>
    </Card>
  );
};

export default Gallery;

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
