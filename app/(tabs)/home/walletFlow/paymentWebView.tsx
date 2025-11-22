import React, { useState } from "react";
import { StyleSheet, ActivityIndicator} from "react-native";
import { WebView } from "react-native-webview";
import { useLocalSearchParams, useRouter } from "expo-router";
import { YStack, Text } from "tamagui";
import colors from "@/hooks/colors";
import { PaymentGateway, PaymentMode } from "@/types/payment"; 
import { SafeAreaView } from "react-native-safe-area-context";


export default function PaymentWebViewScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<Record<string, string>>();

  const paymentUrl = params.paymentUrl;
  const gateway = params.gateway as PaymentGateway;
  const mode = params.mode as PaymentMode;

  const [loading, setLoading] = useState(true);

  if (!paymentUrl) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>No payment URL provided.</Text>
      </SafeAreaView>
    );
  }

  const handleNavChange = (navState: any) => {
    const { url } = navState;

    // If backend redirects to success/failure page
    if (url.includes("payment-success")) {
      router.replace("/(tabs)/home/walletFlow/paymentSuccess");
    } else if (url.includes("payment-failure")) {
      router.replace("/(tabs)/home/walletFlow/paymentFailed");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <YStack padding="$4" paddingBottom="$2">
        <Text style={styles.header}>
          {gateway.toUpperCase()} - {mode.toUpperCase()}
        </Text>
      </YStack>

      <WebView
        source={{ uri: paymentUrl }}
        originWhitelist={["*"]}
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        onNavigationStateChange={handleNavChange}
        style={styles.webview}
      />

      {loading && (
        <YStack style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Processing payment...</Text>
        </YStack>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  webview: { flex: 1 },
  header: { fontSize: 18, fontWeight: "700", color: colors.primary },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255,255,255,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: colors.primary,
    fontWeight: "600",
  },
  errorText: { textAlign: "center", color: "red", marginTop: 40, fontSize: 16 },
});
