import React, { useMemo, useState, useCallback } from "react";
import { TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { Text, YStack, XStack, ScrollView, View } from "tamagui";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useFocusEffect } from "expo-router";

import colors from "@/hooks/colors";
import { useAuth } from "@/hooks/useAuth";
import { useSurrogateProfile } from "@/hooks/profile/useSurrogateProfile";
import { useAgentProfile } from "@/hooks/profile/useAgentProfile";
import { useParentProfile } from "@/hooks/profile/useParentProfile";
import { useWalletStore } from "@/store/wallet/walletStore";
import { WalletTransactionData } from "@/types/walletTypes";

import TransactionItem from "@/components/wallet/TransactonItem";

const formatDate = (iso: string): string => {
  const d = new Date(iso);
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

const WalletScreen = () => {
  const { user } = useAuth();
  const role = user?.role;

  const { surrogateProfile } = useSurrogateProfile();
  const { agentProfile } = useAgentProfile();
  const { parentProfile } = useParentProfile();

  const { balance: storeBalance, transactions, fetchBalance, fetchWallet, loading } = useWalletStore();

  const [isHidden, setIsHidden] = useState(true);

  const profileWallet = useMemo(() => {
    if (role === "SURROGATE") return surrogateProfile?.wallet;
    if (role === "AGENT") return agentProfile?.wallet;
    if (role === "INTENDED_PARENT") return parentProfile?.wallet;
    return null;
  }, [role, surrogateProfile, agentProfile, parentProfile]);

  const totalBalance = Number(storeBalance ?? profileWallet?.balance ?? 0);
  const currencyCode = profileWallet?.currency ?? "NGN";

  const displayBalance = isHidden
    ? "******"
    : `${currencyCode} ${totalBalance.toFixed(2)}`;

  // Fetch wallet on every focus
  useFocusEffect(
    useCallback(() => {
      fetchWallet()
        .catch((err) => console.error("[WalletScreen] Wallet fetch error:", err));
      if (user?.id) {
        fetchBalance(user.id)
          .catch((err) => console.error("[WalletScreen] Balance fetch error:", err));
      }
    }, [user?.id, fetchWallet, fetchBalance])
  );

  const mapTx = (tx: WalletTransactionData) => ({
    id: tx.id,
    title: tx.description || (tx.type === "CREDIT" ? "Credit" : "Debit"),
    date: formatDate(tx.createdAt),
    amount: tx.amount,
    type: tx.type === "CREDIT" ? "credit" : "debit",
    status: tx.status,
    gateway: tx.gateway,
  });

  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const mappedTransactions = sortedTransactions.map(mapTx);

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <XStack paddingHorizontal={20} marginBottom={10}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons
            name="chevron-back"
            size={24}
            color={colors.HEADER_ICON_GRAY}
          />
        </TouchableOpacity>
      </XStack>

      <YStack flex={1} paddingHorizontal={20}>
        {/* Balance - static */}
        <YStack alignItems="center" marginBottom={24}>
          <Text fontSize={20} fontWeight="600" color={colors.balanceText}>
            {currencyCode} Wallet
          </Text>

          <XStack alignItems="center" marginTop={8}>
            <Text fontSize={18} color={colors.secondaryGray} marginRight={6}>
              Total Balance
            </Text>
            <TouchableOpacity onPress={() => setIsHidden(!isHidden)}>
              <Ionicons
                name={isHidden ? "eye-off-outline" : "eye-outline"}
                size={18}
                color={colors.secondaryGray}
              />
            </TouchableOpacity>
          </XStack>

          <Text
            fontSize={33}
            fontWeight="bold"
            color={colors.balanceText}
            marginTop={6}
          >
            {displayBalance}
          </Text>

          {/* Actions */}
          <XStack gap="$12" marginTop={24}>
            <ActionButton
              label="Top up"
              icon="add"
              onPress={() => {
                router.push("/walletFlow/paymentMethod");
              }}
            />
            <ActionButton
              label="Withdraw"
              icon="remove"
              onPress={() => {
                router.push("/walletFlow/withdrawal");
              }}
            />
          </XStack>
        </YStack>

        {/* Transactions heading */}
        <Text
          fontSize={18}
          fontWeight="600"
          marginBottom={12}
          color={colors.balanceText}
        >
          Recent Transactions
        </Text>

        {/* Transaction list - independently scrollable */}
        {loading ? (
          <YStack flex={1} justifyContent="center" alignItems="center">
            <ActivityIndicator
              size="small"
              color={colors.HEADER_ICON_GRAY}
            />
          </YStack>
        ) : mappedTransactions.length === 0 ? (
          <YStack flex={1} alignItems="center" justifyContent="center">
            <Ionicons
              name="receipt-outline"
              size={48}
              color={colors.secondaryGray}
            />
            <Text
              fontSize={16}
              fontWeight="600"
              color={colors.secondaryGray}
              marginTop={12}
            >
              No transactions yet
            </Text>
            <Text fontSize={14} color={colors.secondaryGray} marginTop={4}>
              Your transactions will appear here
            </Text>
          </YStack>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            {mappedTransactions.map((tx) => (
              <TransactionItem
                key={tx.id}
                title={tx.title}
                date={tx.date}
                amount={tx.amount}
                type={tx.type}
                status={tx.status}
                gateway={tx.gateway}
              />
            ))}
          </ScrollView>
        )}
      </YStack>
    </SafeAreaView>
  );
};

const ActionButton = ({
  label,
  icon,
  onPress,
}: {
  label: string;
  icon: any;
  onPress: () => void;
}) => (
  <YStack alignItems="center">
    <TouchableOpacity style={styles.actionButton} onPress={onPress}>
      <Ionicons name={icon} size={24} color="#fff" />
    </TouchableOpacity>
    <Text
      fontSize={14}
      color={colors.secondaryGray}
      marginTop={6}
      fontWeight="600"
    >
      {label}
    </Text>
  </YStack>
);

export default WalletScreen;

/* ---------- Styles ---------- */
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.white,
    paddingVertical: 10,
  },
  actionButton: {
    width: 50,
    height: 50,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.ACTION_NAVY_BLUE,
  },
});
