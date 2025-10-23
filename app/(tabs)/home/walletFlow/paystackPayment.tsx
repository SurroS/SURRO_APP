import React from "react";
import { View, Text } from "react-native";
import { PaystackWebView } from "react-native-paystack-webview";
import { useRouter } from "expo-router";

export default function PaystackPaymentScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1 }}>
      <Text style={{ textAlign: "center", marginTop: 40, fontSize: 18 }}>
        Paystack Payment
      </Text>

      <PaystackWebView
        showPayButton={true}
        paystackKey="pk_test_your_public_key"
        amount={5000} // NGN 5000
        billingEmail="user@example.com"
        billingName="John Doe"
        billingMobile="08123456789"
        activityIndicatorColor="green"
        onCancel={() => {
          console.log("Payment cancelled");
          router.back();
        }}
        onSuccess={(res:any) => {
          console.log("Payment successful: ", res);
          router.back();
        }}
        autoStart={false} // Set true if you want it to start immediately
      />
    </View>
  );
}
