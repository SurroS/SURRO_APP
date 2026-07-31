// components/chat/ChatMessageBubble.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import type { Message } from "@/types/chat";
import colors from "@/hooks/colors";

interface Props {
  message: Message;
  isMine: boolean;
  onRetry?: (msg: Message) => void;
}

export default function ChatMessageBubble({ message, isMine, onRetry }: Props) {
  const time = new Date(message.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <View style={[styles.row, isMine ? styles.mine : styles.their]}>
      <View
        style={[styles.bubble, isMine ? styles.myBubble : styles.theirBubble]}
      >
        {/* TEXT */}
        {message.content ? (
          <Text
            style={[styles.text, isMine ? styles.myText : styles.theirText]}
          >
            {message.content}
          </Text>
        ) : null}

        {/* ATTACHMENT */}
        {message.attachmentUrl ? (
          <TouchableOpacity
            style={styles.attachmentBox}
          >
            <Text style={styles.attachmentText}>📎 Attachment</Text>
          </TouchableOpacity>
        ) : null}

        {/* FAILED INDICATOR */}
        {message.failed && (
          <TouchableOpacity
            onPress={() => onRetry?.(message)}
            style={styles.failedBox}
          >
            <Text style={styles.failedText}>Failed — Tap to retry</Text>
          </TouchableOpacity>
        )}

        {/* TIME */}
        <Text style={styles.time}>{time}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    marginVertical: 6,
    paddingHorizontal: 8,
  },
  mine: {
    alignSelf: "flex-end",
  },
  their: {
    alignSelf: "flex-start",
  },

  bubble: {
    padding: 10,
    borderRadius: 12,
    maxWidth: "80%",
  },

  myBubble: {
    backgroundColor: "#0E0E55",
  },

  theirBubble: {
    backgroundColor: "#F3F3F3",
    borderWidth: 1,
    borderColor: "#EAEAEA",
  },

  text: {
    fontSize: 15,
    marginBottom: 4,
  },

  myText: {
    color: "#fff",
  },

  theirText: {
    color: "#111",
  },

  time: {
    fontSize: 10,
    color: "#999",
    marginTop: 4,
    alignSelf: "flex-end",
  },

  attachmentBox: {
    marginTop: 4,
    paddingVertical: 6,
    paddingHorizontal: 8,
    backgroundColor: "#EFEFEF",
    borderRadius: 8,
  },

  attachmentText: {
    fontSize: 13,
    color: colors.primary,
  },

  failedBox: {
    marginTop: 6,
  },

  failedText: {
    fontSize: 11,
    color: "red",
  },
});
