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
      {/* <Stack.Screen name="agentsGuestView" /> */}
      <Stack.Screen name="agentsListScreen" />
      <Stack.Screen name="agentsProfileScreen" /> 
    </Stack>
  );
}
