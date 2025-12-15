import { useColorScheme } from "@/hooks/useColorScheme";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { TamaguiProvider } from "tamagui";
import ToastManager from "toastify-react-native";
import config from "../tamagui.config";
import toastConfig from "@/components/toastConfig";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useEffect } from "react";
import { InteractionManager } from "react-native";

import { useSurrogateStore } from "@/store/surrogates";
import { useAgentListStore } from "@/store/agents";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const fetchSurrogates = useSurrogateStore((state) => state.fetchSurrogates);
  const fetchAgents = useAgentListStore((state) => state.fetchAgents);

  // -------------------------------------------------
  // Preload surrogates and agents after initial render
  // -------------------------------------------------
  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      fetchSurrogates().catch((err) => console.warn("Preload surrogates error:", err));
      fetchAgents().catch((err) => console.warn("Preload agents error:", err));
    });
  }, []);

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
