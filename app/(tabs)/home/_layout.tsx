// app/(tabs)/home/_layout.tsx
import { Stack } from 'expo-router';

export default function HomeLayout() {
  return (
    <Stack screenOptions={{ headerBackTitle: 'Back' }}>
      <Stack.Screen
        name="index"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="guessview"
        options={{ headerShown: false }} // optional, hides header for GuessView
      />
    </Stack>
  );
}
