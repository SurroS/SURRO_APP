// User selects payment mode

import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { YStack, XStack, Text } from "tamagui";
import { Ionicons } from "@expo/vector-icons";
import colors from "@/hooks/colors";
import { useLocalSearchParams } from "expo-router";
import { useTypedRouter } from "@/hooks/payment/useTypedRouter";
import { PaymentGateway, PaymentMode } from "@/types/payment";

// const modesByGateway: Record<PaymentGateway, PaymentMode[]> = {
//   PAYSTACK: ["card", "bank_transfer", "ussd"],
//   FLUTTERWAVE: ["card", "mobile"],
//   STRIPE: ["card"],
//   INTERSWITCH: ["card", "quickteller"],
// };
const modesByGateway: Record<PaymentGateway, PaymentMode[]> = {
  paystack: ["card", "bank_transfer", "ussd"],
  flutterwave: ["card", "mobile"],
  stripe: ["card"],
  interswitch: ["card", "quickteller"],
};

export default function PaymentModeScreen() {
  const { pushEntryScreen } = useTypedRouter();
  const params = useLocalSearchParams<Record<string, string>>();
  const gateway = params.gateway as PaymentGateway;

  const modes = modesByGateway[gateway] || [];

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Select Payment Mode</Text>
      <YStack gap="$3" paddingHorizontal={20}>
        {modes.map((mode) => (
          <TouchableOpacity
            key={mode}
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => pushEntryScreen(gateway, mode)}
          >
            <XStack alignItems="center">
              <Ionicons
                name="card"
                size={28}
                color={colors.primary}
                style={{ marginRight: 15 }}
              />
              <Text style={styles.label}>{mode.toUpperCase()}</Text>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.HEADER_ICON_GRAY}
              />
            </XStack>
          </TouchableOpacity>
        ))}
      </YStack>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  header: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.primary,
    padding: 20,
  },
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
