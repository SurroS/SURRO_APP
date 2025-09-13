// app/onboarding/screen1.tsx

import React, { useState, useRef } from "react";
import { Dimensions, FlatList, ViewToken } from "react-native";
import { YStack, XStack, Text, Image, Button } from "tamagui";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

// Screen dimensions
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Adjustable constants
const CARD_WIDTH_DEFAULT = SCREEN_WIDTH * 0.85;    // 85% of screen width
const CARD_HEIGHT_DEFAULT = SCREEN_HEIGHT * 0.45;  // 45% of screen height
const CARD_SPACING = SCREEN_WIDTH * 0.04;          // 4% of screen width
const TEXT_CONTAINER_WIDTH = SCREEN_WIDTH * 0.9;
const BUTTON_WIDTH = SCREEN_WIDTH * 0.9;
const BUTTON_HEIGHT = SCREEN_HEIGHT * 0.07;

// Slide data
const SLIDES = [
  { key: "1", img: require("../../assets/images/image1.png") },
  { key: "2", img: require("../../assets/images/image2.png") },
];

// Reusable ImageCard
const ImageCard = ({
  image,
  width = CARD_WIDTH_DEFAULT,
  height = CARD_HEIGHT_DEFAULT,
  marginRight = CARD_SPACING,
}: {
  image: any;
  width?: number;
  height?: number;
  marginRight?: number;
}) => (
  <YStack
    width={width}
    height={height}
    borderRadius={12}
    justifyContent="center"
    alignItems="center"
    marginRight={marginRight}
    overflow="hidden"
  >
    <Image
      source={image}
      width={width * 0.95} // scales with container
      height={height * 0.95} // scales with container
      resizeMode="contain"
    />
  </YStack>
);

export default function Screen1() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        setActiveIndex(viewableItems[0].index ?? 0);
      }
    }
  ).current;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>
      <YStack flex={1} backgroundColor="$background" paddingHorizontal="$4" paddingBottom="$4">
        
        {/* Header */}
        <YStack alignItems="center" paddingTop="$1" space="$1">
          <Image
            source={require("../../assets/images/icon.png")}
            width={SCREEN_WIDTH * 0.13}
            height={SCREEN_WIDTH * 0.13}
            resizeMode="contain"
          />
          <Text fontSize={20} fontWeight="800" color="$primary">
            SURRO
          </Text>
        </YStack>

        {/* Image Carousel */}
        <FlatList
          data={SLIDES}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.key}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
          contentContainerStyle={{
            paddingHorizontal: CARD_SPACING / 2,
            marginTop: 10, // moves carousel closer to app name
            paddingBottom: 5,
          }}
          renderItem={({ item, index }) => (
            <ImageCard
              image={item.img}
              width={CARD_WIDTH_DEFAULT}
              height={CARD_HEIGHT_DEFAULT}
              marginRight={index === SLIDES.length - 1 ? 0 : CARD_SPACING}
            />
          )}
        />

        <YStack
  width={TEXT_CONTAINER_WIDTH}
  alignSelf="center"
  marginTop="$4" // <-- you can change this value
  space="$4"     // spacing between title & description
  justifyContent="center"
  alignItems="center"
>
  <Text
    fontSize={SCREEN_WIDTH * 0.05}  // title size
    fontWeight="bold"
    textAlign="center"
    color="$primary"
  >
    Full control over who you connect with
  </Text>
  <Text
    fontSize={SCREEN_WIDTH * 0.035} // description size
    fontWeight="500"
    textAlign="center"
    lineHeight={SCREEN_HEIGHT * 0.02} // spacing between lines
    color="#737373"
  >
    Review profiles, set preferences, and decide who you feel comfortable connecting with. Every match is built on choice, trust, and mutual agreement.
  </Text>
</YStack>

        {/* Indicator Dots */}
                  <XStack justifyContent="center" alignItems="center" space="$2" marginTop="$3">
                    {SLIDES.map((_, index) => (
                      <YStack
                        key={index}
                        width={index === activeIndex ? 20 : 8}
                        height={8}
                        borderRadius={12}
                        backgroundColor={index === activeIndex ? "$primary" : "$secondary"}
                      />
                    ))}
                  </XStack>

        {/* Get Started Button */}
        <Button
          width={BUTTON_WIDTH}
          height={BUTTON_HEIGHT}
          borderRadius={8}
          backgroundColor="$primary"
          alignSelf="center"
          marginTop="$6"
          onPress={() => router.push("/onboarding/screen2")}
        >
          <Text color="$color" fontWeight="600" fontSize={20} textAlign="center">
            Get started
          </Text>
        </Button>
      </YStack>
    </SafeAreaView>
  );
}
