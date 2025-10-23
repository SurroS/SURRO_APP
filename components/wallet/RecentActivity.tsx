import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, Text, XStack, YStack } from 'tamagui';
import TransactionItem from '@/components/wallet/TransactonItem';
import colors from '@/hooks/colors';

// Define the structure of a single transaction
export interface Transaction {
  id: string;
  title: string;
  date: string;          // e.g. "28-09-2025"
  dateDetails?: string;  // e.g. "Today", "Yesterday"
  amount: number;
  type: any; // or string if you allow more
  iconName?: string;     // Optional icon name
}

// Define props for the screen
interface RecentActivitiesScreenProps {
  onBack: () => void;
  allTransactions: Transaction[];
}

const RecentActivitiesScreen: React.FC<RecentActivitiesScreenProps> = ({
  onBack,
  allTransactions,
}) => {
  // Group transactions by date string for the headers
  const groupedTransactions = allTransactions.reduce<Record<string, Transaction[]>>(
    (acc, transaction) => {
      const dateKey = transaction.date;
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(transaction);
      return acc;
    },
    {}
  );

  // Sort the keys (dates) to ensure newest dates appear first
  const sortedDateKeys = Object.keys(groupedTransactions).sort((a, b) =>
    b.localeCompare(a)
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
      {/* Header */}
      <XStack
        width="100%"
        paddingHorizontal={20}
        paddingTop={10}
        marginBottom={20}
        alignItems="center"
      >
        <TouchableOpacity onPress={onBack} style={{ marginRight: 20 }}>
          <Ionicons name="chevron-back" size={24} color={colors.HEADER_ICON_GRAY} />
        </TouchableOpacity>
        <Text fontSize={18} fontWeight="600" color={colors.headerText}>
          Recent activities
        </Text>
      </XStack>

      <ScrollView contentContainerStyle={recentActivitiesStyles.scrollContainer}>
        {sortedDateKeys.map((dateKey) => (
          <YStack key={dateKey} width="100%" marginBottom={10}>
            {/* Date Header */}
            <Text style={recentActivitiesStyles.dateHeader}>{dateKey}</Text>

            {/* Transactions for the date */}
            <YStack>
              {groupedTransactions[dateKey].map((tx) => (
                <TransactionItem
                  key={tx.id}
                  title={tx.title}
                  date={tx.dateDetails || tx.date}
                  amount={tx.amount}
                  type={tx.type}
                  iconName={tx.iconName}
                />
              ))}
            </YStack>
          </YStack>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const recentActivitiesStyles = StyleSheet.create({
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  dateHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.secondaryGray,
    marginBottom: 8,
    marginTop: 15,
  },
});

export default RecentActivitiesScreen;
