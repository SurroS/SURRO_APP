import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Text, XStack } from "tamagui";
import { router } from "expo-router";
import colors from "@/hooks/colors";

const AdBanner = () => {
  const handlePress = () => {
    router.push("/adsWatchScreen");
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.85}
      style={styles.banner}
    >
      <XStack
        flex={1}
        alignItems="center"
        justifyContent="space-between"
        paddingHorizontal={16}
      >
        <XStack alignItems="center" gap={8}>
          <Text fontSize={18}>📺</Text>
          <Text fontSize={14} fontWeight="600" color="#fff">
            Earn ₦ by watching ads
          </Text>
        </XStack>
        <XStack
          backgroundColor="rgba(255,255,255,0.25)"
          paddingVertical={4}
          paddingHorizontal={12}
          borderRadius={12}
        >
          <Text fontSize={13} fontWeight="600" color="#fff">
            Watch Now →
          </Text>
        </XStack>
      </XStack>
    </TouchableOpacity>
  );
};

export default AdBanner;

const styles = StyleSheet.create({
  banner: {
    height: 52,
    backgroundColor: colors.primary,
    borderRadius: 10,
    marginBottom: 12,
    overflow: "hidden",
  },
});
