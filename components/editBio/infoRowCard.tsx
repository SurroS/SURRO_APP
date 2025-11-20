import colors from "@/hooks/colors";
import { ChevronRight } from "@tamagui/lucide-icons";
import React from "react";
import { XStack, YStack, Text, Image, Stack } from "tamagui";
import { Image as RNImage } from 'react-native';

const CONTAINER_W = 347;
const CONTAINER_H = 74;
const ICON_SIZE = 40;
const BORDER_WIDTH = 1;

type Props = {
  title: string;
  subtitle?: string;
  icon?: any;
  onPress?: () => void;
};

export default function InfoRowCard({ title, subtitle, icon, onPress }: Props) {
  // Function to render the icon based on its type
  const renderIcon = () => {
    if (!icon) {
      return null; // Return null if no icon is provided
    }

    // Check if icon is a React component
    if (typeof icon === 'function' || (React.isValidElement(icon))) {
      return React.cloneElement(icon as React.ReactElement, { width: 16, height: 16 });
    }

    // If icon is an image source (string/number), render it as an image
    if (typeof icon === 'string' || typeof icon === 'number') {
      return <RNImage source={icon} style={{ width: 16, height: 16 }} />;
    }

    // If it's an imported image object with uri (like from constants/Images)
    if (icon && typeof icon === 'object' && (icon as any).uri) {
      return <RNImage source={icon} style={{ width: 16, height: 16 }} />;
    }

    // For cases where it's already a component but not a function
    return <Stack>{icon}</Stack>;
  };

  return (
    <Stack onPress={onPress} pressStyle={{ opacity: 0.8 }}>
      <XStack
        width={CONTAINER_W}
        height={CONTAINER_H}
        alignItems="center"
        justifyContent="flex-start"
        borderWidth={BORDER_WIDTH}
        borderColor="#E5E7EB"
        paddingVertical={14}
        paddingHorizontal={16}
        borderRadius={8}
        gap="$3"
      >
        {/* Left icon */}
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

        {/* Title + Subtitle */}
        <YStack flex={1} justifyContent="center" gap="$1">
          <Text fontSize={16} fontWeight="600" color="$text">
            {title}
          </Text>
          {subtitle ? (
            <Text fontSize={13} color="#4B5563">
              {subtitle}
            </Text>
          ) : null}
        </YStack>

        {/* Right chevron properly aligned */}
        <YStack
          width={24}
          height={24}
          alignItems="center"
          justifyContent="center"
        >
          <ChevronRight size={16} color={colors.black}/>
        </YStack>
      </XStack>
    </Stack>
  );
}
