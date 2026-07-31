import colors from "@/hooks/colors";
import { ChevronRight } from "@tamagui/lucide-icons";
import React from "react";
import { XStack, YStack, Text } from "tamagui";
import { Image as RNImage, Pressable } from "react-native";

 
const CONTAINER_H = 64;
const ICON_SIZE = 36;

type Props = {
  title: string;
  subtitle?: string;
  icon?: any; // Can be a lucide icon, image, or uri
  onPress?: () => void;
};

export default function InfoRowCard({ title, subtitle, icon, onPress }: Props) {
  const renderIcon = () => {
    if (!icon) return null;

    // Lucide / forwardRef Component
    if (
      typeof icon === "function" ||
      (typeof icon === "object" && icon?.render)
    ) {
      const IconComponent = icon;
      return <IconComponent size={14} color="white" />;
    }

    // Already a React element
    if (React.isValidElement(icon)) return icon;

    // Image
    return <RNImage source={icon} style={{ width: 20, height: 20 }} />;
  };

  return (
    <Pressable onPress={onPress}>
      <XStack
        width="100%"
        height={CONTAINER_H}
        alignItems="center"
        borderWidth={1}
        borderColor="#E5E7EB"
        paddingVertical={12}
        paddingHorizontal={12}
        borderRadius={8}
        gap="$3"
      >
        {/* Icon container */}
        <YStack
          width={ICON_SIZE}
          height={ICON_SIZE}
          borderRadius={100}
          alignItems="center"
          justifyContent="center"
          backgroundColor="#0E0E55"
        >
          {renderIcon()}
        </YStack>

        {/* Main text */}
        <YStack flex={1} gap="$1">
          <Text fontSize={16} fontWeight="600" color="$text">
            {title}
          </Text>
          {subtitle && (
            <Text fontSize={13} color="#4B5563">
              {subtitle}
            </Text>
          )}
        </YStack>

        {/* Chevron */}
        <ChevronRight size={12} color={colors.black} />
      </XStack>
    </Pressable>
  );
}
