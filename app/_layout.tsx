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

  if (!loaded) {
    return <StatusBar style="auto" />;
  }

  return (
    <KeyboardProvider>
      <TamaguiProvider
        config={config}
        defaultTheme={colorScheme === "dark" ? "dark" : "light"}
      >
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="notifications" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="+not-found" />
        </Stack>

        <StatusBar style="auto" />
        <ToastManager
          config={toastConfig}
          position="top"
          animationStyle="slide"
          isRTL={true}
        />
      </TamaguiProvider>
    </KeyboardProvider>
  );
}
