import React from "react";
import { Stack } from "expo-router";

export default function profileLayout() {
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
      <Stack.Screen
        name="contactInformation"
        options={{
          headerTitle: "Contact Information",
          headerTitleStyle: { fontWeight: "bold" },
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="personalDetails"
        options={{
          headerTitle: "Personal Details",
          headerTitleStyle: { fontWeight: "bold" },
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="AgentCoverageSection"
        options={{
          headerTitle: "Agent Coverage Section",
          headerTitleStyle: { fontWeight: "bold" },
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AgentExperienceSection"
        options={{
          headerTitle: "Agent Experience Section",
          headerTitleStyle: { fontWeight: "bold" },
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AgentLanguagesSection"
        options={{
          headerTitle: "Agent Languages Section",
          headerTitleStyle: { fontWeight: "bold" },
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AgentSpecializationSection"
        options={{
          headerTitle: "Agent Specialization Section",
          headerTitleStyle: { fontWeight: "bold" },
          headerShown: false,
        }}
      />
    </Stack>
  );
}
