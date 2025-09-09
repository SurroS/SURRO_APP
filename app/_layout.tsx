import { useColorScheme } from '@/hooks/useColorScheme'
import { defaultConfig } from '@tamagui/config/v4'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import React, { useState } from 'react'; // <--- ADDED useState
import 'react-native-reanimated'
import { TamaguiProvider, createTamagui } from 'tamagui'

// 1. Create Tamagui config
const config = createTamagui(defaultConfig)
type Conf = typeof config
declare module '@tamagui/core' {
  interface TamaguiCustomConfig extends Conf { }
}

export default function RootLayout() {
  const colorScheme = useColorScheme()

  // 2. Load fonts
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  })

  // 3. ADD THIS LINE: State to manage authentication status
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!loaded) {
    return null
  }

  return (
    <TamaguiProvider config={config} defaultTheme={colorScheme === 'dark' ? 'dark' : 'light'}>
      <Stack>
        {isAuthenticated ? ( // <--- Conditional rendering starts here
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        ) : (
          <Stack.Screen name="(auth)" options={{ headerShown: false }} /> // <--- ADDED auth stack
        )}
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </TamaguiProvider>
  )
}