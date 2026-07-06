import React, { useEffect, useState, useCallback, useRef, useMemo } from "react";
import {
  View,
  Text,
  Dimensions,
  PanResponder,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import FilterModal, { FilterParam } from "@/components/modals/filterBottomModal";
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
  role: "SURROGATE" | "AGENT";
  onSaveProfile?: (surrogateId: string) => void;
  savedIds?: Set<string>;
  viewMode?: "all" | "matches" | "saved";
  isParent?: boolean;
  onViewModeChange?: (mode: "all" | "matches" | "saved") => void;
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
  role,
  onSaveProfile,
  savedIds,
  viewMode,
  isParent,
  onViewModeChange,
}: CardStackProps) {
  const insets = useSafeAreaInsets();

  const [cardIndex, setCardIndex] = useState(0);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterParam>(null);
  const [showNoResultsModal, setShowNoResultsModal] = useState(false);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotate = useSharedValue(0);
  const cardEntryProgress = useSharedValue(1);
  const heartScale = useSharedValue(1);

  const cardIndexRef = useRef(cardIndex);

  useEffect(() => {
    cardIndexRef.current = cardIndex;
  }, [cardIndex]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (viewMode === "saved" && !(savedIds?.has(item.id) ?? false)) {
        return false;
      }
      if (!activeFilter) return true;
      switch (activeFilter.type) {
        case "country":
          return (item.country || item.countryOfResidence || "").toLowerCase() === activeFilter.value.toLowerCase();
        case "state":
          return (item.stateOfResidence || item.state || "").toLowerCase() === activeFilter.value.toLowerCase();
        case "lga":
          return (item.lga || "").toLowerCase() === activeFilter.value.toLowerCase();
        case "experience":
          return (item.experienceLevel || "").toLowerCase() === activeFilter.value.toLowerCase();
        case "genotype":
          return (item.genotype || "").toLowerCase() === activeFilter.value.toLowerCase();
        case "bloodGroup":
          return (item.bloodGroup || "").toLowerCase() === activeFilter.value.toLowerCase();
        case "age": {
          const age = Number(item.age);
          switch (activeFilter.value) {
            case "18-25": return age >= 18 && age <= 25;
            case "26-30": return age >= 26 && age <= 30;
            case "31-35": return age >= 31 && age <= 35;
            case "36-40": return age >= 36 && age <= 40;
            case "40+": return age >= 41;
            default: return true;
          }
        }
        case "rating":
          const min = parseFloat(activeFilter.value);
          const rating = item.performance?.averageRating ?? 0;
          return rating >= min;
        case "specialization":
          return (item.specialization || "").toLowerCase().includes(activeFilter.value.toLowerCase());
        default:
          return true;
      }
    });
  }, [items, activeFilter, savedIds, viewMode]);

  // Clamp cardIndex when items shrink (e.g. after refresh or filter)
  useEffect(() => {
    if (cardIndex >= filteredItems.length && filteredItems.length > 0) {
      setCardIndex(0);
    }
  }, [cardIndex, filteredItems.length]);

  const goToNextCard = useCallback(() => {
    setCardIndex((prev) => prev + 1);
    translateX.value = 0;
    translateY.value = 0;
    rotate.value = 0;
    cardEntryProgress.value = 0;
    cardEntryProgress.value = withSpring(1, { damping: 10, stiffness: 250 });
  }, []);

  const resetCardPosition = useCallback(() => {
    translateX.value = withSpring(0);
    translateY.value = withSpring(0);
    rotate.value = withSpring(0);
  }, []);

  const currentCard = filteredItems[cardIndex];

  const handleSavePress = useCallback(() => {
    if (!currentCard || !onSaveProfile) return;
    heartScale.value = withSpring(1.3, {}, () => {
      heartScale.value = withSpring(1);
    });
    onSaveProfile(currentCard.id);
  }, [currentCard, onSaveProfile]);

  const heartAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }],
  }));

  const panResponder = React.useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => false,
        onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > 5,
        onPanResponderMove: (_, gestureState) => {
          if (cardEntryProgress.value < 0.99) {
            cardEntryProgress.value = 1;
          }
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

  // Show no-results modal when filter returns empty but full list has items
  useEffect(() => {
    if (activeFilter && filteredItems.length === 0 && items.length > 0) {
      setShowNoResultsModal(true);
    }
  }, [activeFilter, filteredItems.length, items.length]);

  const handleClearFilter = useCallback(() => {
    setActiveFilter(null);
    setShowNoResultsModal(false);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: cardEntryProgress.value,
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value + (1 - cardEntryProgress.value) * 25 },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  const handleViewProfile = useCallback(() => {
    const card = filteredItems[cardIndexRef.current];
    if (!card) return;
    onViewProfile(card);
  }, [filteredItems, onViewProfile]);

  const renderCardStack = () => {
    if (cardIndex >= filteredItems.length) {
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
              setActiveFilter(null);
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

    const nextCards = filteredItems.slice(cardIndex + 1, cardIndex + 3);

    return (
      <View style={{ flex: 1, alignItems: "center" }}>
        {nextCards.filter(Boolean).map((card, idx) => {
          const shrink = (idx + 1) * BACK_CARD_STEP;
          const z = nextCards.length - idx;
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
                top: CARD_TOP_OFFSET - (idx + 1) * 14,
                zIndex: z,
                elevation: z,
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
          {currentCard && renderCardContent(currentCard)}
        </Animated.View>

        {filteredItems.length > 1 && (
          <View
            style={{
              position: "absolute",
              bottom: -30,
              alignSelf: "center",
              flexDirection: "row",
              gap: 6,
            }}
          >
            {filteredItems.map((_, idx) => (
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

  if (filteredItems.length === 0 && isLoading) {
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

  type TabItem = { key: "filter" | "all" | "matches" | "saved"; label: string };

  const parentTabs: TabItem[] = [
    { key: "filter", label: "Filter" },
    { key: "all", label: "All" },
    { key: "matches", label: "Matches" },
    { key: "saved", label: "Saved" },
  ];

  const agentTabs: TabItem[] = [
    { key: "filter", label: "Filter" },
    { key: "all", label: "All" },
    { key: "saved", label: "Saved" },
  ];

  const tabs = isParent ? parentTabs : agentTabs;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={{ flexDirection: "row", alignItems: "center", paddingLeft: 10, paddingRight: 18 }}>
        <View style={{ flex: 1 }}>
          <ScreenHeader
            title={title}
            onBackPress={() => router.back()}
          />
        </View>
      </View>

      {/* Mode toggle + Filter */}
      {onViewModeChange && viewMode && (
        <View style={styles.toggleBar}>
          {tabs.map((tab) => {
            if (tab.key === "filter") {
              const isFilterActive = activeFilter !== null;
              return (
                <TouchableOpacity
                  key="filter"
                  onPress={() => setIsFilterVisible(true)}
                  style={[
                    styles.togglePill,
                    styles.filterPill,
                    isFilterActive && styles.filterPillActive,
                  ]}
                >
                  <Ionicons
                    name="funnel-outline"
                    size={15}
                    color={isFilterActive ? "#fff" : "#555"}
                    style={{ marginRight: 4 }}
                  />
                  <Text
                    style={[
                      styles.togglePillText,
                      isFilterActive && styles.togglePillTextActive,
                    ]}
                  >
                    {isFilterActive ? `${activeFilter!.type}: ${activeFilter!.value}` : "Filter"}
                  </Text>
                </TouchableOpacity>
              );
            }
            return (
              <TouchableOpacity
                key={tab.key}
                onPress={() => onViewModeChange(tab.key)}
                style={[
                  styles.togglePill,
                  viewMode === tab.key && styles.togglePillActive,
                ]}
              >
                <Text
                  style={[
                    styles.togglePillText,
                    viewMode === tab.key && styles.togglePillTextActive,
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      <View style={{ flex: 1 }}>{renderCardStack()}</View>

      {cardIndex < filteredItems.length && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 20,
            paddingBottom: Math.max(insets.bottom, 8) + 5,
            paddingTop: 10,
            marginTop: 40,
            gap: 12,
          }}
        >
          {onSaveProfile && (
            <TouchableOpacity
              onPress={handleSavePress}
              activeOpacity={0.7}
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: "#fff",
                alignItems: "center",
                justifyContent: "center",
                shadowColor: "#000",
                shadowOpacity: 0.1,
                shadowOffset: { width: 0, height: 2 },
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              <Animated.View style={heartAnimatedStyle}>
                <Ionicons
                  name={savedIds?.has(currentCard?.id) ? "heart" : "heart-outline"}
                  size={26}
                  color={savedIds?.has(currentCard?.id) ? "#FF3B30" : "#999"}
                />
              </Animated.View>
            </TouchableOpacity>
          )}

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
        onApply={(f) => setActiveFilter(f)}
        role={role}
        items={items}
      />

      {/* No Results Modal */}
      <Modal visible={showNoResultsModal} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center", padding: 32 }}>
          <View style={{ backgroundColor: "#fff", borderRadius: 16, padding: 28, paddingBottom: 28 + (insets.bottom || 0), alignItems: "center", width: "100%", gap: 14 }}>
            <Ionicons name="search-outline" size={40} color={colors.primary} />
            <Text style={{ fontSize: 18, fontWeight: "700", color: "#0E0E55" }}>No Results Found</Text>
            <Text style={{ fontSize: 14, color: "#666", textAlign: "center", lineHeight: 20 }}>
              No {entityName} match your current filter. Would you like to clear the filter and browse all available profiles?
            </Text>
            <View style={{ flexDirection: "row", gap: 12, marginTop: 8, width: "100%" }}>
              <TouchableOpacity
                onPress={() => setShowNoResultsModal(false)}
                style={{ flex: 1, paddingVertical: 12, borderRadius: 10, borderWidth: 1, borderColor: "#0E0E55", alignItems: "center" }}
              >
                <Text style={{ color: "#0E0E55", fontWeight: "600" }}>Keep filter</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleClearFilter}
                style={{ flex: 1, paddingVertical: 12, borderRadius: 10, backgroundColor: "#0E0E55", alignItems: "center" }}
              >
                <Text style={{ color: "#fff", fontWeight: "600" }}>Show all</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  toggleBar: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 10,
    gap: 8,
    backgroundColor: "#fff",
  },
  togglePill: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  togglePillActive: {
    backgroundColor: "#0E0E55",
    borderColor: "#0E0E55",
  },
  togglePillText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
  },
  togglePillTextActive: {
    color: "#fff",
  },
  filterPill: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: colors.primary,
    backgroundColor: "#fff",
  },
  filterPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
});
