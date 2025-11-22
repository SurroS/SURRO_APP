import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  Dimensions,
  Image,
  Alert,
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
import { useSurrogateStore } from "@/store/surrogates";
import FilterModal from "@/components/modals/filterBottomModal";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenHeader } from "@/components/auth";
import { router } from "expo-router";
import colors from "@/hooks/colors";
import { Toast } from "toastify-react-native";
import { ToastType } from "toastify-react-native/utils/interfaces";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const CARD_HEIGHT = SCREEN_HEIGHT * 0.55;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

export default function SurrogateList() {
  const { surrogates, fetchSurrogates, isLoading } = useSurrogateStore();
  const [cardIndex, setCardIndex] = useState(0);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [filters, setFilters] = useState<any>([]);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotate = useSharedValue(0);

  // Use refs to always get the latest values
  const cardIndexRef = useRef(cardIndex);
  const filteredListRef = useRef(surrogates);

  // Keep refs updated
  useEffect(() => {
    cardIndexRef.current = cardIndex;
    filteredListRef.current = surrogates;
  }, [cardIndex, surrogates]);
  // --- Fetch surrogates on mount

  useEffect(() => {
    if (surrogates.length === 0) {
      fetchSurrogates(true).catch((err: any) => {
        console.log(surrogates.map((surrogate) => surrogate.id));
        Toast.show({
          text1: "Failed to load surrogates",
          type: "customError" as ToastType,
          text2: err?.response?.data?.message || "Please try again.",
        });
      });
    }
  }, [surrogates.length, fetchSurrogates]);

  const filteredList = surrogates;

  const handleSwipe = useCallback(() => {
    const nextIndex = cardIndexRef.current + 1;
    if (nextIndex < filteredListRef.current.length) {
      setCardIndex(nextIndex);
      translateX.value = 0;
      translateY.value = 0;
      rotate.value = 0;
    }
  }, []);

  const renderFilterSummary = () => {
    if (!filters || Object.keys(filters).length === 0) {
      return "Filter surrogates...";
    }
    return Object.entries(filters)
      .map(([key, value]) => {
        if (!value) return null; // skip empty / null
        return `${key}: ${value}`;
      })
      .filter(Boolean)
      .join(" • ");
  };

  const handleSkip = useCallback(() => {
    handleSwipe();
  }, [handleSwipe]);

  const handleViewProfile = useCallback(() => {
    const currentCard = filteredListRef.current[cardIndexRef.current];
    if (!currentCard) return;

    router.push({
      pathname: "/(tabs)/home/surrogate/surrogateProfileScreen",
      params: { id: currentCard.id },
    });
  }, []);

  const resetCardPosition = useCallback(() => {
    translateX.value = withSpring(0);
    translateY.value = withSpring(0);
    rotate.value = withSpring(0);
  }, []);

  // Recreate pan responder when cardIndex changes to capture latest handlers
  const panResponder = React.useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
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

  const renderCardStack = () => {
    if (isLoading) {
      return (
        <YStack alignItems="center" justifyContent="center" flex={1}>
          <Text>Loading surrogates...</Text>
        </YStack>
      );
    }

    if (filteredList.length === 0 || cardIndex >= filteredList.length ||surrogates.length === 0  ) {
      return (
        <YStack alignItems="center" justifyContent="center" flex={1}>
          <Image
            source={require("@/assets/images/noImage.png")}
            style={{ width: SCREEN_WIDTH * 0.7, height: CARD_HEIGHT * 0.6 }}
            resizeMode="contain"
          />
          <Text style={{ fontSize: 18, marginVertical: 16 }}>
            No more profiles
          </Text>
          <Button 
            marginLeft={10}
            backgroundColor={colors.primary}
            borderRadius={8}
            onPress={() => {
              setCardIndex(0);
              fetchSurrogates(true);
            }}
          >
            Reload
          </Button>
        </YStack>
      );
    }

    const visibleCards = filteredList.slice(cardIndex, cardIndex + 3);

    return visibleCards.map((card, index) => {
      const isTopCard = index === 0;
      const cardStyle = {
        top: index * 8,
        zIndex: visibleCards.length - index,
      };

      const CardContent = (
        <>
          <Image
            source={
              typeof card.avatar === "string"
                ? { uri: card.avatar }
                : card.avatar
            }
            style={{ width: "100%", height: "100%", position: "absolute" }}
            resizeMode="cover"
            onError={() => console.log("Failed to load image for:", card.name)}
          />
          <View style={{ backgroundColor: "rgba(0,0,0,0.35)", padding: 20 }}>
            <Text style={{ color: "#fff", fontSize: 28, fontWeight: "800" }}>
              {card.name}
            </Text>
            <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
              <Ionicons name="location" size={16} /> {card.country || "country"}{" "}
              <Ionicons name="calendar" size={16} />{" "}
              {card.age + "years" || "age years"}
            </Text>
          </View>
        </>
      );

      if (isTopCard) {
        return (
          <Animated.View
            key={`${card.id}-${cardIndex}-${index}`}
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
            {...panResponder.panHandlers}
          >
            {CardContent}
          </Animated.View>
        );
      }

      return (
        <View
          key={`${card.id}-${cardIndex}-${index}`}
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
            cardStyle,
          ]}
        >
          {CardContent}
        </View>
      );
    });
  };

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

      {filteredList[cardIndex] && (
        <XStack
          justifyContent="space-around"
          paddingHorizontal={20}
          paddingBottom={20}
        >
          <Button
            flex={1}
            marginRight={10}
            backgroundColor="#b2b7be"
            borderRadius={8}
            onPress={handleSkip}
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
        onApply={(filters) => {
          console.log("Selected filters:", filters);
          setFilters(filters);
        }}
      />
    </SafeAreaView>
  );
}
