import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface Props {
  certifications: { name: string; verified?: boolean }[];
}

export default function AgentCertifications({ certifications }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Certifications & Licenses</Text>

      {certifications.map((c, idx) => (
        <View key={idx} style={styles.row}>
          <Text style={styles.cert}>{c.name}</Text>

          {c.verified && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Verified</Text>
            </View>
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginBottom: 20,
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
    marginBottom: 10,
  },
  cert: {
    fontSize: 15,
    color: "#333",
    flexShrink: 1,
  },
  badge: {
    backgroundColor: "#BFF7D0",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: {
    color: "#0E9A4D",
    fontWeight: "700",
    fontSize: 12,
  },
});
