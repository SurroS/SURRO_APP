import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { Text, YStack,XStack } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import colors from '@/hooks/colors';
import { router,} from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import RecentActivitiesScreen from '@/components/wallet/RecentActivity';
import { useNavigation } from 'expo-router';
import { useState } from 'react';
import { ScrollView,  } from 'tamagui';
import { allMockTransactions,SCREENS } from '@/components/wallet/dummyTransactonData';
import { PrimaryButton } from '@/components/auth';
import TransactionItem from '@/components/wallet/TransactonItem'

const WalletScreen = () => {
  const navigation = useNavigation();
    const [isHidden, setIsHidden] = useState(false);
    const [currentScreen, setCurrentScreen] = useState(SCREENS.WALLET_SUMMARY);
    const totalBalance = 10000;
    const currencyCode = 'USD';
    const displayBalance = isHidden
        ? '******'
        : `$${totalBalance.toLocaleString('en-US')}`;

    const toggleBalanceVisibility = () => setIsHidden(!isHidden);

    // Filter transactions for the summary screen (e.g., top 5)
    // We'll use the top 5 transactions from the mock data to populate the summary
    const recentTransactions = allMockTransactions.slice(0, 5);


    // --- SCREEN NAVIGATION LOGIC ---g it 

    // 1. Recent Activities Screen
    if (currentScreen === SCREENS.RECENT_ACTIVITIES)
        return (
            <RecentActivitiesScreen
                onBack={() => setCurrentScreen(SCREENS.WALLET_SUMMARY)}
                allTransactions={allMockTransactions}
            />
        );



    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.white, paddingVertical:10,
        }}>
          <XStack
                    width="100%"
                    paddingHorizontal={20}
                    marginBottom={10}
                    alignItems="center"
                >
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons
                            name="chevron-back"
                            size={24}
                            color={colors.HEADER_ICON_GRAY}
                        />
                    </TouchableOpacity>
                </XStack>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                

                <YStack  marginBottom={40} justifyContent='center' alignItems="center">
                    <XStack  marginBottom={8}>
                        <Text fontSize={16} marginRight={6}>
                            US
                        </Text>
                        <Text fontSize={16} fontWeight="500" color={colors.balanceText}>
                            {currencyCode} Account
                        </Text>
                    </XStack>

                    <XStack  marginBottom={4}>
                        <Text fontSize={18} color={colors.secondaryGray} marginRight={5}>
                            Total Balance
                        </Text>
                        <TouchableOpacity onPress={toggleBalanceVisibility}>
                            <Ionicons
                                name={isHidden ? 'eye-off-outline' : 'eye-outline'}
                                size={18}
                                color={colors.secondaryGray}
                            />
                        </TouchableOpacity>
                    </XStack>

                    <XStack  gap={4} justifyContent='center'alignItems='center' paddingVertical={4}>
                        <Text fontSize={48} fontWeight="bold" color={colors.balanceText}>
                            {displayBalance}
                        </Text>
                        {!isHidden && (
                            <Text
                                fontSize={20}
                                fontWeight="600"
                                color={colors.secondaryGray}
                            >
                                {currencyCode}
                            </Text>
                        )}
                    </XStack>

                    <XStack gap={'$12'} marginTop={20}>
                        <YStack alignItems="center">
                            <TouchableOpacity
                                style={[
                                    styles.actionButton,
                                    { backgroundColor: colors.ACTION_NAVY_BLUE },
                                ]}
                                onPress={() => router.push("/home/walletFlow/paymentMethod")}
                            >
                                <Ionicons name="add" size={24} color="#FFFFFF" />
                            </TouchableOpacity>
                            <Text fontSize={14} color={colors.secondaryGray} marginTop={6} fontWeight={600}>
                                Top up
                            </Text>
                        </YStack>

                        <YStack alignItems="center">
                            <TouchableOpacity
                                style={[
                                    styles.actionButton,
                                    { backgroundColor: colors.ACTION_NAVY_BLUE },
                                ]}
                                onPress={()=>router.push("/home/walletFlow/withdrawal")}
                            >
                                <Ionicons name="remove" size={24} color="#FFFFFF" />
                            </TouchableOpacity>
                            <Text fontSize={14} color={colors.secondaryGray} marginTop={6} fontWeight={600}>
                                Withdraw
                            </Text>
                        </YStack>
                    </XStack>
                </YStack>

                {/* RECENT TRANSACTIONS LIST */}
                <View style={{ width: '100%', paddingHorizontal: 20 }}>
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
                          title='see all'
                          onPress={() => setCurrentScreen(SCREENS.RECENT_ACTIVITIES)}
                          />
                    
                </View>
                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
  );
};

export default WalletScreen;

const styles = StyleSheet.create({
  container: {
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accountText: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: '500',
    color:"black"
  },
  balanceText: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 30,
    color:"black"
  },
  actions: {
    flexDirection: 'row',
    gap: 20,
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    width: 60,
    height: 60,
    backgroundColor: colors.secondaryGray,
  },
  actionLabel: {
    marginTop: 8,
    fontSize: 12,
    color:"black"
  },
  scrollContainer: {alignItems: 'center', justifyContent:"center" }
});
