import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '@/hooks/colors';

interface TransactionItemProps {
  title: string;
  date: string;
  amount: number;
  type: any;
  gateway?: 'stripe' | 'paystack' | 'flutterwave' | 'interswitch'; 
  iconName?: string; // optional manual icon override
}

const TransactionItem: React.FC<TransactionItemProps> = ({
  title,
  date,
  amount,
  type,
  gateway,
  iconName,
}) => {
    
  // this Choose default icon based on gateway or transaction type
  const getIcon = (): string => {
    if (iconName) return iconName;

    switch (gateway) {
      case 'stripe':
        return 'card-outline';
      case 'paystack':
        return 'wallet-outline';
      case 'flutterwave':
        return 'cash-outline';
      case 'interswitch':
        return 'swap-horizontal-outline';
      default:
        return type === 'credit' ? 'arrow-down-circle' : 'arrow-up-circle';
    }
  };

  const iconColor =
    type === 'credit' ? colors.success : colors.danger;

  return (
    <View style={styles.container}>
      <Ionicons
        name={getIcon() as any}
        size={22}
        color={iconColor}
        style={{ marginRight: 10 }}
      />

      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.date}>{date}</Text>
      </View>

      <Text
        style={[
          styles.amount,
          { color: iconColor },
        ]}
      >
        {type === 'credit' ? '+' : '-'}₦{amount.toLocaleString()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  date: {
    fontSize: 13,
    color: colors.secondaryGray,
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
  },
});

export default TransactionItem;
