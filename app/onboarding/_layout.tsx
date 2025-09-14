// app/onboarding/_layout.tsx
import React from "react";
import { Stack } from "expo-router";

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* <Stack.Screen
        name="screen1"
        options={{ title: "Welcome to Surro" }}
      /> */}
      <Stack.Screen
        name="screen2"
        options={{ title: "Our Core Values" }}
      />
    </Stack>
  );
}
