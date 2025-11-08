import { Stack } from "expo-router";

export default function HomeLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // Hide headers for a clean UI
      }}
    > 
      <Stack.Screen name="index" />
      {/* <Stack.Screen name="" />
      <Stack.Screen name="" />
      <Stack.Screen name="" />
       <Stack.Screen name="" /> 
        <Stack.Screen name="" />  */}
    </Stack>
  );
}