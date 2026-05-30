import React from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import { LibraryBig, MessageSquare, Settings } from "@tamagui/lucide-icons";
import { Tabs } from "expo-router";
import { useAuthStore } from "@/store/auth";

export default function TabsLayout() {
  const forceLogout = useAuthStore((s) => s.forceLogout);

  // ---- Full-screen blocker on 401 force logout ----
  if (forceLogout) {
    return (
      <View style={styles.blocker}>
        <ActivityIndicator size="large" color="#0E0E55" />
      </View>
    );
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { borderTopWidth: 0, backgroundColor: "#FFFFFF" },
        tabBarActiveTintColor: "#0E0E55",
        tabBarInactiveTintColor: "#808080",
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ focused, size }) => (
            <Entypo
              name="home"
              size={size}
              color={focused ? "#0E0E55" : "#808080"}
              fill={focused ? "#0E0E55" : "transparent"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          tabBarIcon: ({ focused, size }) => (
            <MessageSquare
              size={size}
              color={focused ? "#0E0E55" : "#808080"}
              fill={focused ? "#0E0E55" : "transparent"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="resources"
        options={{
          title: "Resources",
          tabBarIcon: ({ focused, size }) => (
            <LibraryBig
              size={size}
              color={focused ? "#0E0E55" : "#808080"}
              fill={focused ? "#0E0E55" : "transparent"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ focused, size }) => (
            <Settings
              size={size}
              color={focused ? "#0E0E55" : "#808080"}
              fill={focused ? "#0E0E55" : "transparent"}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  blocker: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
});
