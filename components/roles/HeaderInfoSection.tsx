import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button } from "tamagui";
import Entypo from "@expo/vector-icons/Entypo";
import colors from "@/hooks/colors";

interface Props {
  name: string;
  username: string;
  location: string;
  age: number;
  city?: string;

  maritalStatus: string;
  height?: string;
  weight?: string;
  currency?: any;

  compensation: number;
  isNegotiable: boolean;

  onChatPress: () => void;
  isUnlocked: boolean;
}

export default function HeaderInfo({
  name,
  username,
  location,
  city,
  age,
  maritalStatus,
  height,
  weight,
  compensation,
  isNegotiable,
  onChatPress,
  isUnlocked,
  currency,
}: Props) {
  return (
    <View style={styles.container}>
      {isUnlocked ? (
        <Text style={styles.name}>{name}</Text>
      ) : (
        <Text style={styles.username}>@{username}</Text>
      )}

      {/* LOCATION + AGE */}
      <View style={styles.locationRow}>
        <Text style={styles.locationText}>
          {location} {city}
        </Text>
        <Text style={styles.dot}>•</Text>
        <Text style={styles.locationText}>{age} Years</Text>
      </View>

      {/* BODY STATS */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Marital Status</Text>
          <Text style={styles.statValue}>{maritalStatus}</Text>
        </View>

        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Height</Text>
          <Text style={styles.statValue}>{height}</Text>
        </View>

        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Weight</Text>
          <Text style={styles.statValue}>{weight}</Text>
        </View>
      </View>

      {/* COMPENSATION */}
      <View style={styles.compensationWrapper}>
        <Text style={styles.compensationLabel}>Compensation</Text>

        <Text style={styles.compensationAmount}>
          {currency ? `${currency}` : "N"}
          {compensation.toLocaleString()}
        </Text>

        <Text
          style={[
            styles.negotiable,
            { color: isNegotiable ? "#0A2A66" : "#888" },
          ]}
        >
          {isNegotiable ? "Negotiable" : "Non-negotiable"}
        </Text>
      </View>

      {/* ACTION BUTTON */}
      <Button
        style={styles.chatButton}
        iconAfter={
          isUnlocked ? (
            <Entypo name="lock-open" size={18} color="white" />
          ) : (
            <Entypo name="lock" size={18} color="white" />
          )
        }
        onPress={onChatPress}
      >
        {isUnlocked ? "Chat now" : "Unlock to chat"}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 20 },
  name: { fontSize: 22, fontWeight: "700" },
  username: {
    fontSize: 18,
    color: colors.primary,
    marginTop: 4,
    fontWeight: "700",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 12,
  },
  locationText: { fontSize: 14, color: "#444" },
  dot: { marginHorizontal: 6, color: "#444" },

  statsRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    marginTop: 4,
    paddingLeft: 25,
    gap: 20,
  },
  statBox: { width: "31%" },
  statLabel: { fontSize: 12, color: "#666" },
  statValue: { fontSize: 14, fontWeight: "600", marginTop: 2 },

  compensationWrapper: {
    backgroundColor: "#f0f4ff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
    alignItems: "center",
  },
  compensationLabel: { fontSize: 14, color: "#444", fontWeight: "600" },
  compensationAmount: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0A2A66",
    marginVertical: 4,
  },
  negotiable: { fontSize: 14, fontWeight: "700" },

  chatButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
});
