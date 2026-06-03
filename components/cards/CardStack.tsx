import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  Dimensions,
  PanResponder,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import FilterModal from "@/components/modals/filterBottomModal";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { ScreenHeader } from "@/components/auth";
import { router } from "expo-router";
import colors from "@/hooks/colors";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const CARD_WIDTH = SCREEN_WIDTH * 0.9;
const BACK_CARD_STEP = SCREEN_WIDTH * 0.035;
const CARD_HEIGHT = SCREEN_HEIGHT * 0.53;
const CARD_TOP_OFFSET = SCREEN_HEIGHT * 0.035;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

interface CardStackProps {
  items: any[];
  isLoading: boolean;
  title: string;
  filterPlaceholder: string;
  entityName: string;
  renderCardContent: (card: any) => React.ReactNode;
  onViewProfile: (card: any) => void;
  onRefresh: () => Promise<any>;
  fetchItems: (showToast?: boolean) => Promise<any>;
}

export default function CardStack({
  items,
  isLoading,
  title,
  filterPlaceholder,
  entityName,
  renderCardContent,
  onViewProfile,
  onRefresh,
  fetchItems,
}: CardStackProps) {
  const insets = useSafeAreaInsets();

  const [cardIndex, setCardIndex] = useState(0);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [filters, setFilters] = useState<any>([]);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotate = useSharedValue(0);

  const cardIndexRef = useRef(cardIndex);

  useEffect(() => {
    cardIndexRef.current = cardIndex;
  }, [cardIndex]);

  const goToNextCard = useCallback(() => {
    setCardIndex((prev) => prev + 1);
    translateX.value = 0;
    translateY.value = 0;
    rotate.value = 0;
  }, []);

  const resetCardPosition = useCallback(() => {
    translateX.value = withSpring(0);
    translateY.value = withSpring(0);
    rotate.value = withSpring(0);
  }, []);

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
              runOnJS(goToNextCard)(),
            );
          } else {
            resetCardPosition();
          }
        },
      }),
    [goToNextCard, resetCardPosition],
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
      return filterPlaceholder;
    }
    return Object.entries(filters)
      .map(([key, value]) => (value ? `${key}: ${value}` : null))
      .filter(Boolean)
      .join("  •  ");
  };

  const handleViewProfile = useCallback(() => {
    const card = items[cardIndexRef.current];
    if (!card) return;
    onViewProfile(card);
  }, [items, onViewProfile]);

  const renderCardStack = () => {
    if (cardIndex >= items.length) {
      return (
        <View style={{ alignItems: "center", justifyContent: "center", flex: 1, gap: 16 }}>
          <Ionicons name="search-outline" size={64} color="#ccc" />
          <Text style={{ fontSize: 18, fontWeight: "600", color: "#666" }}>
            No more profiles
          </Text>
          <Text style={{ fontSize: 14, color: "#999", textAlign: "center", paddingHorizontal: 40 }}>
            We've shown you all available {entityName}. Check back later or adjust your filters.
          </Text>
          <TouchableOpacity
            onPress={() => {
              setCardIndex(0);
              onRefresh();
            }}
            style={{
              backgroundColor: colors.primary,
              paddingHorizontal: 28,
              paddingVertical: 12,
              borderRadius: 24,
              marginTop: 8,
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "600", fontSize: 15 }}>
              Refresh
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    const currentCard = items[cardIndex];
    const nextCards = items.slice(cardIndex + 1, cardIndex + 3);

    return (
      <View style={{ flex: 1, alignItems: "center" }}>
        {nextCards.map((card, idx) => {
          const level = nextCards.length - 1 - idx;
          const shrink = (level + 1) * BACK_CARD_STEP;
          return (
            <View
              key={card.id}
              style={{
                position: "absolute",
                width: CARD_WIDTH - shrink * 2,
                height: CARD_HEIGHT - shrink * 0.6,
                borderRadius: 16,
                overflow: "hidden",
                backgroundColor: "#f0f0f0",
                justifyContent: "flex-end",
                top: CARD_TOP_OFFSET - (level + 1) * 14,
                zIndex: 0,
                elevation: 0,
              }}
            >
              {renderCardContent(card)}
            </View>
          );
        })}

        <Animated.View
          key={`front-${cardIndex}`}
          style={[
            {
              position: "absolute",
              width: CARD_WIDTH,
              height: CARD_HEIGHT,
              borderRadius: 16,
              overflow: "hidden",
              backgroundColor: "#f0f0f0",
              justifyContent: "flex-end",
              top: CARD_TOP_OFFSET,
              zIndex: 10,
              elevation: 5,
            },
            animatedStyle,
          ]}
          {...panResponder.panHandlers}
        >
          {renderCardContent(currentCard)}
        </Animated.View>

        {items.length > 1 && (
          <View
            style={{
              position: "absolute",
              bottom: -30,
              alignSelf: "center",
              flexDirection: "row",
              gap: 6,
            }}
          >
            {items.map((_, idx) => (
              <View
                key={idx}
                style={{
                  width: idx === cardIndex ? 20 : 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor:
                    idx === cardIndex ? colors.primary : "#ddd",
                }}
              />
            ))}
          </View>
        )}
      </View>
    );
  };

  if (items.length === 0 && isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
          }}
        >
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={{ fontSize: 15, color: "#666" }}>
            Finding {entityName} for you...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={{ paddingLeft: 18 }}>
        <ScreenHeader
          title={title}
          onBackPress={() => router.back()}
        />
      </View>

      {/* Filter bar */}
      <TouchableOpacity
        onPress={() => setIsFilterVisible(true)}
        style={{
          marginHorizontal: 20,
          marginBottom: 16,
          marginTop: 8,
          borderWidth: 1,
          borderColor: "#e0e0e0",
          borderRadius: 10,
          paddingHorizontal: 14,
          paddingVertical: 12,
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#fafafa",
        }}
      >
        <Ionicons
          name="funnel-outline"
          size={18}
          color="#888"
          style={{ marginRight: 8 }}
        />
        <Text
          style={{
            color: "#666",
            fontSize: 14,
            flex: 1,
          }}
          numberOfLines={1}
        >
          {renderFilterSummary()}
        </Text>
        <Ionicons name="chevron-down" size={18} color="#888" />
      </TouchableOpacity>

      <View style={{ flex: 1 }}>{renderCardStack()}</View>

      {cardIndex < items.length && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            paddingHorizontal: 20,
            paddingBottom: Math.max(insets.bottom, 8) + 5,
            paddingTop: 10,
            gap: 12,
          }}
        >
          <TouchableOpacity
            onPress={goToNextCard}
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              paddingVertical: 14,
              borderRadius: 12,
              backgroundColor: "#f5f5f5",
              borderWidth: 1,
              borderColor: "#e0e0e0",
            }}
          >
            <Ionicons name="close-outline" size={20} color="#999" />
            <Text style={{ color: "#666", fontWeight: "600", fontSize: 15 }}>
              Skip
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleViewProfile}
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              paddingVertical: 14,
              borderRadius: 12,
              backgroundColor: colors.primary,
            }}
          >
            <Ionicons name="information-outline" size={20} color="#fff" />
            <Text style={{ color: "#fff", fontWeight: "600", fontSize: 15 }}>
              View Profile
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <FilterModal
        visible={isFilterVisible}
        onClose={() => setIsFilterVisible(false)}
        onApply={(filters) => setFilters(filters)}
      />
    </SafeAreaView>
  );
}
