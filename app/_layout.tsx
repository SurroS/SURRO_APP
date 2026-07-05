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
import { Platform } from "react-native";
import { initSystemNotifications } from "@/store/notifications/notificationService";
import { checkInactivity } from "@/store/notifications/inactivityService";
import { useAppActivity } from "@/hooks/useAppActivity";
import { useNotificationPreferences } from "@/store/notifications/preferencesStore";
import { useAuthStore } from "@/store/auth";
import { getAllCountries } from "@/utils/countries";
import SessionGate from "@/components/SessionGate";
import { usePushNotifications } from "@/hooks/usePushNotifications";

export default function RootLayout() {
  useAppActivity();
  usePushNotifications();

  const loadNotificationPrefs = useNotificationPreferences((s) => s.load);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    initSystemNotifications();
    checkInactivity();
    getAllCountries(); // preload countries cache for filter modal
    if (isAuthenticated) loadNotificationPrefs();

    if (Platform.OS === "android") {
      try {
        const NavigationBar = require("expo-navigation-bar");
        NavigationBar.setButtonStyleAsync("dark");
      } catch (_) { console.warn("Failed to set nav bar style"); }
    }
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
          <SessionGate>
            <Stack screenOptions={{ headerShown: false }} />
          </SessionGate>
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
