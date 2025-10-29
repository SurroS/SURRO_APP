// components/chat/ChatMessageBubble.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import colors from "@/hooks/colors";

export default function ChatMessageBubble({ message, isMine }: any) {
  return (
    <View style={[styles.row, isMine ? styles.mine : styles.their]}>
      <View style={[styles.bubble, isMine ? styles.myBubble : styles.theirBubble]}>
        <Text style={[styles.text, isMine ? styles.myText : styles.theirText]}>
          {message.content}
        </Text>
        <Text style={styles.time}>
          {new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { marginVertical: 5 },
  mine: { alignSelf: "flex-end" },
  their: { alignSelf: "flex-start" },
  bubble: { padding: 10, borderRadius: 10, maxWidth: "80%" },
  myBubble: { backgroundColor: colors.primary },
  theirBubble: { backgroundColor: "#F3F3F3" },
  text: { fontSize: 15 },
  myText: { color: "#fff" },
  theirText: { color: "#111" },
  time: { fontSize: 10, color: "#888", marginTop: 4, alignSelf: "flex-end" },
});
