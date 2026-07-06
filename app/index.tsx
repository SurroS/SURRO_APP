import { useEffect } from "react";
import { useRouter } from "expo-router";
import { YStack, Spinner, Text } from "tamagui";
import { useAuthStore } from "@/store/auth";

export default function Index() {
  const router = useRouter();

  // Get store values including hydration state
  const { isAuthenticated, user, isLoading, hasHydrated, hasSeenOnboarding } = useAuthStore();

  // Role mapping to app routes
  const roleMapping = {
    "INTENDED-PARENT": "parent",
    AGENT: "agent",
    SURROGATE: "surrogate",
  } as const;

  type RoleKey = keyof typeof roleMapping;

  useEffect(() => {
    // Wait until Zustand has rehydrated persisted state
    if (!hasHydrated) return;

    if (!isLoading) {
      if (isAuthenticated && user?.role) {
        const normalizedRole = user.role.replace("_", "-").toUpperCase();

        if (normalizedRole in roleMapping) {
          const path = roleMapping[normalizedRole as RoleKey];
          router.replace("/(tabs)/home");
          return;
        }
      }

      router.replace(hasSeenOnboarding ? "/(auth)/login" : "/onboarding/screen1");
    }
  }, [hasHydrated, isAuthenticated, user?.role, isLoading, hasSeenOnboarding]);

  // Show a splash/loading screen while store hydrates or loading
  if (!hasHydrated || isLoading) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center">
        <Spinner size="large" />
        <Text color="gray" marginTop="$2">
          Loading...
        </Text>
      </YStack>
    );
  }

  // Fallback (should rarely render)
  return (
    <YStack flex={1} justifyContent="center" alignItems="center">
      <Text color="gray">Initializing...</Text>
    </YStack>
  );
}
