// // app/onboarding/screen1.tsx

// import { useRouter } from "expo-router";
// import { useRef, useState } from "react";
// import { Dimensions, ViewToken } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { Button, Image, Text, XStack, YStack } from "tamagui";

// // Screen dimensions
// const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// // Adjustable constants
// const CARD_WIDTH_DEFAULT = SCREEN_WIDTH * 0.85; // 85% of screen width
// const CARD_HEIGHT_DEFAULT = SCREEN_HEIGHT * 0.45; // 45% of screen height
// const CARD_SPACING = SCREEN_WIDTH * 0.04; // 4% of screen width
// const TEXT_CONTAINER_WIDTH = SCREEN_WIDTH * 0.9;
// const BUTTON_WIDTH = SCREEN_WIDTH * 0.9;
// const BUTTON_HEIGHT = SCREEN_HEIGHT * 0.07;

// // Slide data
// const SLIDES = [
//   { key: "1", img: require("../../assets/images/image1.png") },
//   { key: "2", img: require("../../assets/images/image2.png") },
// ];

// const ImageCard = ({
//   image,
//   width = CARD_WIDTH_DEFAULT,
//   height = CARD_HEIGHT_DEFAULT,
//   marginRight = CARD_SPACING,
// }: {
//   image: any;
//   width?: number;
//   height?: number;
//   marginRight?: number;
// }) => (
 
//  <YStack     
//     justifyContent="center"
//       alignItems="center"
//       width={width}>
 
//               <XStack
//          width={'90%'}
//           height={"70%"}
//           alignItems="center"  
//           paddingRight={50} 
//         >
//           <Image
//             width={"60%"}
//             height={"85%"}
//             borderRadius={10}
//             rotate="-10 deg"
//             source={require("../../assets/images/couple-image.png")}
//           />
//           <Image
//             width={"60%"}
//             height={"85%"}
//             borderRadius={10}
//             marginRight={"$20"}
//             rotate="10 deg"
//             source={require("../../assets/images/image2.png")}
//           />
//         </XStack>

    
//     <YStack
//       width={TEXT_CONTAINER_WIDTH}
//       alignSelf="center"
//       marginTop="$4" // <-- you can change this value
//       gap="$4" // spacing between title & description
//       justifyContent="center"
//       alignItems="center"
//     >
//       <Text
//         fontSize={SCREEN_WIDTH * 0.05} // title size
//         fontWeight="bold"
//         textAlign="center"
//         color="$primary"
//       >
//         Helpful resources and guidance anytime
//       </Text>
//       <Text
//         fontSize={SCREEN_WIDTH * 0.035} // description size
//         fontWeight="500"
//         textAlign="center"
//         lineHeight={SCREEN_HEIGHT * 0.02} // spacing between lines
//         color="#737373"
//       >
//         Whether you're just starting out or already on your journey, we provide
//         you with educational resources you'll always have access to whenever you
//         need it.
//       </Text>
//     </YStack>

//  </YStack>
// );

// export default function Screen1() {
//   const router = useRouter();
//   const [activeIndex, setActiveIndex] = useState(0);

//   const onViewableItemsChanged = useRef(
//     ({ viewableItems }: { viewableItems: ViewToken[] }) => {
//       if (viewableItems.length > 0) {
//         setActiveIndex(viewableItems[0].index ?? 0);
//       }
//     }
//   ).current;

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>
//       <YStack
//         flex={1}
//         backgroundColor="$background"
//         paddingHorizontal="$4"
//         paddingBottom="$4"
//         justifyContent="center"
//         alignItems="center"
//       >
//         {/* Header */}
//         <YStack alignItems="center" paddingTop="$1" gap="$1">
//           <Image
//             source={require("../../assets/images/icon.png")}
//             width={SCREEN_WIDTH * 0.13}
//             height={SCREEN_WIDTH * 0.13}
//           />
//           <Text fontSize={20} fontWeight="800" color="$primary">
//             SURRO
//           </Text>
//         </YStack>

//         {/* Image Carousel */}
//         <XStack
//           width={"90%"}
//           height={"50%"}
//           alignItems="center"  
//           paddingRight={50} 
//         >
//           <Image
//             width={"60%"}
//             height={"85%"}
//             borderRadius={10}
//             rotate="-10 deg"
//             source={require("../../assets/images/couple-image.png")}
//           />
//           <Image
//             width={"60%"}
//             height={"85%"}
//             borderRadius={10}
//             marginRight={"$20"}
//             rotate="10 deg"
//             source={require("../../assets/images/image2.png")}
//           />
//         </XStack>

//         <YStack
//           width={TEXT_CONTAINER_WIDTH}
//           alignSelf="center"
//           marginTop="$4" // <-- you can change this value
//           space="$4" // spacing between title & description
//           justifyContent="center"
//           alignItems="center"
//         >
//           <Text
//             fontSize={SCREEN_WIDTH * 0.05} // title size
//             fontWeight="bold"
//             textAlign="center"
//             color="$primary"
//           >
//             Full control over who you connect with
//           </Text>
//           <Text
//             fontSize={SCREEN_WIDTH * 0.035} // description size
//             fontWeight="500"
//             textAlign="center"
//             lineHeight={SCREEN_HEIGHT * 0.02} // spacing between lines
//             color="#737373"
//           >
//             Review profiles, set preferences, and decide who you feel
//             comfortable connecting with. Every match is built on choice, trust,
//             and mutual agreement.
//           </Text>
//         </YStack>

//         {/* Indicator Dots */}
//         <XStack
//           justifyContent="center"
//           alignItems="center"
//           space="$2"
//           marginTop="$3"
//         >
//           {SLIDES.map((_, index) => (
//             <YStack
//               key={index}
//               width={index === activeIndex ? 20 : 8}
//               height={8}
//               borderRadius={12}
//               backgroundColor={
//                 index === activeIndex ? "$primary" : "$secondary"
//               }
//             />
//           ))}
//         </XStack>

//         {/* Get Started Button */}
//         <Button
//           width={BUTTON_WIDTH}
//           height={BUTTON_HEIGHT}
//           borderRadius={8}
//           backgroundColor="$primary"
//           alignSelf="center"
//           marginTop="$6"
//           onPress={() => router.push("/onboarding/screen2")}
//         >
//           <Text
//             color="$color"
//             fontWeight="600"
//             fontSize={20}
//             textAlign="center"
//           >
//             Next
//           </Text>
//         </Button>
//       </YStack>
//     </SafeAreaView>
//   );
// }
