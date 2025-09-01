import {
  Home,
  LibraryBig,
  MessageCircle,
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
        name="home"
        options={{
          title: "Home",
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
            <MessageCircle
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
