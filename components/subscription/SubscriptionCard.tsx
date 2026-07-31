import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Card, Text, XStack, YStack } from "tamagui";
import { router } from "expo-router";
import { getSubscriptionPricing, getSubscriptionStatus } from "@/services/subscriptionApi";
import type { SubscriptionPlan } from "@/types/subscription";
import colors from "@/hooks/colors";

const SubscriptionCard = ({ style }: { style?: any }) => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [subscribed, setSubscribed] = useState(false);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [pricing, status] = await Promise.all([
        getSubscriptionPricing(),
        getSubscriptionStatus(),
      ]);
      setPlans(pricing.plans.slice(0, 3));
      if (status?.isSubscribed) {
        setSubscribed(true);
        setExpiresAt(status.expiresAt ?? null);
      }
    } catch {
      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePress = () => {
    router.push("/subscriptionScreen");
  };

  const formatRemaining = (expires: string) => {
    const remaining = new Date(expires).getTime() - Date.now();
    if (remaining <= 0) return "Expired";
    const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
    if (days > 30) return `${Math.floor(days / 30)}mo ${days % 30}d left`;
    return `${days}d remaining`;
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
            <Text fontSize={20}>🏷️</Text>
            <Text fontSize="$3" fontWeight="600" color="#0E0E55">
              Subscription
            </Text>
          </XStack>
          <YStack flex={1} justifyContent="center" gap="$1">
            {subscribed ? (
              <>
                <Text fontSize="$2" fontWeight="600" color={colors.primary}>
                  ✅ Subscribed
                </Text>
                {expiresAt && (
                  <Text fontSize="$2" color="#666">
                    {formatRemaining(expiresAt)}
                  </Text>
                )}
                <Text fontSize="$2" color={colors.primary} textDecorationLine="underline">
                  Tap to manage
                </Text>
              </>
            ) : (
              <>
                <Text fontSize="$2" color="#666">
                  Subscribe to unlock features
                </Text>
                {!loading && plans.length > 0 && (
                  <XStack gap={4} flexWrap="wrap" marginTop={2}>
                    {plans.map((p) => (
                      <XStack
                        key={p.id}
                        backgroundColor="#f0f0f0"
                        paddingVertical={2}
                        paddingHorizontal={6}
                        borderRadius={8}
                      >
                        <Text fontSize={10} color="#666">
                          {p.name}
                        </Text>
                      </XStack>
                    ))}
                  </XStack>
                )}
              </>
            )}
          </YStack>
          <XStack
            backgroundColor={subscribed ? "#4CAF50" : colors.primary}
            paddingVertical={6}
            paddingHorizontal={14}
            borderRadius={20}
            alignSelf="center"
          >
            <Text fontSize="$2" fontWeight="600" color="#fff">
              {subscribed ? "Manage" : "Subscribe Now"}
            </Text>
          </XStack>
        </YStack>
      </Card>
    </TouchableOpacity>
  );
};

export default SubscriptionCard;

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
