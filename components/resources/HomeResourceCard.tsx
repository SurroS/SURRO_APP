import React, { useMemo } from "react";
import { ImageBackground, Pressable, StyleSheet } from "react-native";
import { YStack, XStack, Text } from "tamagui";
import Entypo from "@expo/vector-icons/Entypo";
import { router } from "expo-router";

const THUMBNAILS = [
  "https://images.unsplash.com/photo-1523413651479-597eb2da0ad6",
  "https://images.unsplash.com/photo-1556742400-b5b7c5121f9a",
  "https://images.unsplash.com/photo-1516534775068-ba3e7458af70",
  "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b",
  "https://images.unsplash.com/photo-1478115041085-5d5de3f1b4d4",
];

export default function HomeResourceCard() {
  const thumbnail = useMemo(
    () => THUMBNAILS[Math.floor(Math.random() * THUMBNAILS.length)],
    [],
  );

  return (
    <Pressable onPress={() => router.push("/resources")} style={{ flex: 1 }}>
      <ImageBackground
        source={{ uri: thumbnail }}
        resizeMode="cover"
        style={styles.card}
      >
        <YStack
          flex={1}
          backgroundColor="rgba(0,0,0,0.45)"
          alignItems="center"
          justifyContent="center"
          gap="$2"
        >
          <XStack alignItems="center" gap="$2">
            <Entypo name="folder" size={18} color="#fff" />
            <Text fontSize="$4" fontWeight="600" color="#fff">
              Resources
            </Text>
          </XStack>
          <Text
            fontSize="$3"
            color="#fff"
            opacity={0.7}
            letterSpacing={0.5}
            textTransform="uppercase"
          >
            Library
          </Text>
        </YStack>
      </ImageBackground>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 160,
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
  },
});
