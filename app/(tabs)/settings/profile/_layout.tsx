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
        name="experienceForm"
        options={{
          headerTitle: "ExperienceForm",
          headerTitleStyle: { fontWeight: "bold" },
          headerShown: false,
        }}
      />
            <Stack.Screen
        name="experienceIntro"
        options={{
          headerTitle: "ExperienceIntro",
          headerTitleStyle: { fontWeight: "bold" },
          headerShown: false,
        }}
      />
    </Stack>
  );
}
