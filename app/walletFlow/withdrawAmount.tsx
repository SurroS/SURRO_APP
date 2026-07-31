import React, { useState } from "react";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { YStack, XStack, Text, Button, Spinner } from "tamagui";
import { StyleSheet, TextInput, Modal, View } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ArrowLeft, Banknote, X } from "@tamagui/lucide-icons";
import { Toast } from "toastify-react-native";
import { ToastType } from "toastify-react-native/utils/interfaces";
import colors from "@/hooks/colors";
import { useAuth } from "@/hooks/useAuth";
import { useWalletStore } from "@/store/wallet/walletStore";
import { withdrawWallet } from "@/services/walletApi";

export default function WithdrawAmountScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<Record<string, string>>();
  const accountId = params.accountId!;
  const bankName = params.bankName ?? "";
  const holderName = params.holderName ?? "";
  const accountNumber = params.accountNumber ?? "";

  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const balance = useWalletStore((s) => s.balance);
  const fetchWallet = useWalletStore((s) => s.fetchWallet);
  const [amount, setAmount] = useState("");
  const [showReceipt, setShowReceipt] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const numericAmount = parseFloat(amount) || 0;
  const fee = 0;
  const total = numericAmount + fee;
  const exceedsBalance = total > balance;
  const valid = numericAmount > 0 && !exceedsBalance;

  const maskAccount = (num: string): string => {
    const cleaned = num.replace(/\s/g, "");
    if (cleaned.length <= 5) return cleaned;
    return `${cleaned[0]}****${cleaned.slice(-4)}`;
  };

  const handleConfirm = async () => {
    if (!user?.id) return;
    setSubmitting(true);
    try {
      const withdrawRes = await withdrawWallet(accountId, numericAmount);
      await fetchWallet();
      setShowReceipt(false);
      Toast.show({ text1: "Withdrawal initiated successfully", type: "customSuccess" as ToastType });
      router.back();
    } catch (err: any) {
      setShowReceipt(false);
      Toast.show({
        text1: "Withdrawal Failed",
        text2: err?.response?.data?.message ?? err?.message ?? "Please try again",
        type: "customError" as ToastType,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <YStack flex={1} backgroundColor="#fff" padding="$4">
        <XStack alignItems="center" gap="$2" marginBottom="$4">
          <Button
            chromeless
            padding={0}
            onPress={() => router.back()}
            icon={<ArrowLeft size={24} color={colors.black} />}
          />
          <Text style={styles.header}>Withdraw</Text>
        </XStack>

        {/* Bank account info */}
        <YStack backgroundColor="#F8F8FA" borderRadius={12} padding="$3" marginBottom="$4">
          <XStack alignItems="center" gap="$2">
            <Banknote size={20} color={colors.primary} />
            <Text style={styles.bankName}>{bankName}</Text>
          </XStack>
          <Text style={styles.holderName}>{holderName}</Text>
          <Text style={styles.accountNumber}>{maskAccount(accountNumber)}</Text>
        </YStack>

        {/* Balance display */}
        <XStack justifyContent="space-between" marginBottom="$2">
          <Text style={styles.label}>Available Balance</Text>
          <Text style={styles.balance}>NGN {balance.toLocaleString()}</Text>
        </XStack>

        {/* Amount input */}
        <Text style={styles.label}>Amount</Text>
        <TextInput
          style={[styles.input, exceedsBalance && styles.inputError]}
          placeholder="0.00"
          placeholderTextColor="#999"
          keyboardType="decimal-pad"
          value={amount}
          onChangeText={setAmount}
        />
        {exceedsBalance && (
          <Text style={styles.errorText}>Amount exceeds available balance</Text>
        )}

        {/* Withdraw button */}
        <Button
          backgroundColor={valid ? colors.primary : "#CCC"}
          borderRadius={12}
          color="#fff"
          marginTop="auto"
          marginBottom="$4"
          onPress={() => setShowReceipt(true)}
          disabled={!valid}
          opacity={valid ? 1 : 0.6}
        >
          {`Withdraw NGN ${numericAmount.toLocaleString()}`}
        </Button>
      </YStack>

      {/* Receipt confirmation modal */}
      <Modal visible={showReceipt} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={[styles.modal, { paddingBottom: 16 + insets.bottom }]}>
            <XStack justifyContent="space-between" alignItems="center" marginBottom="$4">
              <Text style={styles.modalTitle}>Confirm Withdrawal</Text>
              <Button
                chromeless
                padding={0}
                onPress={() => setShowReceipt(false)}
              >
                <X size={22} color="#999" />
              </Button>
            </XStack>

            <YStack gap="$2">
              {/* Amount */}
              <XStack justifyContent="space-between">
                <Text style={styles.receiptLabel}>Amount</Text>
                <Text style={styles.receiptValue}>NGN {numericAmount.toLocaleString()}</Text>
              </XStack>

              {/* Fee */}
              <XStack justifyContent="space-between">
                <Text style={styles.receiptLabel}>Fee</Text>
                <Text style={styles.receiptValue}>NGN {fee.toLocaleString()}</Text>
              </XStack>

              <View style={styles.divider} />

              {/* Total */}
              <XStack justifyContent="space-between">
                <Text style={styles.receiptLabelBold}>Total</Text>
                <Text style={styles.receiptValueBold}>NGN {total.toLocaleString()}</Text>
              </XStack>

              {/* Bank details */}
              <View style={styles.divider} />
              <Text style={styles.sectionLabel}>Beneficiary</Text>
              <Text style={styles.beneficiaryName}>{holderName}</Text>
              <Text style={styles.beneficiaryDetail}>{bankName}</Text>
              <Text style={styles.beneficiaryDetail}>{maskAccount(accountNumber)}</Text>
            </YStack>

            <XStack gap="$3" marginTop="$4">
              <Button
                flex={1}
                backgroundColor="#F0F0F0"
                borderRadius={12}
                color="#555"
                onPress={handleConfirm}
                disabled={submitting}
                opacity={submitting ? 0.6 : 1}
              >
                {submitting ? <Spinner size="small" color="#fff" /> : "Confirm"}
              </Button>
              <Button
                flex={1}
                backgroundColor={colors.primary}
                borderRadius={12}
                color="#fff"
                onPress={() => setShowReceipt(false)}
                disabled={submitting}
                opacity={submitting ? 0.6 : 1}
              >
                Cancel
              </Button>
            </XStack>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { fontSize: 20, fontWeight: "700", color: colors.black, flex: 1 },
  bankName: { fontSize: 16, fontWeight: "600", color: colors.black },
  holderName: { fontSize: 14, color: "#555", marginTop: 2 },
  accountNumber: { color: "#888", marginTop: 2, fontSize: 14, letterSpacing: 1 },
  label: { fontSize: 14, fontWeight: "500", color: "#555", marginBottom: 6 },
  balance: { fontSize: 16, fontWeight: "700", color: colors.black },
  input: {
    borderWidth: 1,
    borderColor: "#E6E6E6",
    borderRadius: 10,
    padding: 14,
    fontSize: 24,
    fontWeight: "700",
    color: colors.black,
    backgroundColor: "#F8F8FA",
    textAlign: "center",
    marginBottom: 4,
  },
  inputError: {
    borderColor: "#E63946",
    borderWidth: 1.5,
  },
  errorText: {
    color: "#E63946",
    fontSize: 12,
    marginLeft: 4,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modal: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    width: "100%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.black,
  },
  receiptLabel: {
    fontSize: 14,
    color: "#888",
  },
  receiptValue: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.black,
  },
  receiptLabelBold: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.black,
  },
  receiptValueBold: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.black,
  },
  divider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginVertical: 4,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#999",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginTop: 4,
  },
  beneficiaryName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.black,
    marginTop: 4,
  },
  beneficiaryDetail: {
    fontSize: 14,
    color: "#555",
    marginTop: 2,
  },
});
