import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Text, YStack, Button } from "tamagui";
import { useRouter } from "expo-router";
import colors from "@/hooks/colors";

export default function PaymentFailedScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <YStack alignItems="center" paddingHorizontal={20} paddingTop={60}>
        <YStack style={styles.iconContainer}>
          <Ionicons name="close" size={40} color={colors.white} />
        </YStack>
        <Text style={styles.title}>Payment Failed</Text>
        <Text style={styles.message}>
          We were unable to process your payment. Please try again.
        </Text>
        <Button
          style={styles.button}
          onPress={() => router.replace("/walletFlow")}
        >
          <Text style={styles.buttonText}>Back to Wallet</Text>
        </Button>
      </YStack>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.danger,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.headerText,
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.secondaryGray,
    textAlign: "center",
    paddingHorizontal: 40,
    marginBottom: 30,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  buttonText: { color: colors.white, fontWeight: "700", fontSize: 16 },
});
