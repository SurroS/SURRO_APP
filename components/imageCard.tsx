
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
const CARD_SPACING = SCREEN_WIDTH * 0.04; // 4% of screen width
const TEXT_CONTAINER_WIDTH = SCREEN_WIDTH * 0.9;
const BUTTON_WIDTH = SCREEN_WIDTH * 0.9;
const BUTTON_HEIGHT = SCREEN_HEIGHT * 0.07;

const img1 = require("../../assets/images/image1.png")
const img2 = require("../../assets/images/image2.png") 
const img3 = require("../../assets/images/image2.png") 
const img4 = require("../../assets/images/image2.png") 


export const ImageCard = ({
  image1,
  image2,
  width = CARD_WIDTH_DEFAULT,
  height = CARD_HEIGHT_DEFAULT,
  marginRight = CARD_SPACING,
}: {
  image1: any;
  image2:any;
  width?: number;
  height?: number;
  marginRight?: number;
}) => (

 <YStack     
    justifyContent="center"
      alignItems="center"
      width={width}>
 
              <XStack
         width={'90%'}
          height={"70%"}
          alignItems="center"  
          paddingRight={50} 
        >
          <Image
            width={"60%"}
            height={"85%"}
            borderRadius={10}
            rotate="-10 deg"
            source={image1}
          />
          <Image
            width={"60%"}
            height={"85%"}
            borderRadius={10}
            marginRight={"$20"}
            rotate="10 deg"
            source={image2}
          />
        </XStack>

    
    <YStack
      width={TEXT_CONTAINER_WIDTH}
      alignSelf="center"
      marginTop="$4" // <-- you can change this value
      gap="$4" // spacing between title & description
      justifyContent="center"
      alignItems="center"
    >
      <Text
        fontSize={SCREEN_WIDTH * 0.05} // title size
        fontWeight="bold"
        textAlign="center"
        color="$primary"
      >
        Helpful resources and guidance anytime
      </Text>
      <Text
        fontSize={SCREEN_WIDTH * 0.035} // description size
        fontWeight="500"
        textAlign="center"
        lineHeight={SCREEN_HEIGHT * 0.02} // spacing between lines
        color="#737373"
      >
        Whether you're just starting out or already on your journey, we provide
        you with educational resources you'll always have access to whenever you
        need it.
      </Text>
    </YStack>

 </YStack>
);