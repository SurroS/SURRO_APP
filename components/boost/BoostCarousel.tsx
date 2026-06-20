import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { router } from "expo-router";
import { getBoostedProfiles, type BoostedProfile } from "@/services/boostApi";
import { resolveProfilePicture } from "@/utils/resolveMediaUrl";

const SCREEN_WIDTH = Dimensions.get("window").width;
const CARD_WIDTH = 130;
const CARD_GAP = 10;
const SNAP_INTERVAL = CARD_WIDTH + CARD_GAP;

export default function BoostCarousel() {
  const [profiles, setProfiles] = useState<BoostedProfile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList<BoostedProfile>>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isDragging = useRef(false);

  useEffect(() => {
    fetchBoosted();

    const pollInterval = setInterval(fetchBoosted, 30000);
    return () => clearInterval(pollInterval);
  }, []);

  useEffect(() => {
    if (profiles.length === 0) return;

    intervalRef.current = setInterval(() => {
      if (isDragging.current) return;
      const next = (currentIndex + 1) % profiles.length;
      setCurrentIndex(next);
      flatListRef.current?.scrollToIndex({
        index: next,
        animated: true,
      });
    }, 3000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [currentIndex, profiles.length]);

  const fetchBoosted = async () => {
    try {
      const data = await getBoostedProfiles();
      setProfiles(data.boosted || []);
    } catch {
      // silently fail
    }
  };

  const handlePress = useCallback((profile: BoostedProfile) => {
    router.push({
      pathname: "/surrogate/surrogateProfileScreen" as any,
      params: { id: profile.userId, fromNetwork: "1" },
    });
  }, []);

  const onScrollBeginDrag = () => {
    isDragging.current = true;
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const onScrollEndDrag = () => {
    isDragging.current = false;
  };

  const onMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / SNAP_INTERVAL);
    setCurrentIndex(index);
  };

  if (profiles.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>⭐ Boosted Profiles</Text>
        <Text style={styles.headerCount}>{profiles.length}</Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={profiles}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        snapToInterval={SNAP_INTERVAL}
        decelerationRate="fast"
        onScrollBeginDrag={onScrollBeginDrag}
        onScrollEndDrag={onScrollEndDrag}
        onMomentumScrollEnd={onMomentumScrollEnd}
        keyExtractor={(item) => item.userId}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => handlePress(item)}
            activeOpacity={0.8}
          >
            <View style={styles.avatarContainer}>
              {item.profilePicture ? (
                <Image
                  source={{ uri: resolveProfilePicture(item.profilePicture) ?? undefined }}
                  style={styles.avatar}
                />
              ) : (
                <View style={[styles.avatar, styles.avatarPlaceholder]}>
                  <Text style={styles.avatarLetter}>
                    {(item.firstName?.[0] || "?").toUpperCase()}
                  </Text>
                </View>
              )}
            </View>
            <Text style={styles.name} numberOfLines={1}>
              @{item.userName || item.firstName}
            </Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>⭐ Boosted</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    paddingTop: 8,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
  },
  headerCount: {
    fontSize: 12,
    fontWeight: "600",
    color: "#999",
  },
  listContent: {
    paddingHorizontal: 16,
    gap: CARD_GAP,
  },
  card: {
    width: CARD_WIDTH,
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 12,
  },
  avatarContainer: {
    marginBottom: 8,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  avatarPlaceholder: {
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarLetter: {
    fontSize: 18,
    fontWeight: "700",
    color: "#666",
  },
  name: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    marginBottom: 6,
  },
  badge: {
    backgroundColor: "#FFF3CD",
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#856404",
  },
});
