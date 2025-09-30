import { Stack } from 'expo-router'

export default function HomeLayout() {
  return (
    <Stack screenOptions={{ headerBackTitle: 'Back' }}>
      {/* Home */}
      <Stack.Screen
        name="index"
        options={{ headerShown: false }}
      />
    </Stack>
  )
}
