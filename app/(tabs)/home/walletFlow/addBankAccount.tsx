import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, TextInput } from "react-native";
import { YStack, Text, Button, Select } from "tamagui";
import { useRouter } from "expo-router";
import colors from "@/hooks/colors";
import { Toast } from "toastify-react-native";
import { useBankAccounts } from "@/hooks/payment/useBankAccounts";

export default function AddBankAccountScreen() {
  const router = useRouter();
  const { addAccount, isSubmitting } = useBankAccounts();

  const [holderName, setHolderName] = useState("");
  const [accountType, setAccountType] = useState("");
  const [routingNumber, setRoutingNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");

  const handleSubmit = async () => {
    if (!holderName || !accountType || !routingNumber || !accountNumber) {
      Toast.error("Please fill in all fields");
      return;
    }

    try {
      await addAccount({
        holderName,
        accountType,
        routingNumber,
        accountNumber,
      });
      Toast.success("Bank account added successfully");
      router.back();
    } catch (err) {
      Toast.error("Failed to add account. Try again.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <YStack padding="$4" gap="$3" justifyContent="center">
        <Text style={styles.header}>Connect your bank account</Text>
        <Text style={styles.subHeader}>
          This is where your withdrawals will be deposited
        </Text>

        <TextInput
          placeholder="Account holder name"
          placeholderTextColor={"gray"}
          value={holderName}
          onChangeText={setHolderName}
          style={styles.input}
        />
        <TextInput
          placeholder="Bank name"
          placeholderTextColor={"gray"}
          value={bankName}
          onChangeText={setBankName}
          style={styles.input}
        />
        {/* <Select
          value={accountType}
          onValueChange={setAccountType}
          placeholder="Select a bank account type"
        >
          <Select.Trigger style={styles.input} />
          <Select.Content>
            <Select.Item index={0} value="savings">
              <Select.ItemText>Savings</Select.ItemText>
            </Select.Item>
            <Select.Item index={1} value="current">
              <Select.ItemText>Current</Select.ItemText>
            </Select.Item>
          </Select.Content>
        </Select> */}

        {/* <TextInput
          placeholder="Routing number"
          placeholderTextColor={"gray"}
          value={routingNumber}
          onChangeText={setRoutingNumber}
          style={styles.input}
          keyboardType="numeric"
        /> */}

        <TextInput
          placeholder="Account number"
          placeholderTextColor={"gray"}
          value={accountNumber}
          onChangeText={setAccountNumber}
          style={styles.input}
          keyboardType="numeric"
        />

        <YStack
          backgroundColor="#F1F4FF"
          borderRadius={10}
          padding={12}
          marginTop={8}
        >
          <Text style={styles.infoText}>
            Your information is encrypted and stored securely according to
            Google privacy policy.
          </Text>
        </YStack>

        <Button
          backgroundColor={colors.primary}
          borderRadius={12}
          color="#fff"
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Continue"}
        </Button>
      </YStack>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffffff" },
  header: { fontSize: 20, fontWeight: "700", color: colors.primary },
  subHeader: { color: "#555", marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: "#E6E6E6",
    borderRadius: 10,
    padding: 12,
    backgroundColor: "#F8F8FA",
  },
  infoText: {
    color: "#0E0E55",
    fontSize: 13,
    textAlign: "center",
  },
});
