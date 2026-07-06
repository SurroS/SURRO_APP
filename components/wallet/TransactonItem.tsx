import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "@/hooks/colors";
import type { TransactionStatus } from "@/types/walletTypes";

interface TransactionItemProps {
  title: string;
  date: string;
  amount: number;
  type: any;
  status?: TransactionStatus;
  gateway?: "STRIPE" | "PAYSTACK" | "FLUTTERWAVE" | "INTERSWITCH";
  iconName?: string;
}

const STATUS_LABELS: Record<TransactionStatus, { label: string; bg: string; fg: string }> = {
  SUCCESS: { label: "Success", bg: "#DCFCE7", fg: "#166534" },
  PENDING: { label: "Pending", bg: "#FEF3C7", fg: "#92400E" },
  PROCESSING: { label: "Processing", bg: "#DBEAFE", fg: "#1E40AF" },
  FAILED: { label: "Failed", bg: "#FEE2E2", fg: "#991B1B" },
};

const TransactionItem: React.FC<TransactionItemProps> = ({
  title,
  date,
  amount,
  type,
  status,
  gateway,
  iconName,
}) => {
  const getIcon = (): string => {
    if (iconName) return iconName;

    switch (gateway) {
      case "STRIPE":
        return "card-outline";
      case "PAYSTACK":
        return "wallet-outline";
      case "FLUTTERWAVE":
        return "cash-outline";
      case "INTERSWITCH":
        return "swap-horizontal-outline";
      default:
        return type === "credit" ? "arrow-down-circle" : "arrow-up-circle";
    }
  };

  const iconColor = type === "credit" ? "#22C55E" : "#EF4444";
  const statusInfo = status ? STATUS_LABELS[status] : null;

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

      <View style={styles.rightSection}>
        {statusInfo && (
          <View style={[styles.badge, { backgroundColor: statusInfo.bg }]}>
            <Text style={[styles.badgeText, { color: statusInfo.fg }]}>
              {statusInfo.label}
            </Text>
          </View>
        )}
        <Text style={[styles.amount, { color: iconColor }]}>
          {type === "credit" ? "+" : "-"}₦{amount.toLocaleString()}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  date: {
    fontSize: 13,
    color: colors.secondaryGray,
  },
  rightSection: {
    alignItems: "flex-end",
    gap: 4,
  },
  badge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "600",
  },
  amount: {
    fontSize: 16,
    fontWeight: "700",
  },
});

export default TransactionItem;
