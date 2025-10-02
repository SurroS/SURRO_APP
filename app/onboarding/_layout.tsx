// app/onboarding/_layout.tsx
import { Stack } from "expo-router";

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="screen1" options={{ title: "Welcome to Surro" }} />
      <Stack.Screen name="role-selection" />
        <Stack.Screen name="how-did-you-hear" />
    </Stack>
  );
}
