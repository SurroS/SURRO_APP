import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { YStack, XStack, Text, Button, Card, Spinner } from "tamagui";
import { StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Banknote, Plus } from "@tamagui/lucide-icons";
import colors from "@/hooks/colors";
import { useBankAccounts } from "@/hooks/payment/useBankAccounts";
import { ScreenHeader } from "@/components/auth";

const maskAccount = (num: string): string => {
  const cleaned = num.replace(/\s/g, "");
  if (cleaned.length <= 4) return cleaned;
  return `****${cleaned.slice(-4)}`;
};

export default function BankAccountsScreen() {
  const router = useRouter();
  const { accounts, isLoading, fetchAccounts } = useBankAccounts();

  useEffect(() => {
    fetchAccounts();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <YStack padding="$4" gap="$4">
        <ScreenHeader title="Linked Bank Accounts" onBackPress={() => router.back()} />

        {isLoading ? (
          <YStack alignItems="center" justifyContent="center" flex={1}>
            <Spinner size="large" color={colors.primary} />
          </YStack>
        ) : accounts.length === 0 ? (
          <YStack alignItems="center" justifyContent="center" flex={1}>
            <Text style={styles.emptyText}>No bank account linked</Text>
            <Button
              onPress={() => router.push("/walletFlow/addBankAccount")}
              backgroundColor={colors.primary}
              color="#fff"
              borderRadius={10}
              marginTop={16}
              icon={Plus}
            >
              Link a Bank Account
            </Button>
          </YStack>
        ) : (
          <YStack gap="$3">
            {accounts.map((acct, idx) => (
              <Card
                key={idx}
                bordered
                borderColor="#E6E6E6"
                padding="$3"
                borderRadius="$4"
              >
                <XStack justifyContent="space-between" alignItems="center">
                  <YStack>
                    <Text style={styles.bankName}>{acct.bankName}</Text>
                    <Text style={styles.holderName}>{acct.holderName}</Text>
                    <Text style={styles.accountNumber}>
                      {maskAccount(acct.accountNumber)}
                    </Text>
                  </YStack>
                  <Banknote color={colors.primary} size={20} />
                </XStack>
              </Card>
            ))}

            <Button
              onPress={() => router.push("/walletFlow/addBankAccount")}
              backgroundColor={colors.primary}
              color="#fff"
              borderRadius={10}
              marginTop={12}
              icon={Plus}
            >
              Add New Account
            </Button>
          </YStack>
        )}
      </YStack>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  bankName: { fontSize: 16, fontWeight: "600", color: colors.black },
  holderName: { fontSize: 14, color: "#555", marginTop: 2 },
  accountNumber: { color: "#888", marginTop: 2, fontSize: 13 },
  emptyText: { fontSize: 15, color: "#888", textAlign: "center" },
});
