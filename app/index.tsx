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
        // Normalize role (backend might return underscores)
        const normalizedRole = user.role.replace("_", "-").toUpperCase();

        if (normalizedRole in roleMapping) {
          const path = roleMapping[normalizedRole as RoleKey];
          console.log(" Redirecting to role path:", path);
          router.replace("/(tabs)/home"); // Go to role-specific tab
          return;
        }
      }

      // If not authenticated or role unknown → screen1 (first time) or login
      router.replace(hasSeenOnboarding ? "/(auth)/login" : "/onboarding/screen1");
    }
  }, [hasHydrated, isAuthenticated, user?.role, isLoading]);

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
