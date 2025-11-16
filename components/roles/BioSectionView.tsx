import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface Props {
  title: string;
  content: string | React.ReactNode;
  containerStyle?: object;
  titleStyle?: object;
  contentStyle?: object;
}

export default function BioSection({
  title,
  content,
  containerStyle,
  titleStyle,
  contentStyle,
}: Props) {
  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[styles.title, titleStyle]}>{title}</Text>
      {typeof content === "string" ? (
        <Text style={[styles.content, contentStyle]}>{content}</Text>
      ) : (
        content
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
    color: "#222222",
  },
  content: {
    fontSize: 14,
    color: "#444444",
    lineHeight: 20,
  },
});
