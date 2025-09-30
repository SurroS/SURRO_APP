// app/index.tsx
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { YStack } from "tamagui";

export default function Index() {
  const router = useRouter();
  const { isAuthenticated, user, isLoading } = useAuth();
  const Role = useAuth().user?.role?.trim(); // trim in case of trailing spaces

  const roleMapping = {
    "INTENDED-PARENT": "parent",
    AGENT: "agent",
    SURROGATE: "surrogate",
  } as const;

  type RoleKey = keyof typeof roleMapping;

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && user?.role) {
        //authenticated user
        if (Role && Role in roleMapping) {
          const path = roleMapping[Role as RoleKey];
         router.replace(`/(roles)/${Role}`);
    
        }
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
