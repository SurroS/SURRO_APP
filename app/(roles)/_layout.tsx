import {
  Home,
  LibraryBig,
  MessageSquare,
  Settings,
} from "@tamagui/lucide-icons";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {  borderTopWidth: 0 },
        tabBarActiveTintColor: "#0E0E55", // our primary
        tabBarInactiveTintColor: "#808080",
      }}
    >
      <Tabs.Screen
        name="agent"
        options={{
          title: "Agent",
          tabBarIcon: ({ focused }) => (
            <Home
              color={focused ? "#ffffffff" : "#808080"}
              fill={focused ? "#0E0E55" : "#ffffffff"}
              
            />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          tabBarIcon: ({ focused }) => (
            <MessageSquare
              color={focused ? "#ffffffff" : "#808080"}
              fill={focused ? "#0E0E55" : "#ffffffff"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="resources"
        options={{
          title: "Resources",
          tabBarIcon: ({ focused }) => (
            <LibraryBig 
               color={focused ? '#ffffffff' : '#808080'}
              fill={focused ? '#0E0E55' : "#ffffffff"}
             />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ focused }) => (
            <Settings 
               color={focused ? '#ffffffff' : '#808080'}
              fill={focused ? '#0E0E55' : "#ffffffff"}
            />
          ),
        }}
      />
    </Tabs>
  );
}
