import React from "react";
import { Stack } from "expo-router";

export default function medicalLayout() {
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
        name="medical-one"
        options={{
          headerTitle: "MedicalHistory",
          headerTitleStyle: { fontWeight: "bold" },
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="medical-two"
        options={{
          headerTitle: "MedicalHistory",
          headerTitleStyle: { fontWeight: "bold" },
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="medicalUpload"
        options={{
          headerTitle: "MedicalUpload",
          headerTitleStyle: { fontWeight: "bold" },
          headerShown: false,
        }}
      />
            <Stack.Screen
        name="medicalHistorySummary"
        options={{
          headerTitle: "Medical History Summary",
          headerTitleStyle: { fontWeight: "bold" },
          headerShown: false,
        }}
      />
      
    </Stack>
  );
}
