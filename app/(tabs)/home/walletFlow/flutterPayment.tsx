import React from "react";
import { View, Text, Button, Alert } from "react-native";
import { useRouter } from "expo-router";
import FlutterwaveInit from "flutterwave-react-native";

export default function FlutterwavePaymentScreen() {
  const router = useRouter();

  const handlePayment = () => {
    FlutterwaveInit({
      public_key: "FLWPUBK_TEST-xxxxxx",
      tx_ref: "tx-" + Date.now(),
      amount: 5000,
      currency: "NGN",
      payment_options: "card,banktransfer,ussd",
      customer: {
        email: "user@example.com",
        name: "John Doe",
        phonenumber: "08123456789",
      },
      customizations: {
        title: "SurroSantara Wallet Top-up",
        description: "Fund your wallet",
        logo: "https://yourapp.com/logo.png",
      },
      callback: (response:any) => {
        console.log("Payment Response:", response);
        Alert.alert("Payment complete", "Transaction successful!");
        router.back();
      },
      onclose: () => {
        console.log("Payment closed");
        router.back();
      },
    });
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>Flutterwave Payment</Text>
      <Button title="Pay with Flutterwave" onPress={handlePayment} />
    </View>
  );
}
