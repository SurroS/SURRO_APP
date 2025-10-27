import React from "react";
import {  StyleSheet, TouchableOpacity } from "react-native";
import { YStack, XStack, Text } from "tamagui";
import { Ionicons } from "@expo/vector-icons";
import colors from "@/hooks/colors";
import { useTypedRouter } from "@/hooks/payment/useTypedRouter";
import { PaymentGateway } from "@/types/payment";
import { SafeAreaView } from "react-native-safe-area-context";

const gateways: { id: PaymentGateway; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { id: "stripe", label: "Stripe", icon: "card" },
  { id: "paystack", label: "Paystack", icon: "cash" },
  { id: "flutterwave", label: "Flutterwave", icon: "card" },
  { id: "interswitch", label: "Interswitch", icon: "wallet" },
];

export default function PaymentMethodScreen() {
  const { pushModeScreen } = useTypedRouter();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Select Payment Gateway</Text>
      <YStack gap="$3" paddingHorizontal={20}>
        {gateways.map((g) => (
          <TouchableOpacity
            key={g.id}
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => pushModeScreen(g.id)}
          >
            <XStack alignItems="center">
              <Ionicons name={g.icon} size={28} color={colors.primary} style={{ marginRight: 15 }} />
              <Text style={styles.label}>{g.label}</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.HEADER_ICON_GRAY} />
            </XStack>
          </TouchableOpacity>
        ))}
      </YStack>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  header: { fontSize: 20, fontWeight: "700", color: colors.primary, padding: 20 },
  card: {
    backgroundColor: "#f9f9ffff",
    borderRadius: 12,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  label: { fontSize: 16, fontWeight: "600", color: colors.primary },
});
