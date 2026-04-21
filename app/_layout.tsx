import { useColorScheme } from "@/hooks/useColorScheme";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { TamaguiProvider } from "tamagui";
import ToastManager from "toastify-react-native";
import config from "@/tamagui.config";
import toastConfig from "@/components/toastConfig";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useEffect } from "react";
import { initSystemNotifications } from "@/store/notifications/notificationService";
import { checkInactivity } from "@/store/notifications/inactivityService";
import { useAppActivity } from "@/hooks/useAppActivity";

export default function RootLayout() {
  useAppActivity();

  useEffect(() => {
    initSystemNotifications();
    checkInactivity();
  }, []);

  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    return <StatusBar style="auto" />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardProvider>
        <TamaguiProvider
          config={config}
          defaultTheme={colorScheme === "dark" ? "dark" : "light"}
        >
          <Stack screenOptions={{ headerShown: false }} />
          <StatusBar style="auto" />
          <ToastManager
            config={toastConfig}
            position="top"
            animationStyle="slide"
            isRTL={true}
          />
        </TamaguiProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}
