import React, { useMemo, useState } from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Text, YStack, XStack, ScrollView, View } from "tamagui";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import colors from "@/hooks/colors";
import { useAuth } from "@/hooks/useAuth";
import { useSurrogateProfile } from "@/hooks/profile/useSurrogateProfile";
import { useAgentProfile } from "@/hooks/profile/useAgentProfile";
import { useParentProfile } from "@/hooks/profile/useParentProfile";

import RecentActivitiesScreen from "@/components/wallet/RecentActivity";
import {
  allMockTransactions,
  SCREENS,
} from "@/components/wallet/DummyTransactionData";
import TransactionItem from "@/components/wallet/TransactonItem";
import { PrimaryButton } from "@/components/auth";

const WalletScreen = () => {
  const { user } = useAuth();
  const role = user?.role;

  const { surrogateProfile } = useSurrogateProfile();
  const { agentProfile } = useAgentProfile();
  const { parentProfile } = useParentProfile();

  const [isHidden, setIsHidden] = useState(false);
  const [currentScreen, setCurrentScreen] = useState(SCREENS.WALLET_SUMMARY);

  const wallet = useMemo(() => {
    if (role === "SURROGATE") return surrogateProfile?.wallet;
    if (role === "AGENT") return agentProfile?.wallet;
    if (role === "INTENDED_PARENT") return parentProfile?.wallet;
    return null;
  }, [role, surrogateProfile, agentProfile, parentProfile]);

  const totalBalance = Number(wallet?.balance ?? 0);
  const currencyCode = wallet?.currency ?? "USD";

  const displayBalance = isHidden
    ? "******"
    : `${currencyCode} ${totalBalance.toFixed(2)}`;

  const recentTransactions = allMockTransactions.slice(0, 5);

  if (currentScreen === SCREENS.RECENT_ACTIVITIES) {
    return (
      <RecentActivitiesScreen
        onBack={() => setCurrentScreen(SCREENS.WALLET_SUMMARY)}
        allTransactions={allMockTransactions}
      />
    );
  }

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

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Balance */}
        <YStack alignItems="center" marginBottom={40}>
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
              onPress={() => router.push("/home/walletFlow/paymentMethod")}
            />
            <ActionButton
              label="Withdraw"
              icon="remove"
              onPress={() => router.push("/home/walletFlow/withdrawal")}
            />
          </XStack>
        </YStack>

        {/* Transactions */}
        <View width="100%" paddingHorizontal={20}>
          <Text
            fontSize={18}
            fontWeight="600"
            marginBottom={15}
            color={colors.balanceText}
          >
            Recent Transactions
          </Text>

          <YStack>
            {recentTransactions.map((tx) => (
              <TransactionItem
                key={tx.id}
                title={tx.title}
                date={tx.dateDetails}
                amount={tx.amount}
                type={tx.type}
              />
            ))}
          </YStack>

          <PrimaryButton
            title="See all"
            onPress={() => setCurrentScreen(SCREENS.RECENT_ACTIVITIES)}
          />
        </View>

        <View height={40} />
      </ScrollView>
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
  scroll: {
    paddingBottom: 20,
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
