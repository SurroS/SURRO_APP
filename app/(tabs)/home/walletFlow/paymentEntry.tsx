import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { YStack, Text, Input, Button, Spinner } from "tamagui";
import { useLocalSearchParams } from "expo-router";
import { Toast } from "toastify-react-native";
import colors from "@/hooks/colors";
import { useTypedRouter } from "@/hooks/payment/useTypedRouter";
import { initiatePaymentFrontend } from "@/services/paymentApi";
import { PaymentGateway, PaymentMode } from "@/types/payment";
import { useAuth } from "@/hooks/useAuth";

interface PaymentInitPayload {
  amount: number;
  gateway: PaymentGateway | "AUTO";
  channel: PaymentMode | "card";
  location: string;
}

interface PaymentInitResponse {
  success: boolean;
  data: {
    authorization_url: string;
    reference: string;
    gateway: string;
  };
}

export default function PaymentEntryScreen(): JSX.Element {
  const { pushWebViewScreen } = useTypedRouter();
  const params = useLocalSearchParams<Record<string, string>>();
  const { token } = useAuth();

  const gateway: PaymentGateway | "AUTO" =
    (params.gateway.toLocaleUpperCase() as PaymentGateway) || "AUTO";
  const mode: PaymentMode | "card" = (params.mode as PaymentMode) || "card";

  const [amount, setAmount] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);


  const handleProceed = async (): Promise<void> => {
  const numericAmount = parseFloat(amount);

  if (isNaN(numericAmount) || numericAmount <= 0) {
    Toast.error("Invalid amount. Please enter a valid number.");
    return;
  }

  setLoading(true);
  try {
    const payload: PaymentInitPayload = {
      amount: numericAmount,
      gateway,
      channel: mode, 
      location: "NG",
    };

    const response = await initiatePaymentFrontend(payload, token);

    console.log("Response =", response);

 
    const authorizationUrl =
      response?.authorization_url || response?.data?.authorization_url;

    if (!authorizationUrl) {
      throw new Error("Invalid payment initialization response.");
    }

    pushWebViewScreen(authorizationUrl, gateway, mode);
  } catch (err: any) {
    console.error("Payment init error:", err);
    Toast.error(
      err?.response?.data?.message ||
        "Payment error. Failed to initiate payment."
    );
  } finally {
    setLoading(false);
  }
};


  return (
    <SafeAreaView style={styles.container}>
      <YStack padding="$4">
        <Text style={styles.header}>Enter Payment Amount</Text>
      </YStack>

      <YStack style={styles.form}>
        <Text style={styles.label}>Amount (₦)</Text>
        <Input
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          style={styles.input}
          placeholder="5000"
        />

        <Button
          style={styles.button}
          onPress={handleProceed}
          disabled={loading}
        >
          {loading ? (
            <Spinner color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Proceed to Pay</Text>
          )}
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
    color: colors.black,
    backgroundColor: "#F8F8FA",
  },
  button: {
    marginTop: 20,
    backgroundColor: colors.primary,
    borderRadius: 12, 
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: { color: colors.white, fontWeight: "700", fontSize: 16, },
});
