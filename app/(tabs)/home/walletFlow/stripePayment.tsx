import React, { useEffect, useState } from "react";
import { View, Text, Button, Alert,  } from "react-native";
import { useRouter } from "expo-router";
import {
  useStripe,
  initStripe,
  presentPaymentSheet,
} from "@stripe/stripe-react-native";
import { PrimaryButton } from "@/components/auth";

function StripePaymentScreen() {
  const router = useRouter();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
   const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Initialize Stripe
    initStripe({
      publishableKey:
        "pk_test_51SEyiXCgAbtp3GD8boTA9qTZJVJPJ0EmqdRsUC9DtVKFpFVdGjuygt6kT3DV7zLa5MNhhtM1MkuixYkgm57yaXKg00XnobUQWV",
    });
  }, []);

  const initializePayment = async () => {
    try {
      // Normally call your backend to create PaymentIntent
      const response = await fetch(
        "https://dev.surrosantara.space/api/v1/payments/topup/init",
        {
          method: "POST",
        }
      );
      const { paymentIntent, ephemeralKey, customer } = await response.json();

      const { error } = await initPaymentSheet({
        merchantDisplayName: "SurroSantara",
        paymentIntentClientSecret: paymentIntent,
        customerEphemeralKeySecret: ephemeralKey,
        customerId: customer,
        allowsDelayedPaymentMethods: true,
      });

      if (!error) {
        openPaymentSheet();
      }
    } catch (err) {
      console.log(err);
      Alert.alert("Error initializing payment");
    }
  };

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();
    if (error) {
      Alert.alert(`Error: ${error.code}`, error.message);
    } else {
      Alert.alert("Payment Successful 🎉");
      router.back();
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 20, color: "black" }}>
        Stripe Payment
      </Text>
      <PrimaryButton title="Pay with Stripe" onPress={initializePayment} />
    </View>
  );
}

export default StripePaymentScreen;
