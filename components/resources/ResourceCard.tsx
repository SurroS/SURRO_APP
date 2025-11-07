import React from "react";
import { YStack, XStack, Text, Image, Button } from "tamagui";
import Badge from "../../components/Badge";

export type ResourceCardProps = {
  title: string;
  description: string;
  type: "Guide" | "Video" | "Template" | "FAQ";
  thumbnail?: string;
  onPress: () => void;
};

export const ResourceCard: React.FC<ResourceCardProps> = ({
  title,
  description,
  type,
  thumbnail,
  onPress,
}) => {
  return (
    <YStack
      backgroundColor="$background"
      borderRadius="$4"
      padding="$4"
      gap="$3"
      elevation={2}
    >
      <XStack alignItems="center" gap="$4">
        {thumbnail && (
          <Image
            source={{ uri: thumbnail }}
            width={60}
            height={60}
            borderRadius={8}
          />
        )}

        <YStack flex={1} gap="$1">
          <Text fontWeight="$bold" fontSize={20} color="$text">
            {title}
          </Text>
          <Text fontSize={14} color="$text">
            {description}
          </Text>
        </YStack>

        <Badge label={type} variant={type} />
      </XStack>

      <Button
        onPress={onPress}
        backgroundColor="$primary"
        borderRadius="$3"
        alignSelf="flex-end"
      >
        <Text color="$background" fontWeight="$semibold" fontSize={14}>
          View
        </Text>
      </Button>
    </YStack>
  );
};

export default ResourceCard;
