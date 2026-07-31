import { Stack } from "expo-router";

export default function NetworkLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Network",
          headerShown: false,
        }}
      />
    </Stack>
  );
}
