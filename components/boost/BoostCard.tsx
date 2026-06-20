import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Card, Text, XStack, YStack } from "tamagui";
import { router } from "expo-router";
import { getBoostPricing, getBoostStatus } from "@/services/boostApi";
import type { BoostPlan } from "@/services/boostApi";
import colors from "@/hooks/colors";

const BoostCard = ({ style }: { style?: any }) => {
  const [plans, setPlans] = useState<BoostPlan[]>([]);
  const [boosted, setBoosted] = useState(false);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [pricing, status] = await Promise.all([
        getBoostPricing(),
        getBoostStatus(),
      ]);
      setPlans(pricing.plans.slice(0, 3));
      if (status?.isBoosted) {
        setBoosted(true);
        setExpiresAt(status.expiresAt);
      }
    } catch {
      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePress = () => {
    router.push("/boostScreen");
  };

  const formatRemaining = (expires: string) => {
    const remaining = new Date(expires).getTime() - Date.now();
    if (remaining <= 0) return "Expired";
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    if (hours > 24) return `${Math.floor(hours / 24)}d ${hours % 24}h left`;
    return `${hours}h remaining`;
  };

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
            <Text fontSize={20}>🚀</Text>
            <Text fontSize="$3" fontWeight="600" color="#0E0E55">
              Boost Profile
            </Text>
          </XStack>

          <YStack flex={1} justifyContent="center" gap="$1">
            {boosted ? (
              <>
                <Text fontSize="$2" fontWeight="600" color={colors.primary}>
                  ✅ Boosted
                </Text>
                {expiresAt && (
                  <Text fontSize="$2" color="#666">
                    {formatRemaining(expiresAt)}
                  </Text>
                )}
                <Text fontSize="$2" color={colors.primary} textDecorationLine="underline">
                  Tap to extend
                </Text>
              </>
            ) : (
              <>
                <Text fontSize="$2" color="#666">
                  Get 3x more views
                </Text>
                {!loading && plans.length > 0 && (
                  <XStack gap={4} flexWrap="wrap" marginTop={2}>
                    {plans.map((p) => (
                      <XStack
                        key={p.hours}
                        backgroundColor="#f0f0f0"
                        paddingVertical={2}
                        paddingHorizontal={6}
                        borderRadius={8}
                      >
                        <Text fontSize={10} color="#666">
                          {p.label}
                        </Text>
                      </XStack>
                    ))}
                  </XStack>
                )}
              </>
            )}
          </YStack>

          <XStack
            backgroundColor={boosted ? "#4CAF50" : colors.primary}
            paddingVertical={6}
            paddingHorizontal={14}
            borderRadius={20}
            alignSelf="center"
          >
            <Text fontSize="$2" fontWeight="600" color="#fff">
              {boosted ? "Extend" : "Boost Now"}
            </Text>
          </XStack>
        </YStack>
      </Card>
    </TouchableOpacity>
  );
};

export default BoostCard;

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
