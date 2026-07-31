import React from "react";
import { XStack, YStack } from "tamagui";
import { Image as RNImage, ImageSourcePropType } from "react-native";

import placeholderImg from "@/assets/images/noImage.png";

interface GalleryImage {
  id: string;
  url: string;
}

interface GallerySectionProps {
  images?: GalleryImage[];
}

const GallerySection: React.FC<GallerySectionProps> = ({ images }) => {
  if (!images || images.length === 0) return null;

  const galleryImages = images.slice(0, 4); // max 4 images

  return (
    <XStack gap="$3" flexWrap="wrap" justifyContent="space-between">
      {galleryImages.map((item) => {
        const source: ImageSourcePropType =
          item.url && item.url.startsWith("http")
            ? { uri: item.url }
            : placeholderImg;

        return (
          <XStack
            key={item.id}
            height={300}
            borderRadius={12}
            overflow="hidden"
            marginBottom="$3"
          >
            <RNImage
              source={source}
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 12,
                alignSelf: "center",
              }}
              resizeMode="cover"
            />
          </XStack>
        );
      })}
    </XStack>
  );
};

export default GallerySection;
