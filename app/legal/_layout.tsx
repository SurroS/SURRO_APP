import { Stack } from "expo-router";

export default function LegalLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="webview"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}