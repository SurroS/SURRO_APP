// components/chat/ChatInput.tsx
import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { SendHorizontal } from "@tamagui/lucide-icons";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled }) => {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text.trim());
    setText("");
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Type a message..."
        placeholderTextColor="#666666"
        multiline
        value={text}
        onChangeText={setText}
      />

      <TouchableOpacity
        onPress={handleSend}
        style={styles.sendButton}
        disabled={disabled}
      >
        <SendHorizontal size={22} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    backgroundColor: "#f7f7f7",
    fontSize: 15,
    maxHeight: 120,
  },
  sendButton: {
    backgroundColor: "#0E0E55",
    borderRadius: 50,
    padding: 10,
    marginLeft: 8,
  },
});

export default ChatInput;
