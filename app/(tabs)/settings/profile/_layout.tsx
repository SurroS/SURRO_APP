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
        name="editBio"
        options={{
          headerTitle: "EditBio",
          headerTitleStyle: { fontWeight: "bold" },
          headerShown: false,
        }}
     />
    </Stack>
  );
}
