import { Stack } from "expo-router";
export default function ChatLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "ChatList",
          headerShown: false,
          headerTitleStyle: { fontWeight: "bold" },
        }}
      />
      <Stack.Screen
        name="conversation"
        options={{
          headerTitle: "Conversation",
          headerShown: false,
          headerTitleStyle: { fontWeight: "bold" },
        }}
      />
        <Stack.Screen
        name="supportChat"
        options={{
          headerTitle: "Support Chat",
          headerShown: false,
          headerTitleStyle: { fontWeight: "bold" },
        }}
      />
    </Stack>
  );
}
