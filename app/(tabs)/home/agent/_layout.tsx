// app/home/_layout.tsx
import { Stack } from "expo-router";

export default function surrogateLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* Redirect entry (index) */}
      {/* <Stack.Screen name="index" />   */}
      <Stack.Screen name="agentsGuestView" />
      {/* agentsProfileScreen moved to /agent/agentProfileScreen */}
    </Stack>
  );
}
