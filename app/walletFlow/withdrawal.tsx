import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { YStack, XStack, Text, Button, Card, Spinner } from "tamagui";
import { StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Banknote, Plus } from "@tamagui/lucide-icons";
import colors from "@/hooks/colors";
import { useBankAccounts } from "@/hooks/payment/useBankAccounts";
import { ScreenHeader } from "@/components/auth";

export default function BankAccountsScreen() {
  const router = useRouter();
  const { accounts, isLoading, fetchAccounts } = useBankAccounts();

  useEffect(() => {
    fetchAccounts();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <YStack padding="$4" gap="$4">
        <ScreenHeader title="Linked Bank Accounts" onBackPress={()=>router.back()}/>

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
              Add Bank Account
            </Button>
          </YStack>
        ) : (
          <YStack gap="$3">
            {accounts.map((acct:any, idx:any) => (
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
                    <Text style={styles.accountNumber}>
                      {acct.accountNumber} — {acct.accountType}
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
              Add Another Account
            </Button>
          </YStack>
        )}
      </YStack>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff",justifyContent:"center", alignItems:'center' },
  header: { fontSize: 20, fontWeight: "700", color: colors.primary },
  bankName: { fontSize: 16, fontWeight: "600", color: colors.black },
  accountNumber: { color: "#555", marginTop: 4 },
  emptyText: { fontSize: 15, color: "#888", textAlign: "center" },
});
