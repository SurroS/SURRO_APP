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
        name="chatBox"
        options={{
          headerTitle: "ChatBox",
          headerShown: false,
          headerTitleStyle: { fontWeight: "bold" },
        }}
      />
      <Stack.Screen
        name="[conversationId]"
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
