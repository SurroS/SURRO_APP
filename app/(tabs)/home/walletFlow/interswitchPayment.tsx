import React from "react";
import { WebView } from "react-native-webview";
import { View, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";

export default function InterswitchPaymentScreen() {
  const router = useRouter();
  const paymentUrl = "https://sandbox.interswitchng.com/webpay/pay";

  return (
    <View style={{ flex: 1 }}>
      <WebView
        source={{ uri: paymentUrl }}
        onNavigationStateChange={(navState) => {
          if (navState.url.includes("payment/success")) {
            router.back();
          }
        }}
        startInLoadingState
        renderLoading={() => (
          <ActivityIndicator
            size="large"
            style={{ flex: 1, justifyContent: "center" }}
          />
        )}
      />
    </View>
  );
}
