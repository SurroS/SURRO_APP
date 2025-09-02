import { Tabs } from "expo-router";
import { LibraryBig, MessageSquare, Settings } from "@tamagui/lucide-icons";
import { Image } from "react-native";
import colors from "../../hooks/colors";
import Entypo from '@expo/vector-icons/Entypo';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { borderTopWidth: 0, backgroundColor: colors.white },
        tabBarActiveTintColor: colors.primary as any,
        tabBarInactiveTintColor: colors.gray as any,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ focused, size }) => (
            <Entypo name="home"
              size={size} 
              color={(focused ? colors.primary : colors.gray) as any}
              fill={(focused ? colors.primary : "transparent") as any}
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
              color={(focused ? colors.primary : colors.gray) as any}
              fill={(focused ? colors.primary : "transparent") as any}
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
              color={(focused ? colors.primary : colors.gray) as any}
              fill={(focused ? colors.primary : "transparent") as any}
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
              color={(focused ? colors.primary : colors.gray) as any}
              fill={(focused ? colors.primary : "transparent") as any}
            />
          ),
        }}
      />
    </Tabs>
  );
}
