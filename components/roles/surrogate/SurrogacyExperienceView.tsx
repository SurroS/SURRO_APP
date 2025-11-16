import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface QuestionAnswer {
  question: string;
  answer?: string | number;
}

interface Props {
  data: QuestionAnswer[];
  containerStyle?: object;
}

export default function SurrogacyExperienceSection({
  data,
  containerStyle,
}: Props) {
  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.title}>Surrogacy Experience</Text>
      {data.map((item, idx) => (
        <View key={idx} style={styles.row}>
          <Text style={styles.question}>{item.question}</Text>
          <Text style={styles.answer}>{item.answer ?? "-"}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    color: "#222222",
  },
  row: {
    marginBottom: 10,
  },
  question: {
    fontWeight: "600",
    color: "#444444",
    marginBottom: 4,
  },
  answer: {
    color: "#555555",
  },
});
