import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  services: string[];
}

export default function AgentServices({ services }: Props) {
  const Item = ({ label }:{label:any}) => (
    <View style={styles.item}>
      <Ionicons name="checkmark-circle" size={18} color="#0A2A66" />
      <Text style={styles.text}>{label}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Services Offered</Text>
      {services.map((service, index) => (
        <Item key={index} label={service} />
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
  item: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  text: {
    marginLeft: 8,
    color: "#333",
    fontSize: 15,
  },
});
