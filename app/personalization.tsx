import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { YStack, XStack, Text, ScrollView } from "tamagui";
import { ScreenHeader } from "@/components/auth";
import colors from "@/hooks/colors";
import { router } from "expo-router";

// Custom Toggle Button
const ToggleButton = ({
  value,
  onToggle,
}: {
  value: boolean;
  onToggle: () => void;
}) => {
  return (
    <TouchableOpacity
      onPress={onToggle}
      activeOpacity={0.8}
      style={[
        styles.toggleContainer,
        {
          backgroundColor: value ? colors.primary : "#E6E6E6",
          justifyContent: value ? "flex-end" : "flex-start",
        },
      ]}
    >
      <View style={[styles.toggleCircle]} />
    </TouchableOpacity>
  );
};

export default function NotificationSettingsScreen() {
  const [updates, setUpdates] = useState({
    email: true,
    sms: false,
    push: true,
  });

  const [reminders, setReminders] = useState({
    email: true,
    sms: true,
    push: true,
  });

  const handleToggle = (
    section: "updates" | "reminders",
    field: "email" | "sms" | "push"
  ) => {
    if (section === "updates") {
      setUpdates((prev) => ({ ...prev, [field]: !prev[field] }));
    } else {
      setReminders((prev) => ({ ...prev, [field]: !prev[field] }));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <YStack padding="$4" gap="$4">
          <ScreenHeader
            title="Notification"
            onBackPress={() => router.back()}
          />

          {/* Updates and Promotions */}
          <YStack style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Updates and promotions</Text>
            <Text style={styles.sectionSubtitle}>
              Be the first to know about new features, deals and promo.
            </Text>

            <YStack style={styles.toggleGroup}>
              <ToggleRow
                label="Email"
                value={updates.email}
                onToggle={() => handleToggle("updates", "email")}
              />
              <ToggleRow
                label="SMS"
                value={updates.sms}
                onToggle={() => handleToggle("updates", "sms")}
              />
              <ToggleRow
                label="Push notification"
                value={updates.push}
                onToggle={() => handleToggle("updates", "push")}
              />
            </YStack>
          </YStack>

          {/* Reminders */}
          <YStack style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Reminders</Text>
            <Text style={styles.sectionSubtitle}>
              Get timely updates about your wallet and friend referrals.
            </Text>

            <YStack style={styles.toggleGroup}>
              <ToggleRow
                label="Email"
                value={reminders.email}
                onToggle={() => handleToggle("reminders", "email")}
              />
              <ToggleRow
                label="SMS"
                value={reminders.sms}
                onToggle={() => handleToggle("reminders", "sms")}
              />
              <ToggleRow
                label="Push notification"
                value={reminders.push}
                onToggle={() => handleToggle("reminders", "push")}
              />
            </YStack>
          </YStack>
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}

// ✅ Each toggle row
type ToggleRowProps = {
  label: string;
  value: boolean;
  onToggle: () => void;
};

const ToggleRow = ({ label, value, onToggle }: ToggleRowProps) => (
  <XStack justifyContent="space-between" alignItems="center" marginTop={18}>
    <Text style={styles.toggleLabel}>{label}</Text>
    <ToggleButton value={value} onToggle={onToggle} />
  </XStack>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  sectionCard: {
    backgroundColor: "#F8F8FA",
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.primary,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: "#666",
    marginTop: 4,
    marginBottom: 8,
  },
  toggleGroup: {
    marginTop: 8,
  },
  toggleLabel: {
    fontSize: 15,
    color: "#0E0E55",
    fontWeight: "500",
  },

  // Toggle button styling
  toggleContainer: {
    width: 50,
    height: 28,
    borderRadius: 30,
    padding: 3,
    flexDirection: "row",
    alignItems: "center",
  },
  toggleCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
});
