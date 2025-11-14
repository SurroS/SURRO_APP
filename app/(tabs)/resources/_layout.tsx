import React from "react";
import { Stack } from "expo-router";

export default function ResoucesLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Resources",
          headerShown: false,
          headerTitleStyle: { fontWeight: "bold" },
        }}
      />
      <Stack.Screen
        name="documentViewer"
        options={{
          headerTitle: "Document Viewer",
          headerShown: false,
          headerTitleStyle: { fontWeight: "bold" },
        }}
      />
    </Stack>
  );
};

