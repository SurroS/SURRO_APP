import React from "react";
import Entypo from "@expo/vector-icons/Entypo";
import { LibraryBig, MessageSquare, Settings } from "@tamagui/lucide-icons";
import { Tabs } from "expo-router";

export default function TabsLayout() {
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
