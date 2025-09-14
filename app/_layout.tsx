// app/_layout.tsx
import { useColorScheme } from "@/hooks/useColorScheme";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { createContext, useContext, useState } from "react";
import "react-native-reanimated";
import { TamaguiProvider } from "tamagui";
import config from "../tamagui.config";

// --- Auth Context ---
const AuthContext = createContext({
  isAuthenticated: false,
  setIsAuthenticated: (_value: boolean) => { },
});

export const useAuth = () => useContext(AuthContext);

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // ⛔ Don’t block Slot with null — allow navigation tree to mount first
  if (!loaded) {
    return <StatusBar style="auto" />;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      <TamaguiProvider
        config={config}
        defaultTheme={colorScheme === "dark" ? "dark" : "light"}
      >
        {/* Navigation tree */}
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="role-selection" />
          <Stack.Screen name="how-did-you-hear" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="+not-found" />
        </Stack>

        {/* Safe StatusBar */}
        <StatusBar style="auto" />
      </TamaguiProvider>
    </AuthContext.Provider>
  );
}
