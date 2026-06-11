// app/home/_layout.tsx
import { Stack } from "expo-router";

export default function WalletFlowLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // Hide headers for a clean UI
      }}
    >
      {/* Redirect entry (index) */}
      <Stack.Screen name="paymentMethod" />
      <Stack.Screen name="index" />
      <Stack.Screen name="paymentMode" />
      <Stack.Screen name="paymentEntry" />
      <Stack.Screen name="paymentWebView" />
      <Stack.Screen name="paymentSuccess" />
      <Stack.Screen name="paymentFailed" />
      <Stack.Screen name="addBankAccount" />
      <Stack.Screen name="withdrawal" />
    </Stack>
  );
}
