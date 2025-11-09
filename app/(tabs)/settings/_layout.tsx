import React from "react";
import { Stack } from "expo-router";

export default function SettingsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Settings",
          headerTitleStyle: { fontWeight: "bold" },
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="help"
        options={{
          headerTitle: "Help",
          headerTitleStyle: { fontWeight: "bold" },
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="kyc"
        options={{
          headerTitle: "KYC",
          headerTitleStyle: { fontWeight: "bold" },
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="profile"
        options={{
          headerTitle: "Profile Information",
          headerTitleStyle: { fontWeight: "bold" },
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="personalization"
        options={{
          headerTitle: "Personalization",
          headerTitleStyle: { fontWeight: "bold" },
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="security"
        options={{
          headerTitle: "security",
          headerTitleStyle: { fontWeight: "bold" },
          headerShown: false,
        }}
      />
    </Stack>
  );
}
