// import React, { useRef } from "react";
// import { View, Dimensions, Image } from "react-native";
// import Animated, {
//   useSharedValue,
//   useAnimatedStyle,
//   withSpring,
// } from "react-native-reanimated";
// import { Button, YStack, XStack, Text } from "tamagui";
// import { Ionicons } from "@expo/vector-icons";
// import { useAgentProfileStore } from "@/store/profile/agent";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { ScreenHeader } from "@/components/auth";
// import { router } from "expo-router";
// import colors from "@/hooks/colors";

// const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
// const CARD_HEIGHT = SCREEN_HEIGHT * 0.55;

// export default function AgentList() {
//   const { agentProfile } = useAgentProfileStore();

//   const translateX = useSharedValue(0);
//   const translateY = useSharedValue(0);
//   const rotate = useSharedValue(0);

//   const resetCardPosition = () => {
//     translateX.value = withSpring(0);
//     translateY.value = withSpring(0);
//     rotate.value = withSpring(0);
//   };

//   const handleViewProfile = () => {
//     if (!agentProfile) return;

//     router.push({
//       pathname: "/(tabs)/home/agent/agentsProfileScreen",
//       params: { id: agentProfile.id },
//     });
//   };

//   const animatedStyle = useAnimatedStyle(() => ({
//     transform: [
//       { translateX: translateX.value },
//       { translateY: translateY.value },
//       { rotate: `${rotate.value}deg` },
//     ],
//   }));

//   const CardContent = agentProfile ? (
//     <>
//       <Image
//         source={
//           agentProfile.profilePicture
//             ? { uri: agentProfile.profilePicture }
//             : require("@/assets/images/emptyGallery.png")
//         }
//         style={{ width: "100%", height: "100%", position: "absolute" }}
//         resizeMode="cover"
//       />
//       <View style={{ backgroundColor: "rgba(0,0,0,0.35)", padding: 20 }}>
//         <Text style={{ color: "#fff", fontSize: 28, fontWeight: "800" }}>
//           {agentProfile.fullName || agentProfile.userName}
//         </Text>
//         <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
//           <Ionicons name="location" size={16} />{" "}
//           {agentProfile.countryOfResidence || "Location not set"}
//         </Text>
//       </View>
//     </>
//   ) : (
//     <YStack alignItems="center" justifyContent="center" flex={1}>
//       <Text>No agent profile available</Text>
//     </YStack>
//   );

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
//       <View style={{ paddingLeft: 18 }}>
//         <ScreenHeader
//           title="Suggested Agent"
//           onBackPress={() => router.back()}
//         />
//       </View>

//       <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
//         <Animated.View
//           style={[
//             {
//               position: "absolute",
//               width: SCREEN_WIDTH * 0.9,
//               height: CARD_HEIGHT,
//               borderRadius: 12,
//               overflow: "hidden",
//               backgroundColor: "#fafafa",
//               justifyContent: "flex-end",
//               shadowColor: "#000",
//               shadowOffset: { width: 0, height: 2 },
//               shadowOpacity: 0.1,
//               shadowRadius: 6,
//               elevation: 3,
//             },
//             animatedStyle,
//           ]}
//         >
//           {CardContent}
//         </Animated.View>
//       </View>

//       {agentProfile && (
//         <XStack
//           justifyContent="space-around"
//           paddingHorizontal={20}
//           paddingBottom={20}
//         >
//           <Button
//             flex={1}
//             marginRight={10}
//             backgroundColor="#b2b7be"
//             borderRadius={8}
//             onPress={resetCardPosition}
//           >
//             Reset
//           </Button>
//           <Button
//             flex={1}
//             marginLeft={10}
//             backgroundColor={colors.primary}
//             borderRadius={8}
//             onPress={handleViewProfile}
//           >
//             View Profile
//           </Button>
//         </XStack>
//       )}
//     </SafeAreaView>
//   );
// }


import React, { useEffect, useState, useRef, useCallback } from "react";
import { View, Dimensions, Image, Alert } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withSpring, runOnJS } from "react-native-reanimated";
import { Button, YStack, XStack, Text } from "tamagui";
import { Ionicons } from "@expo/vector-icons";
import { useAgentListStore } from "@/store/agents";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenHeader } from "@/components/auth";
import { router } from "expo-router";
import colors from "@/hooks/colors";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const CARD_HEIGHT = SCREEN_HEIGHT * 0.55;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

export default function AgentList() {
  const { agents, fetchAgents, isLoading } = useAgentListStore();
  const [cardIndex, setCardIndex] = useState(0);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotate = useSharedValue(0);

  const cardIndexRef = useRef(cardIndex);
  const agentsRef = useRef(agents);

  useEffect(() => {
    cardIndexRef.current = cardIndex;
    agentsRef.current = agents;
  }, [cardIndex, agents]);

  useEffect(() => {
    if (agents.length === 0) {
      fetchAgents().catch((err:any) => {
        console.error("Failed to load agents:", err);
        Alert.alert("Error", "Failed to load agents");
      });
    }
  }, []);

  const handleSwipe = useCallback(() => {
    const nextIndex = cardIndexRef.current + 1;
    if (nextIndex < agentsRef.current.length) {
      setCardIndex(nextIndex);
      translateX.value = 0;
      translateY.value = 0;
      rotate.value = 0;
    }
  }, []);

  const resetCardPosition = () => {
    translateX.value = withSpring(0);
    translateY.value = withSpring(0);
    rotate.value = withSpring(0);
  };

  const handleViewProfile = () => {
    const currentAgent = agentsRef.current[cardIndexRef.current];
    if (!currentAgent) return;

    router.push({
      pathname: "/(tabs)/home/agent/agentsProfileScreen",
      params: { id: currentAgent.id },
    });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  const renderCardStack = () => {
    if (isLoading) {
      return (
        <YStack alignItems="center" justifyContent="center" flex={1}>
          <Text>Loading agents...</Text>
        </YStack>
      );
    }

    if (agents.length === 0 || cardIndex >= agents.length) {
      return (
        <YStack alignItems="center" justifyContent="center" flex={1}>
          <Text>No more agents available</Text>
          <Button onPress={() => { setCardIndex(0); fetchAgents(); }}>Reload</Button>
        </YStack>
      );
    }

    const visibleCards = agents.slice(cardIndex, cardIndex + 3);

    return visibleCards.map((agent:any, index:any) => {
      const isTopCard = index === 0;
      const cardStyle = { top: index * 8, zIndex: visibleCards.length - index };

      const CardContent = (
        <>
          <Image
            source={agent.profilePicture ? { uri: agent.profilePicture } : require("@/assets/images/emptyGallery.png")}
            style={{ width: "100%", height: "100%", position: "absolute" }}
            resizeMode="cover"
          />
          <View style={{ backgroundColor: "rgba(0,0,0,0.35)", padding: 20 }}>
            <Text style={{ color: "#fff", fontSize: 28, fontWeight: "800" }}>
              {agent.fullName || agent.userName}
            </Text>
            <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
              <Ionicons name="location" size={16} /> {agent.countryOfResidence || "Location not set"}
            </Text>
          </View>
        </>
      );

      if (isTopCard) {
        return (
          <Animated.View
            key={agent.id}
            style={[
              {
                position: "absolute",
                width: SCREEN_WIDTH * 0.9,
                height: CARD_HEIGHT,
                borderRadius: 12,
                overflow: "hidden",
                backgroundColor: "#fafafa",
                justifyContent: "flex-end",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 6,
                elevation: 3,
              },
              animatedStyle,
            ]}
          >
            {CardContent}
          </Animated.View>
        );
      }

      return (
        <View key={agent.id} style={[{
          position: "absolute",
          width: SCREEN_WIDTH * 0.9,
          height: CARD_HEIGHT,
          borderRadius: 12,
          overflow: "hidden",
          backgroundColor: "#fafafa",
          justifyContent: "flex-end",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 6,
          elevation: 3,
        }, cardStyle]}>
          {CardContent}
        </View>
      );
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={{ paddingLeft: 18 }}>
        <ScreenHeader title="Suggested Agents" onBackPress={() => router.back()} />
      </View>

      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        {renderCardStack()}
      </View>

      {agents[cardIndex] && (
        <XStack justifyContent="space-around" paddingHorizontal={20} paddingBottom={20}>
          <Button flex={1} marginRight={10} backgroundColor="#b2b7be" borderRadius={8} onPress={resetCardPosition}>
            Reset
          </Button>
          <Button flex={1} marginLeft={10} backgroundColor={colors.primary} borderRadius={8} onPress={handleViewProfile}>
            View Profile
          </Button>
        </XStack>
      )}
    </SafeAreaView>
  );
}
