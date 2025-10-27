import React, { useState } from "react";
import {  StyleSheet, Alert } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { YStack, XStack, Text, Input, Button, Spinner } from "tamagui";
import colors from "@/hooks/colors";
import { useTypedRouter } from "@/hooks/payment/useTypedRouter";
import { PaymentGateway, PaymentMode } from "@/types/payment";
import { SafeAreaView } from "react-native-safe-area-context";
import { Toast } from "toastify-react-native";
import { initiatePaymentFrontend } from "@/services/paymentApi";

// Mock backend call
const initiatePayment = async (
  gateway: PaymentGateway,
  mode: PaymentMode,
  amount: number,
  email: string,
  card?: { number: string; exp: string; cvv: string }
) => {
  // backend returns WebView URL
  return `https://payment-gateway.example.com/checkout?gateway=${gateway}&mode=${mode}&amount=${amount}&email=${encodeURIComponent(email)}`;
};

export default function PaymentEntryScreen() {
  const { pushWebViewScreen } = useTypedRouter();
  const params = useLocalSearchParams<Record<string, string>>();
  const gateway = params.gateway as PaymentGateway;
  const mode = params.mode as PaymentMode;

  const [amount, setAmount] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [cardNumber, setCardNumber] = useState<string>("");
  const [expiry, setExpiry] = useState<string>("");
  const [cvv, setCvv] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleProceed = async () => {
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      Toast.error("Invalid Amount, Please enter a valid amount.");
      return;
    }
    if (!email.includes("@")) {
      Toast.error("Invalid Email, Please enter a valid email address.");
      return;
    }

    // If card payment, validate card fields
    if (mode === "card") {
      if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ""))) {
        return Toast.error("Invalid Card Number, Card number must be 16 digits.");
      }
      if (!/^\d{2}\/\d{2}$/.test(expiry)) {
        return Toast.error("Invalid Expiry,Expiry must be MM/YY.");
      }
      if (!/^\d{3,4}$/.test(cvv)) {
        return Toast.error("Invalid CVV, CVV must be 3 or 4 digits.");
      }
    }

    setLoading(true);
    try {
      const paymentUrl = await initiatePayment(gateway, mode, numericAmount, email, 
        mode === "card" ? { number: cardNumber, exp: expiry, cvv } : undefined
      );

      pushWebViewScreen(paymentUrl, gateway, mode);
    } catch {
      Toast.error("Payment Error, Failed to initiate payment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <YStack padding="$4">
        <Text style={styles.header}>Enter Payment Details</Text>
      </YStack>

      <YStack style={styles.form}>
        <Text style={styles.label}>Email</Text>
        <Input
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          style={styles.input}
        />

        <Text style={styles.label}>Amount</Text>
        <Input
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          style={styles.input}
        />

        {mode === "card" && (
          <>
            <Text style={styles.label}>Card Number</Text>
            <Input
              value={cardNumber}
              onChangeText={setCardNumber}
              keyboardType="numeric"
              placeholder="1234 5678 9012 3456"
              style={styles.input}
            />

            <XStack gap="$3">
              <YStack flex={1}>
                <Text style={styles.label}>Expiry (MM/YY)</Text>
                <Input
                  value={expiry}
                  onChangeText={setExpiry}
                  placeholder="MM/YY"
                  style={styles.input}
                />
              </YStack>
              <YStack flex={1}>
                <Text style={styles.label}>CVV</Text>
                <Input
                  value={cvv}
                  onChangeText={setCvv}
                  placeholder="123"
                  keyboardType="numeric"
                  style={styles.input}
                />
              </YStack>
            </XStack>
          </>
        )}

        <Button style={styles.button} onPress={handleProceed} disabled={loading}>
          {loading ? <Spinner color="#fff" /> : <Text style={styles.buttonText}>Proceed to Pay</Text>}
        </Button>
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
    marginBottom: 20,
  },
  form: { paddingHorizontal: 20 },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.black,
    marginTop: 10,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.black,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
    color:colors.black
  },
  button: {
    marginTop: 20,
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: { color: colors.white, fontWeight: "700", fontSize: 16 },
});
