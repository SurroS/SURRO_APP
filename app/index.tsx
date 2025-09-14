// app/index.tsx
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { YStack } from "tamagui";

export default function Index() {
  const router = useRouter();
  const { isAuthenticated, user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && user?.role) {
        // User is authenticated, navigate to role-specific dashboard
        router.replace(`/(roles)/${user.role}`);
      } else {
        // User is not authenticated, start with onboarding
        router.replace("/onboarding/screen1");
      }
    }
  }, [isAuthenticated, user?.role, isLoading]);

  return (
    <YStack flex={1} justifyContent="center" alignItems="center" padding="$4">
      {/* Splash screen is handled by Expo, this screen will transition immediately */}
    </YStack>
  );
}