// app/index.tsx
import React, { useEffect } from "react";
import { YStack } from "tamagui";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    // Navigate directly to the first onboarding screen after splash
    router.replace("/onboarding/screen1");
  }, []);

  return (
    <YStack flex={1} justifyContent="center" alignItems="center" padding="$4">
      {/* Splash screen is handled by Expo, this screen will transition immediately */}
    </YStack>
  );
}