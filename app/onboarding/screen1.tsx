// app/onboarding/screen2.tsx

import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { Dimensions, FlatList, ViewToken } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Image, Text, XStack, YStack } from "tamagui";


// Screen dimensions
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Adjustable constants
const CARD_WIDTH_DEFAULT = SCREEN_WIDTH * 0.85; // 85% of screen width
const CARD_HEIGHT_DEFAULT = SCREEN_HEIGHT * 0.45; // 45% of screen height
const CARD_SPACING = SCREEN_WIDTH * 0.06; // spacing between cards
const TEXT_CONTAINER_WIDTH = SCREEN_WIDTH * 0.9;
const BUTTON_WIDTH = SCREEN_WIDTH * 0.9;
const BUTTON_HEIGHT = SCREEN_HEIGHT * 0.07;
const IMG_HEIGHT = SCREEN_HEIGHT * 0.3;

const img1 = require("../../assets/images/couple-image.png");
const img2 = require("../../assets/images/image2.png");
const img3 = require("../../assets/images/library.png");
const img4 = require("../../assets/images/cancel.png");

// Slide data
const SLIDES = [
  {
    key: "1",
    img1: img1,
    img2: img2,
    header: "Full control over who you connect with",
    message: `  Review profiles, set preferences, and decide who you feel comfortable connecting with. Every match is built on choice, 
    trust, and mutual agreement.`,
  },
  {
    key: "2",
    img1: img3,
    img2: img4,
    header: "Helpful resources and guidance anytime",
    message: `     Whether you're just starting out or already on your journey, we 
    provide you with educational resources you'll always have access to whenever you need it.`,
  },
];

// Reusable ImageCard
const ImageCard = ({
  img1,
  img2,
  header,
  message,
  width = CARD_WIDTH_DEFAULT,
  height = CARD_HEIGHT_DEFAULT,
  marginRight = CARD_SPACING,
}: {
  img1: any;
  img2: any;
  header: string;
  message: string;
  width?: number;
  height?: number;
  marginRight?: number;
}) => (
  <YStack justifyContent="center" alignItems="center" width={width}>
    <XStack width={"90%"} height={"80%"} alignItems="center" paddingRight={50}>
      <Image
        width={"60%"}
        height={IMG_HEIGHT}
        borderRadius={10}
        rotate="-10 deg"
        source={img1}
      />
      <Image
        width={"60%"}
        height={IMG_HEIGHT}
        borderRadius={10}
        marginRight={"$20"}
        rotate="10 deg"
        source={img2}
      />
    </XStack>

    <YStack
      width={TEXT_CONTAINER_WIDTH -5}
      alignSelf="center"
      marginRight="$4"
      gap="$4"
      justifyContent="center"
      alignItems="center"
      paddingHorizontal={10}
    >
      <Text
        fontSize={SCREEN_WIDTH * 0.05}
        fontWeight="bold"
        textAlign="center"
        color="$primary"
      >
        {header}
      </Text>
      <Text
        fontSize={SCREEN_WIDTH * 0.035}
        fontWeight="500"
        textAlign="center"
        lineHeight={SCREEN_HEIGHT * 0.02}
        color="#737373"
      >
        {message}
      </Text>
    </YStack>
  </YStack>
);

export default function Screen2() {
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
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#ffffffff",
        justifyContent: "center",
        alignItems: "center",
      }}
    > 
      <YStack flex={1} backgroundColor="$background" paddingHorizontal="$4">
        {/* Header */}
        <YStack alignItems="center" paddingTop="$4">
          <Image
            source={require("../../assets/images/adaptive-icon2.png")}
            width={SCREEN_WIDTH * 0.19}
            height={SCREEN_WIDTH * 0.19}
          />
          <Text fontSize={22} fontWeight="800" color="$primary">
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
            marginTop: 10,
            paddingBottom: 15,
          }}
          renderItem={({ item }) => (
            <ImageCard
              img1={item.img1}
              img2={item.img2}
              header={item.header}
              message={item.message}
              width={CARD_WIDTH_DEFAULT}
              height={CARD_HEIGHT_DEFAULT}
            />
          )}
        />

        {/* Indicator Dots */}
        <XStack justifyContent="center" alignItems="center" gap="$2" marginTop="$3">
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
          borderRadius={12}
          backgroundColor="$primary"
          alignSelf="center"
          marginVertical="$6"
          onPress={() => router.push("/onboarding/role-selection")}
        >
          <Text color='#ffffff' fontWeight="600" fontSize={20} textAlign="center">
            Get started
          </Text>
        </Button>
      </YStack>
    </SafeAreaView>
  );
}