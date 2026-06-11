import React, { useState, useRef } from "react";
import { StyleSheet, ActivityIndicator} from "react-native";
import { WebView } from "react-native-webview";
import { useLocalSearchParams, useRouter } from "expo-router";
import { YStack, Text } from "tamagui";
import colors from "@/hooks/colors";
import { PaymentGateway, PaymentMode } from "@/types/payment";
import { verifyPayment } from "@/services/paymentApi";
import { SafeAreaView } from "react-native-safe-area-context";


export default function PaymentWebViewScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<Record<string, string>>();

  const paymentUrl = params.paymentUrl;
  const gateway = params.gateway as PaymentGateway;
  const mode = params.mode as PaymentMode;
  const reference = params.reference;

  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const verifiedRef = useRef(false);

  if (!paymentUrl) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>No payment URL provided.</Text>
      </SafeAreaView>
    );
  }

  const handleNavChange = (navState: any) => {
    const { url } = navState;
    console.log("[PaymentWebView] Navigation:", url);

    if (url.includes("reference=") && !verifiedRef.current) {
      verifiedRef.current = true;
      setVerifying(true);

      const refMatch = url.match(/[?&]reference=([^&]+)/);
      const extractedRef = refMatch ? decodeURIComponent(refMatch[1]) : reference;

      console.log("[PaymentWebView] Paystack redirect detected, verifying ref:", extractedRef);
      verifyPayment(extractedRef)
        .then((res) => {
          console.log("[PaymentWebView] Verification successful:", JSON.stringify(res, null, 2));
          setVerifying(false);
          router.replace("/walletFlow/paymentSuccess");
        })
        .catch((err) => {
          console.error("[PaymentWebView] Verification failed:", err?.response?.data || err?.message || err);
          setVerifying(false);
          router.replace("/walletFlow/paymentFailed");
        });
    } else if (url.includes("payment-failure") && !verifiedRef.current) {
      console.log("[PaymentWebView] Payment failed, redirecting");
      router.replace("/walletFlow/paymentFailed");
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
        onLoadStart={() => !verifying && setLoading(true)}
        onLoadEnd={() => !verifying && setLoading(false)}
        onNavigationStateChange={handleNavChange}
        style={styles.webview}
      />

      {(loading || verifying) && (
        <YStack style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>
            {verifying ? "Verifying payment..." : "Processing payment..."}
          </Text>
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
