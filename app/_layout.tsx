// app/_layout.tsx
import toastConfig from "@/components/toastConfig";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { KeyboardProvider } from "react-native-keyboard-controller";
import "react-native-reanimated";
import { TamaguiProvider } from "tamagui";
import ToastManager from "toastify-react-native";
import config from "../tamagui.config";


export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  // ⛔ Don't block Slot with null — allow navigation tree to mount first
  if (!loaded) {
    return <StatusBar style="auto" />;
  }

  return (
    <KeyboardProvider>
      <TamaguiProvider
        config={config}
        defaultTheme={colorScheme === "dark" ? "dark" : "light"}
      >
        {/* Navigation tree */}
        <Stack screenOptions={{ headerShown: false }}>

          <Stack.Screen name="index" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="+not-found" />
        </Stack>

        {/* Safe StatusBar */}
        <StatusBar style="auto" />
        <ToastManager config={toastConfig}
          position="top"
          animationStyle="slide"
          isRTL={true}
        />
      </TamaguiProvider>
    </KeyboardProvider>
  );
}
