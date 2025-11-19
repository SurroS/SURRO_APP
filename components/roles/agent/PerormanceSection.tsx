import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface PerformanceProps {
  matches?: number;
  rating?: number;
  responseTime?: string;
  activeCases?: number;
}

export default function AgentPerformanceSection({
  matches,
  rating,
  responseTime,
  activeCases,
}: PerformanceProps) {
  const Item = ({ icon, label, value }:{icon:any, label:any, value:any}) => (
    <View style={styles.item}>
      <Ionicons name={icon} size={22} color="#0A2A66" />
      <View style={{ marginLeft: 10 }}>
        <Text style={styles.value}>{value || "-"}</Text>
        <Text style={styles.label}>{label}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Performance Overview</Text>

      <View style={styles.row}>
        <Item icon="people" label="Successful matches" value={matches} />
        <Item icon="star" label="Average rating" value={rating} />
      </View>

      <View style={styles.row}>
        <Item icon="time" label="Response time" value={responseTime} />
        <Item icon="briefcase" label="Active cases" value={activeCases} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#222",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  item: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  value: {
    fontSize: 16,
    fontWeight: "700",
    color: "#222",
  },
  label: {
    fontSize: 12,
    color: "#666",
  },
});
