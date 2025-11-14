import React from "react";
import { YStack, XStack, Text, Image } from "tamagui";

export type ResourceCardProps = {
  title: string;
  author: string;
  category: string;
  image: any; // Image asset
  onPress: () => void;
};

export const ResourceCard: React.FC<ResourceCardProps> = ({
  title,
  author,
  category,
  image,
  onPress,
}) => {
  return (
    <YStack
      width={353}
      alignSelf="center"
      gap={12}
      onPress={onPress}
    >
      <Image
        source={image}
        width={353}
        height={190}
        borderRadius={8}
        resizeMode="cover"
      />

      <YStack gap={8}>
        <Text
          fontFamily="Body/Small Bold"
          fontWeight="700"
          fontSize={16}
          color="#212121"
        >
          {title}
        </Text>

        <XStack alignItems="center" justifyContent="space-between">
          <XStack gap={8} alignItems="center">
            <Image
              source={require("../../assets/images/Bookmark1.png")}
              width={16}
              height={20.64}
              resizeMode="contain"
            />
            <Image
              source={require("../../assets/images/download-icon.png")}
              width={16}
              height={20.64}
              resizeMode="contain"
            />
          </XStack>
        </XStack>

        <XStack alignItems="center" justifyContent="space-between">
          <Text
            fontFamily="Body/Small Base"
            fontSize={14}
            color="#737373"
          >
            {author}
          </Text>
          <YStack
            backgroundColor={
              category === "Mental wellness" || category === "Health tips"
                ? "#E4FCFBE5"
                : category === "Legal"
                  ? "#E6F0FF"
                  : category === "Guidelines"
                    ? "#FFF2E6"
                    : "#F0F0F0"
            }
            paddingHorizontal={8}
            paddingVertical={4}
            borderRadius={4}
            alignItems="center"
          >
            <Text
              fontFamily="Body/Small Base"
              fontSize={12}
              color="#212121"
              textAlign="center"
            >
              {category}
            </Text>
          </YStack>
        </XStack>
      </YStack>
    </YStack>
  );
};

export default ResourceCard;
