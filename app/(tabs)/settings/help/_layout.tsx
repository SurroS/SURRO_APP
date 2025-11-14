import { Stack } from "expo-router";

export default function helpLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // Hide headers for a clean UI
      }}
    >
      {/* Redirect entry (index) */}
      <Stack.Screen name="index" />
      {/* <Stack.Screen name="preview" />
      <Stack.Screen name="select" />
      <Stack.Screen name="uploads" />
       <Stack.Screen name="face-scan" /> 
        <Stack.Screen name="face-scan-rules" />  */}
    </Stack>
  );
}
