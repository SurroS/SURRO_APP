import { Stack } from "expo-router";

export default function SurrogateLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="surrogateList" />
    </Stack>
  );
}
