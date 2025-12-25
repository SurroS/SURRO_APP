import React, { useEffect, useState, useCallback, useRef } from "react";
import { View, Text, Dimensions, Image, PanResponder } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import { Button, YStack, XStack } from "tamagui";
import { Ionicons } from "@expo/vector-icons";
import { useSurrogateStore } from "@/store/surrogates";
import FilterModal from "@/components/modals/filterBottomModal";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenHeader } from "@/components/auth";
import { router } from "expo-router";
import colors from "@/hooks/colors";
import { Toast } from "toastify-react-native";
import { ToastType } from "toastify-react-native/utils/interfaces";
import { useAuth } from "@/hooks/useAuth";
import { useParentProfile } from "@/hooks/useParent";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const CARD_HEIGHT = SCREEN_HEIGHT * 0.55;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

export default function SurrogateList() {
  const { surrogates, fetchSurrogates, isLoading } = useSurrogateStore();
  const { user } = useAuth();
  const { saveParentSurrogate } = useParentProfile();

  const [cardIndex, setCardIndex] = useState(0);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [filters, setFilters] = useState<any>([]);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotate = useSharedValue(0);

  const cardIndexRef = useRef(cardIndex);

  // Keep ref updated
  useEffect(() => {
    cardIndexRef.current = cardIndex;
  }, [cardIndex]);

  // Fetch surrogates if store is empty
  useEffect(() => {
    if (surrogates.length === 0) {
      fetchSurrogates(true).catch((err: any) => {
        Toast.show({
          text1: "Failed to load surrogates",
          type: "customError" as ToastType,
          text2: err?.response?.data?.message || "Please try again.",
        });
      });
    }
  }, [surrogates.length, fetchSurrogates]);

  // Swipe handler
  const handleSwipe = useCallback(() => {
    setCardIndex((prev) => prev + 1); // increment index like AgentList
    translateX.value = 0;
    translateY.value = 0;
    rotate.value = 0;
  }, []);

  // View profile
  const handleViewProfile = useCallback(async () => {
    const currentCard = surrogates[cardIndexRef.current];
    if (!currentCard) return;

    if (user?.role?.trim() === "INTENDED_PARENT") {
      try {
        await saveParentSurrogate({ surrogateId: currentCard.id });
      } catch {}
    }

    router.push({
      pathname: "/(tabs)/home/surrogate/surrogateProfileScreen",
      params: { id: currentCard?.id },
    });
  }, [user, saveParentSurrogate, surrogates]);

  const resetCardPosition = useCallback(() => {
    translateX.value = withSpring(0);
    translateY.value = withSpring(0);
    rotate.value = withSpring(0);
  }, []);

  // PanResponder
  const panResponder = React.useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => false,
        onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > 5,
        onPanResponderMove: (_, gestureState) => {
          translateX.value = gestureState.dx;
          translateY.value = gestureState.dy;
          rotate.value = gestureState.dx / 20;
        },
        onPanResponderRelease: (_, gestureState) => {
          const shouldSwipe = Math.abs(gestureState.dx) > SWIPE_THRESHOLD;

          if (shouldSwipe) {
            const direction =
              gestureState.dx > 0 ? SCREEN_WIDTH : -SCREEN_WIDTH;
            translateX.value = withSpring(direction, {}, () =>
              runOnJS(handleSwipe)()
            );
          } else {
            resetCardPosition();
          }
        },
      }),
    [handleSwipe, resetCardPosition]
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  const renderFilterSummary = () => {
    if (!filters || Object.keys(filters).length === 0) {
      return "Filter surrogates...";
    }
    return Object.entries(filters)
      .map(([key, value]) => (value ? `${key}: ${value}` : null))
      .filter(Boolean)
      .join(" • ");
  };

  const renderCardStack = () => {
    if (cardIndex >= surrogates.length) {
      return (
        <YStack alignItems="center" justifyContent="center" flex={1}>
          <Text>No more profiles</Text>
        </YStack>
      );
    }

    const currentCard = surrogates[cardIndex];
    const nextCards = surrogates.slice(cardIndex + 1, cardIndex + 3);

    const CardContent = (card?: any) => (
      <>
        <Image
          source={{ uri: card.avatar }}
          style={{ width: "100%", height: "100%", position: "absolute" }}
          resizeMode="cover"
        />
        <View style={{ backgroundColor: "rgba(0,0,0,0.35)", padding: 20 }}>
          <Text style={{ color: "#fff", fontSize: 28, fontWeight: "800" }}>
            {card.userName || "N/A"}
          </Text>
          <Text style={{ color: "#fff", fontSize: 16 }}>
            <Ionicons card="location" size={14} /> {card.country || "N/A"}{" "}
            <Ionicons name="calendar" size={14} /> {card.age || "N/A"} yrs
          </Text>
        </View>
      </>
    );

    return (
      <>
        {nextCards.map((card) => (
          <View
            key={card.id}
            style={{
              position: "absolute",
              width: SCREEN_WIDTH * 0.9,
              height: CARD_HEIGHT,
              borderRadius: 12,
              overflow: "hidden",
              backgroundColor: "#fafafa",
              justifyContent: "flex-end",
              top: 8,
              zIndex: 1,
              elevation: 1,
            }}
          >
            {CardContent(card)}
          </View>
        ))}

        <Animated.View
          key={currentCard.id}
          style={[
            {
              position: "absolute",
              width: SCREEN_WIDTH * 0.9,
              height: CARD_HEIGHT,
              borderRadius: 12,
              overflow: "hidden",
              backgroundColor: "#fafafa",
              justifyContent: "flex-end",
              zIndex: 10,
              elevation: 5,
            },
            animatedStyle,
          ]}
          {...panResponder.panHandlers}
        >
          {CardContent(currentCard)}
        </Animated.View>
      </>
    );
  };

  if (surrogates.length === 0 && isLoading) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <YStack flex={1} alignItems="center" justifyContent="center">
          <Text>Loading surrogates...</Text>
        </YStack>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff", paddingTop: 20 }}>
      <View style={{ paddingLeft: 18 }}>
        <ScreenHeader
          title="Suggested Surrogate"
          onBackPress={() => router.back()}
        />
      </View>

      <YStack paddingHorizontal={20} marginBottom={10}>
        <XStack
          position="relative"
          style={{
            borderWidth: 1,
            borderColor: "#CCC",
            borderRadius: 8,
            paddingHorizontal: 12,
            paddingVertical: 10,
            fontSize: 16,
            paddingRight: 40,
          }}
        >
          <Text style={{ color: "#333" }}>{renderFilterSummary()}</Text>
          <Ionicons
            name="filter"
            size={22}
            color="#333"
            style={{ position: "absolute", right: 12, top: 12 }}
            onPress={() => setIsFilterVisible(true)}
          />
        </XStack>
      </YStack>

      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        {renderCardStack()}
      </View>

      {cardIndex < surrogates.length && (
        <XStack
          justifyContent="space-around"
          paddingHorizontal={20}
          paddingBottom={20}
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
            onPress={handleViewProfile}
          >
            View Profile
          </Button>
        </XStack>
      )}

      <FilterModal
        visible={isFilterVisible}
        onClose={() => setIsFilterVisible(false)}
        onApply={(filters) => setFilters(filters)}
      />
    </SafeAreaView>
  );
}
