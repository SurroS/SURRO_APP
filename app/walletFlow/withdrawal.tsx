import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { YStack, XStack, Text, Button, Card, Spinner, ScrollView } from "tamagui";
import { StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Banknote, Plus, Trash2, CheckCircle, Pencil } from "@tamagui/lucide-icons";
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
  const { accounts, isLoading, fetchAccounts, setDefault, remove } = useBankAccounts();
  const [actionId, setActionId] = useState<string | null>(null);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleSetDefault = async (id: string) => {
    setActionId(id);
    try {
      await setDefault(id);
    } catch {
      Alert.alert("Error", "Failed to set as default");
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = (acct: { id: string; bankName: string }) => {
    Alert.alert(
      "Remove Account",
      `Remove ${acct.bankName} account?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            setActionId(acct.id);
            try {
              await remove(acct.id);
            } catch {
              Alert.alert("Error", "Failed to remove account");
            } finally {
              setActionId(null);
            }
          },
        },
      ],
    );
  };

  const handleEdit = (acct: typeof accounts[0]) => {
    router.push({
      pathname: "/walletFlow/addBankAccount",
      params: {
        accountId: acct.id,
        holderName: acct.holderName,
        bankName: acct.bankName,
        accountNumber: acct.accountNumber,
        bankCode: acct.bankCode,
      },
    });
  };

  const renderCard = (acct: typeof accounts[0]) => {
    return (
      <Card
        key={acct.id}
        bordered
        borderColor={acct.isDefault ? colors.primary : "#E6E6E6"}
        padding="$3"
        borderRadius="$4"
        backgroundColor="#fff"
        marginBottom="$3"
      >
        <XStack justifyContent="space-between" alignItems="center">
          <TouchableOpacity activeOpacity={0.7} onPress={() => handleEdit(acct)} style={{ flex: 1 }}>
            <YStack>
              <XStack alignItems="center" gap="$2">
                <Text style={styles.bankName}>{acct.bankName}</Text>
                {acct.isDefault && (
                  <XStack
                    backgroundColor={colors.primary}
                    borderRadius={4}
                    paddingHorizontal={6}
                    paddingVertical={2}
                    alignItems="center"
                    gap={4}
                  >
                    <CheckCircle size={12} color="#fff" />
                    <Text style={styles.defaultBadge}>Default</Text>
                  </XStack>
                )}
              </XStack>
              <Text style={styles.holderName}>{acct.holderName}</Text>
              <Text style={styles.accountNumber}>
                {maskAccount(acct.accountNumber)}
              </Text>
            </YStack>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleDelete(acct)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} style={{ paddingLeft: 12 }}>
            <Trash2 size={18} color="#E63946" />
          </TouchableOpacity>
        </XStack>
      </Card>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <YStack flex={1} backgroundColor="#fff">
        <YStack padding="$4">
          <ScreenHeader title="Linked Bank Accounts" onBackPress={() => router.back()} />
        </YStack>

        {isLoading ? (
          <YStack alignItems="center" justifyContent="center" flex={1}>
            <Spinner size="large" color={colors.primary} />
          </YStack>
        ) : accounts.length === 0 ? (
          <YStack alignItems="center" justifyContent="center" flex={1} padding="$4">
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
          <ScrollView flex={1} paddingHorizontal="$4" contentContainerStyle={{ paddingBottom: 100 }}>
            {accounts.map(renderCard)}
          </ScrollView>
        )}

        {accounts.length > 0 && (
          <YStack padding="$4" borderTopWidth={1} borderTopColor="#F0F0F0" backgroundColor="#fff">
            <Button
              onPress={() => router.push("/walletFlow/addBankAccount")}
              backgroundColor={colors.primary}
              color="#fff"
              borderRadius={10}
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
  defaultBadge: { fontSize: 10, fontWeight: "700", color: "#fff" },
  emptyText: { fontSize: 15, color: "#888", textAlign: "center" },
});
