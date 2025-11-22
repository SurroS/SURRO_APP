import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity } from "react-native";
import { XStack, YStack, Text } from "tamagui";

interface ScreenHeaderProps {
  title: string;
  onBackPress: () => void;
  style?: any;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  onBackPress,
  style,
}) => (
  <XStack
    width="100%"
    alignItems="center"
    justifyContent="center"
    gap={15}
    position="relative"
    height={50}
    style={style}
  >
    <TouchableOpacity
      onPress={onBackPress}
      style={{ position: "absolute", left: 0, padding: 4, }}
    >
      <Ionicons name="arrow-back" size={28} color="#000" />
    </TouchableOpacity>
    <Text fontSize={21} fontWeight="bold" color="$text">
      {title}
    </Text>
  </XStack>
);
