import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, SafeAreaView, ScrollView, Platform, StatusBar } from "react-native";
import { router } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import colors from "@/hooks/colors";
import { getSubscriptionPricing, activateSubscription } from "@/services/subscriptionApi";
import type { SubscriptionPlan } from "@/types/subscription";
import { useWalletStore } from "@/store/wallet/walletStore";
import { useAuth } from "@/hooks/useAuth";

export default function SubscriptionScreen() {
  const { user } = useAuth();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
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
      const data = await getSubscriptionPricing();
      const all = data.plans || [];
      const monthly = all.find((p) => p.interval === "MONTHLY");
      const yearly = all.find((p) => p.interval === "YEARLY");
      const filtered = [monthly, yearly].filter(Boolean) as SubscriptionPlan[];
      setPlans(filtered.length ? filtered : all);
    } catch {
      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

  const selected = plans.find((p) => p.id === selectedPlanId);
  const selectedRegion = selected?.regions?.[0];
  const currencySymbol = selectedRegion?.symbol ?? "₦";

  const handleActivate = async () => {
    if (!selectedPlanId) return;
    try {
      setActivating(true);
      const result = await activateSubscription(selectedPlanId);
      setExpiresAt(result.expiresAt);
      setSuccess(true);
      if (user?.id) fetchBalance(user.id);
    } catch (err: any) {
      console.error("[SubscriptionScreen] Activation failed:", err?.message);
    } finally {
      setActivating(false);
    }
  };

  const handleDone = () => router.back();

  if (success) {
    const formatted = expiresAt
      ? new Date(expiresAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
      : "";
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeContent}>
          <View style={styles.successContainer}>
            <View style={styles.successIconWrap}>
              <Feather name="check" size={40} color="#fff" />
            </View>
            <Text style={styles.successTitle}>Subscription Active!</Text>
            <Text style={styles.successSubtext}>
              Your plan is now active{formatted ? ` until ${formatted}` : ""}.
            </Text>
            <TouchableOpacity style={styles.doneButton} onPress={handleDone} activeOpacity={0.8}>
              <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  const monthlyPlan = plans.find((p) => p.interval === "MONTHLY");

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleDone} style={styles.backButton}>
          <Entypo name="chevron-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Subscription Plans</Text>
        <View style={styles.backButton} />
      </View>
      <SafeAreaView style={styles.safeContent}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.headline}>
            Choose a plan to stay active and connect.
          </Text>
          {loading ? (
            <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
          ) : (
            <View style={styles.plansContainer}>
              {plans.map((plan) => {
                const planRegion = plan.regions?.[0];
                const planPrice = planRegion?.price;
                const planSymbol = planRegion?.symbol ?? currencySymbol;
                const isYearly = plan.interval === "YEARLY";
                const isSelected = selectedPlanId === plan.id;
                const monthlyBreakdown = isYearly && plan.intervalCount > 0 && planPrice != null
                  ? `${planSymbol}${Math.round(planPrice / plan.intervalCount).toLocaleString()}/month`
                  : null;

                let savingsPct: number | null = null;
                if (isYearly && monthlyPlan) {
                  const mp = monthlyPlan.regions?.[0]?.price;
                  if (mp && mp > 0) {
                    savingsPct = Math.round((1 - (planPrice ?? 0) / (mp * plan.intervalCount)) * 100);
                  }
                }

                return (
                  <TouchableOpacity
                    key={plan.id}
                    style={[styles.planCard, isSelected && styles.planCardSelected, isYearly && styles.planCardYearly]}
                    onPress={() => setSelectedPlanId(plan.id)}
                    activeOpacity={0.8}
                  >
                    {isYearly && (
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>Best Value</Text>
                      </View>
                    )}
                    <View style={styles.planTop}>
                      <View style={styles.planInfo}>
                        <Text style={[styles.planLabel, isSelected && styles.planLabelSelected]}>
                          {plan.name}
                        </Text>
                        <View style={styles.radioOuter}>
                          {isSelected && <View style={styles.radioInner} />}
                        </View>
                      </View>
                      <Text style={[styles.planCost, isSelected && styles.planCostSelected]}>
                        {planPrice != null ? `${planSymbol}${planPrice.toLocaleString()}` : ""}
                      </Text>
                      {monthlyBreakdown && <Text style={styles.monthlyBreakdown}>{monthlyBreakdown}</Text>}
                    </View>
                    {savingsPct != null && savingsPct > 0 && (
                      <View style={styles.savingsBadge}>
                        <Feather name="zap" size={14} color="#fff" />
                        <Text style={styles.savingsText}>Save {savingsPct}% vs monthly</Text>
                      </View>
                    )}
                    {plan.features.filter((f) => f.enabled).length > 0 && (
                      <View style={styles.featuresSection}>
                        {plan.features.filter((f) => f.enabled).map((f) => (
                          <View key={f.key} style={styles.featureRow}>
                            <Feather name="check-circle" size={16} color={colors.primary} />
                            <Text style={styles.featureText}>{f.label}</Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
          <TouchableOpacity
            style={[styles.activateButton, (!selectedPlanId || activating) && styles.activateButtonDisabled]}
            onPress={handleActivate}
            disabled={!selectedPlanId || activating}
            activeOpacity={0.8}
          >
            {activating ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.activateButtonText}>
                {selected && selectedRegion?.price != null
                  ? `Pay ${selectedRegion.symbol ?? "₦"}${selectedRegion.price.toLocaleString()}`
                  : "Select a Plan"}
              </Text>
            )}
          </TouchableOpacity>
          <Text style={styles.footerText}>
            Your subscription helps keep SurroSantara running and ensures you get the best experience.
          </Text>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  safeContent: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "android" ? (StatusBar.currentHeight ?? 24) + 8 : 56,
    paddingBottom: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  backButton: { width: 40, height: 40, justifyContent: "center", alignItems: "center" },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#000" },
  content: { padding: 16, paddingBottom: 40 },
  headline: {
    fontSize: 14, color: "#666", textAlign: "center", lineHeight: 20,
    marginBottom: 24, marginTop: 8, paddingHorizontal: 8,
  },
  plansContainer: { gap: 16, marginBottom: 20 },
  planCard: {
    backgroundColor: "#fff", borderRadius: 16, padding: 20,
    borderWidth: 2, borderColor: "#eee", position: "relative",
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  planCardSelected: { borderColor: colors.primary, backgroundColor: "#F8F9FF" },
  planCardYearly: { borderColor: "#E8F0FE" },
  badge: {
    position: "absolute", top: -10, right: 20,
    backgroundColor: "#4CAF50", paddingHorizontal: 14, paddingVertical: 4, borderRadius: 12,
  },
  badgeText: { color: "#fff", fontSize: 12, fontWeight: "700" },
  planTop: { gap: 4 },
  planInfo: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  planLabel: { fontSize: 17, fontWeight: "700", color: "#333" },
  planLabelSelected: { color: colors.primary },
  radioOuter: {
    width: 22, height: 22, borderRadius: 11, borderWidth: 2,
    borderColor: "#ccc", justifyContent: "center", alignItems: "center",
  },
  radioInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.primary },
  planCost: { fontSize: 28, fontWeight: "800", color: "#000", marginTop: 8 },
  planCostSelected: { color: colors.primary },
  monthlyBreakdown: { fontSize: 13, color: "#888", marginTop: 2 },
  savingsBadge: {
    flexDirection: "row", alignItems: "center", gap: 6,
    backgroundColor: "#E8F5E9", paddingVertical: 6, paddingHorizontal: 12,
    borderRadius: 8, marginTop: 12, alignSelf: "flex-start",
  },
  savingsText: { fontSize: 12, fontWeight: "600", color: "#2E7D32" },
  featuresSection: { marginTop: 14, borderTopWidth: 1, borderTopColor: "#f0f0f0", paddingTop: 12 },
  featureRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 6 },
  featureText: { fontSize: 13, color: "#444", flex: 1 },
  activateButton: {
    backgroundColor: colors.primary, paddingVertical: 16, borderRadius: 25, alignItems: "center", marginBottom: 16,
  },
  activateButtonDisabled: { opacity: 0.4 },
  activateButtonText: { fontSize: 17, fontWeight: "700", color: "#fff" },
  footerText: { fontSize: 12, color: "#aaa", textAlign: "center", lineHeight: 18, paddingHorizontal: 20 },
  successContainer: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  successIconWrap: {
    width: 72, height: 72, borderRadius: 36, backgroundColor: "#4CAF50",
    justifyContent: "center", alignItems: "center", marginBottom: 20,
  },
  successTitle: { fontSize: 24, fontWeight: "700", color: "#000", marginBottom: 8 },
  successSubtext: { fontSize: 15, color: "#666", textAlign: "center", lineHeight: 22, marginBottom: 32 },
  doneButton: {
    backgroundColor: colors.primary, paddingVertical: 14, paddingHorizontal: 48, borderRadius: 25,
  },
  doneButtonText: { fontSize: 16, fontWeight: "700", color: "#fff" },
});
