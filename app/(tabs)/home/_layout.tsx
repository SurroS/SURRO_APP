import { Stack } from "expo-router";

export default function HomeLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // Hide headers for a clean UI
      }}
    >
      {/* Redirect entry (index) */}
      <Stack.Screen name="index" />
      <Stack.Screen name="galleryAction" />
      <Stack.Screen name="inviteScreen" /> 
      <Stack.Screen name="surrogate" />
      {/* <Stack.Screen name="agent" /> */}
    </Stack>
  );
}
