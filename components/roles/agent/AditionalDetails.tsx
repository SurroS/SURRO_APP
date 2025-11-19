import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface AdditionalProps {
  languages?: string[];
  experience?: string;
  specialization?: string;
  coverage?: string;
}

export default function AgentAdditionalDetails({
  languages,
  experience,
  specialization,
  coverage,
}: AdditionalProps) {
  const Row = ({ label, value }:{label:any, value:any}) => (
    <View style={styles.row}>
      <Text style={styles.label}>{label}:</Text>
      <Text style={styles.value}>{value || "-"}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Additional Details</Text>

      <Row label="Languages spoken" value={languages?.join(", ")} />
      <Row label="Years of experience" value={experience} />
      <Row label="Specialization" value={specialization} />
      <Row label="Location coverage" value={coverage} />
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
    marginBottom: 12,
    color: "#222",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: {
    fontWeight: "600",
    color: "#444",
  },
  value: {
    color: "#555",
    flexShrink: 1,
    textAlign: "right",
  },
});
