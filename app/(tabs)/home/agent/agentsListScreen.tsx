import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  Dimensions,
  Image,
  Pressable,
  PanResponder,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import { Button, YStack, XStack } from "tamagui";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Toast } from "toastify-react-native";

import colors from "@/hooks/colors";
import { ScreenHeader } from "@/components/auth";
import FilterModal from "@/components/modals/filterBottomModal";
import { useAgentListStore } from "@/store/agents";
import { ToastType } from "toastify-react-native/utils/interfaces";
import { ViewStyle } from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const CARD_HEIGHT = SCREEN_HEIGHT * 0.55;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

export default function AgentList() {
  const { agents, fetchAgents, isLoading } = useAgentListStore();

  const [cardIndex, setCardIndex] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const cardIndexRef = useRef(cardIndex);

  // animated shared values
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotate = useSharedValue(0);

  // ------------------------------------------
  //Load agents ONCE
  // ------------------------------------------
  useEffect(() => {
    if (agents.length === 0) {
      fetchAgents(true).catch((err: any) => {
        Toast.show({
          text1: "Failed to load agents",
          type: "customError" as ToastType,
          text2: err?.response?.data?.message || "Try again.",
        });
      });
    }
  }, [agents.length, fetchAgents]);

  // --- Render logic
  if (agents.length === 0 && isLoading) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <YStack flex={1} alignItems="center" justifyContent="center">
          <Text>Loading agents...</Text>
        </YStack>
      </SafeAreaView>
    );
  }

  // keep ref updated
  useEffect(() => {
    cardIndexRef.current = cardIndex;
  }, [cardIndex]);

  // Prevent index overflow
  useEffect(() => {
    if (agents && cardIndex >= agents.length) {
      setCardIndex(0);
    }
  }, [cardIndex, agents.length]);

  // ------------------------------------------
  // Swipe handler
  // ------------------------------------------
  const handleSwipe = useCallback(() => {
    setCardIndex((prev) => prev + 1);

    translateX.value = 0;
    translateY.value = 0;
    rotate.value = 0;
  }, []);

  const panResponder = React.useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,

        onPanResponderMove: (_, g) => {
          translateX.value = g.dx;
          translateY.value = g.dy;
          rotate.value = g.dx / 20;
        },

        onPanResponderRelease: (_, g) => {
          const shouldSwipe = Math.abs(g.dx) > SWIPE_THRESHOLD;

          if (shouldSwipe) {
            const direction = g.dx > 0 ? SCREEN_WIDTH : -SCREEN_WIDTH;

            translateX.value = withSpring(direction, {}, () =>
              runOnJS(handleSwipe)()
            );
          } else {
            translateX.value = withSpring(0);
            translateY.value = withSpring(0);
            rotate.value = withSpring(0);
          }
        },
      }),
    [handleSwipe]
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  // ------------------------------------------
  // Navigation
  // ------------------------------------------
  const openProfile = () => {
    const current = agents[cardIndex];
    if (!current) return;

    router.push({
      pathname: "/agent/agentProfileScreen",
      params: { id: current.id },
    });
  };

  // ------------------------------------------
  // UI helpers
  // ------------------------------------------
  const renderCard = (agent: any, isTop: boolean) => {
    if (cardIndex >= agents.length) {
      return (
        <View
          style={{ alignItems: "center", justifyContent: "center", flex: 1 }}
        >
          <Text>No more profiles</Text>
        </View>
      );
    }

    const CardInner = (
      <>
        <Image
          source={{ uri: (agent?.avatar || agent?.profilePicture) }}
          style={{ width: "100%", height: "100%", position: "absolute" }}
          resizeMode="cover"
        />

        <View style={{ backgroundColor: "rgba(0,0,0,0.35)", padding: 20 }}>
          <Text style={{ color: "#fff", fontSize: 28, fontWeight: "800" }}>
            {agent?.userName ||
              agent?.username ||
              agent?.user?.userName ||
              agent?.profile?.userName ||
              "N/A"}
          </Text>

          <Text style={{ color: "#fff", fontSize: 16 }}>
            <Ionicons name="location" size={14} /> {agent?.country || "N/A"}{" "}
            <Ionicons name="calendar" size={14} /> {agent?.age || "N/A"} yrs
          </Text>
        </View>
      </>
    );

    const baseStyle: ViewStyle = {
      width: SCREEN_WIDTH * 0.9,
      height: CARD_HEIGHT,
      borderRadius: 14,
      overflow: "hidden",
      backgroundColor: "#fafafa",
      justifyContent: "flex-end",
    };

    if (isTop) {
      return (
        <Animated.View
          style={[baseStyle, animatedStyle]}
          {...panResponder.panHandlers}
        >
          {CardInner}
        </Animated.View>
      );
    }

    // Non-top cards are static previews
    return <View style={baseStyle}>{CardInner}</View>;
  };

  if (!agents || agents.length === 0) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <YStack flex={1} alignItems="center" justifyContent="center">
          <Text>No agents found</Text>
          <Button
            marginTop={10}
            onPress={() => fetchAgents(true)}
            backgroundColor={colors.primary}
          >
            Reload
          </Button>
        </YStack>
      </SafeAreaView>
    );
  }

  const current = agents[cardIndex];

  // ------------------------------------------
  // Main render
  // ------------------------------------------
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff", paddingTop: 20 }}>
      <View style={{ paddingLeft: 18 }}>
        <ScreenHeader
          title="Suggested Agent"
          onBackPress={() => router.back()}
        />
      </View>

      <Pressable style={{ paddingHorizontal: 20, marginBottom: 10 }}>
        <XStack
          style={{
            borderWidth: 1,
            borderColor: "#CCC",
            borderRadius: 8,
            padding: 12,
          }}
        >
          <Text>Filter agents...</Text>

          <Ionicons
            name="filter"
            size={22}
            style={{ position: "absolute", right: 12 }}
            onPress={() => setShowFilters(true)}
          />
        </XStack>
      </Pressable>

      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        {renderCard(current, true)}
      </View>

      {cardIndex < agents.length && (
        <XStack
          justifyContent="space-around"
          paddingHorizontal={20}
          paddingTop={20}
        >
          <Button
            flex={1}
            marginRight={10}
            backgroundColor={colors.secondry}
            borderRadius={8}
            onPress={handleSwipe}
          >
            Skip
          </Button>
          <Button
            flex={1}
            marginLeft={10}
            backgroundColor={colors.primary}
            borderRadius={8}
            onPress={openProfile}
          >
            View Profile
          </Button>
        </XStack>
      )}

      {/* Buttons */}
      <XStack padding={20} justifyContent="space-between"></XStack>

      {/* Filters */}
      <FilterModal
        visible={showFilters}
        onClose={() => setShowFilters(false)}
        onApply={() => {}}
      />
    </SafeAreaView>
  );
}
