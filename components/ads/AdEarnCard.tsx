import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Card, Text, XStack, YStack } from "tamagui";
import { router } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import { getDailyAdStats, type DailyAdStats } from "@/services/adApi";
import colors from "@/hooks/colors";

const AdEarnCard = ({ style }: { style?: any }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DailyAdStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetchStats();
  }, [user]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await getDailyAdStats();
      setStats(data);
    } catch {
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  const handlePress = () => {
    router.push("/adsWatchScreen");
  };

  const progress = stats ? stats.adsWatchedToday / stats.dailyMax : 0;
  const progressPercent = Math.min(progress * 100, 100);

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.85} style={{ flex: 1 }}>
      <Card
        bordered
        backgroundColor="#fff"
        borderColor="#E5E5E5"
        padding="$3"
        borderRadius="$4"
        style={[styles.card, style]}
      >
        <YStack flex={1} gap="$2">
          <XStack alignItems="center" gap="$2">
            <Text fontSize={20}>📺</Text>
            <Text fontSize="$4" fontWeight="600" color="#0E0E55">
              Watch & Earn
            </Text>
          </XStack>

          <YStack flex={1} justifyContent="center" gap="$1">
            <Text fontSize="$3" color="#666">
              {loading
                ? "Loading..."
                : stats
                  ? `${stats.adsWatchedToday}/${stats.dailyMax} ads today`
                  : "Earn ₦ by watching ads"}
            </Text>

            {stats && (
              <Text fontSize="$3" fontWeight="600" color={colors.primary}>
                ₦{stats.earnedToday} earned
              </Text>
            )}

            {stats && (
              <XStack height={4} backgroundColor="#eee" borderRadius={2} overflow="hidden" marginTop={2}>
                <XStack
                  width={`${progressPercent}%`}
                  backgroundColor={colors.primary}
                  borderRadius={2}
                />
              </XStack>
            )}
          </YStack>

          <XStack
            backgroundColor={colors.primary}
            paddingVertical={6}
            paddingHorizontal={14}
            borderRadius={20}
            alignSelf="center"
          >
            <Text fontSize="$3" fontWeight="600" color="#fff">
              Watch Now
            </Text>
          </XStack>
        </YStack>
      </Card>
    </TouchableOpacity>
  );
};

export default AdEarnCard;

const styles = StyleSheet.create({
  card: {
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
});
