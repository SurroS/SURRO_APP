// app/(tabs)/chat/ChatListScreen.tsx
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  View,
} from "react-native";
import { YStack, XStack, Text, Avatar } from "tamagui";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Conversation } from "@/types/chat";
import { secureGet } from "@/utils/storage";
import colors from "@/hooks/colors";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HelpServiceButton() {
  const router = useRouter();

  const handleSupportPress = () => {
    // Navigate to support bot / customer care screen
    router.push("/(tabs)/chat/supportChat");
  };

  return (
    <TouchableOpacity
      style={styles.fab}
      onPress={handleSupportPress}
      activeOpacity={0.8}
    >
      <Ionicons name="headset" size={20} color="#fff" />
      <Text fontWeight={"600"}>Help</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chatCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  fab: {
    position: "absolute",
    bottom: 25,
    right: 25,
    backgroundColor: "#0E0E55",
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 6,
  },
});
