 import React from "react";
import { Pressable, Image as RNImage, StyleSheet } from "react-native";
import { Card, Text, XStack, YStack } from "tamagui";
import { ChevronRight } from "@tamagui/lucide-icons";
import { router } from "expo-router";

interface RoleCardProps {
  role: string;                       // e.g. "Surrogates", "Agencies"
  subtitle?: string;                   // e.g. "Available now"
  images?: string[];                   // array of image URLs
  count?: number;                      // total count or number of profiles
  route?: string;                      // navigation path
  style?: any;                         // optional card styles
  placeholder?: any;                   // fallback image
  onPress?: () => void;                // optional custom action
  roleColor?: string;                 // optional custom role color
  accentColor?: string;                // used for icon or small details
}

const RoleCard: React.FC<RoleCardProps> = ({
  role,
  subtitle,
  images = [], 
  count,
  route,
  style,
  placeholder = require("@/assets/images/emptySurrogate.png"),
  onPress,
  roleColor = "#0E0E55",
  accentColor = "#8080FF",
}) => {
  const displayImages = images.length > 0 ? images.slice(0, 3) : [placeholder];

  const handlePress = () => {
    if (onPress) return onPress();
    if (route) router.push(route);
  };

  return (
    <Card
      bordered
      borderColor="#E5E5E5"
      padding="$3"
      borderRadius="$4"
      style={[styles.card, style]}
    >
      <Pressable onPress={handlePress}>
        <XStack alignItems="center" justifyContent="space-between" marginBottom="$2">
          <YStack>
            <Text fontSize={16} fontWeight="700" color={roleColor}>
              {role}
            </Text>
            {subtitle && (
              <Text fontSize={13} color="#6B6B6B" marginTop={2}>
                {subtitle}
              </Text>
            )}
          </YStack>

          <XStack alignItems="center" gap="$2">
            {typeof count === "number" && (
              <Text color={accentColor} fontWeight="600">
                {count}
              </Text>
            )}
            <ChevronRight size={22} color={accentColor} />
          </XStack>
        </XStack>

        {/* Overlapping images */}
        <YStack
          alignItems="center"
          justifyContent="center"
          width="100%"
          height={110}
          position="relative"
        >
          {displayImages.map((img, index) => (
            <RNImage
              key={index}
              source={typeof img === "string" ? { uri: img } : img}
              style={[
                styles.image,
                {
                  left: index * 15,
                  zIndex: displayImages.length - index,
                },
              ]}
              resizeMode="cover"
            />
          ))}
        </YStack>
      </Pressable>
    </Card>
  );
};

export default RoleCard;

const styles = StyleSheet.create({
  card: {
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
    position: "absolute",
    top: 0,
    borderWidth: 2,
    borderColor: "white",
    backgroundColor: "#f0f0f0",
  },
});
