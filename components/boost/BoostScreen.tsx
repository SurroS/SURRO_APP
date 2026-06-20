import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Platform,
  StatusBar,
} from "react-native";
import { router } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";
import colors from "@/hooks/colors";
import {
  getBoostPricing,
  activateBoost,
  type BoostPlan,
} from "@/services/boostApi";
import { useWalletStore } from "@/store/wallet/walletStore";
import { useAuth } from "@/hooks/useAuth";

export default function BoostScreen() {
  const { user } = useAuth();
  const [plans, setPlans] = useState<BoostPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [activating, setActivating] = useState(false);
  const [success, setSuccess] = useState(false);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const fetchBalance = useWalletStore((s) => s.fetchBalance);

  useEffect(() => {
    fetchPricing();
  }, []);

  const fetchPricing = async () => {
    try {
      setLoading(true);
      const data = await getBoostPricing();
      setPlans(data.plans || []);
    } catch {
      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

  const handleActivate = async () => {
    if (selectedPlan === null) return;
    const plan = plans[selectedPlan];
    if (!plan) return;

    try {
      setActivating(true);
      const result = await activateBoost(plan.hours);
      setExpiresAt(result.expiresAt);
      setSuccess(true);
      if (user?.id) fetchBalance(user.id);
    } catch (err: any) {
      console.error("[BoostScreen] Activation failed:", err?.message);
    } finally {
      setActivating(false);
    }
  };

  const handleDone = () => {
    router.back();
  };

  if (success) {
    const formatted = expiresAt
      ? new Date(expiresAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "";

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleDone} style={styles.backButton}>
            <Entypo name="chevron-left" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Subscriptions</Text>
          <View style={styles.backButton} />
        </View>
        <SafeAreaView style={styles.safeContent}>
          <View style={styles.successContainer}>
            <Text style={styles.successIcon}>🚀</Text>
            <Text style={styles.successTitle}>Profile Boosted!</Text>
            <Text style={styles.successSubtext}>
              Your profile is now boosted until {formatted}
            </Text>
            <TouchableOpacity
              style={styles.doneButton}
              onPress={handleDone}
              activeOpacity={0.8}
            >
              <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleDone} style={styles.backButton}>
          <Entypo name="chevron-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Subscriptions</Text>
        <View style={styles.backButton} />
      </View>

      <SafeAreaView style={styles.safeContent}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.card}>
            <Text style={styles.cardHeading}>Profile Boost</Text>

            <Text style={styles.description}>
              Get seen by more intended parents. Boosted profiles appear first
              in search and are more likely to get selected.
            </Text>

            <View style={styles.hr} />

            {loading ? (
              <ActivityIndicator
                size="large"
                color={colors.primary}
                style={{ marginTop: 20 }}
              />
            ) : (
              <View style={styles.plansContainer}>
                {plans.map((plan, index) => {
                  const isSelected = selectedPlan === index;
                  return (
                    <TouchableOpacity
                      key={plan.hours}
                      style={[
                        styles.planCard,
                        isSelected && styles.planCardSelected,
                      ]}
                      onPress={() => setSelectedPlan(index)}
                      activeOpacity={0.8}
                    >
                      <View style={styles.planLeft}>
                        <Text
                          style={[
                            styles.planLabel,
                            isSelected && styles.planLabelSelected,
                          ]}
                        >
                          {plan.label}
                        </Text>
                        <Text style={styles.planHours}>
                          {plan.hours} hours
                        </Text>
                      </View>
                      <View style={styles.planRight}>
                        <Text
                          style={[
                            styles.planCost,
                            isSelected && styles.planCostSelected,
                          ]}
                        >
                          ₦{plan.cost}
                        </Text>
                        {isSelected && (
                          <View style={styles.selectedDot}>
                            <Entypo name="check" size={14} color="#fff" />
                          </View>
                        )}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}

            <TouchableOpacity
              style={[
                styles.activateButton,
                (selectedPlan === null || activating) &&
                  styles.activateButtonDisabled,
              ]}
              onPress={handleActivate}
              disabled={selectedPlan === null || activating}
              activeOpacity={0.8}
            >
              {activating ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.activateButtonText}>
                  {selectedPlan !== null
                    ? `Pay ₦${plans[selectedPlan]?.cost ?? 0}`
                    : "Select a Plan"}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  safeContent: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop:
      Platform.OS === "android"
        ? (StatusBar.currentHeight ?? 24) + 8
        : 56,
    paddingBottom: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
  },
  content: {
    padding: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeading: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
    textAlign: "center",
    marginBottom: 16,
  },
  description: {
    fontSize: 14,
    color: "#666",
    lineHeight: 22,
    textAlign: "center",
    marginBottom: 16,
  },
  hr: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginBottom: 20,
  },
  plansContainer: {
    gap: 12,
    marginBottom: 24,
  },
  planCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#f9f9f9",
    borderWidth: 1.5,
    borderColor: "#eee",
  },
  planCardSelected: {
    backgroundColor: "#F0F8FF",
    borderColor: colors.primary,
  },
  planLeft: {
    gap: 4,
  },
  planLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
  planLabelSelected: {
    color: colors.primary,
  },
  planHours: {
    fontSize: 13,
    color: "#999",
  },
  planRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  planCost: {
    fontSize: 18,
    fontWeight: "800",
    color: "#333",
  },
  planCostSelected: {
    color: colors.primary,
  },
  selectedDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  activateButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: "center",
  },
  activateButtonDisabled: {
    opacity: 0.4,
  },
  activateButtonText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#fff",
  },
  successContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  successIcon: {
    fontSize: 56,
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000",
    marginBottom: 8,
  },
  successSubtext: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 32,
  },
  doneButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 25,
  },
  doneButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
});
