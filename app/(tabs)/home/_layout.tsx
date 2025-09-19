import { Stack } from 'expo-router'

export default function HomeLayout() {
  return (
    <Stack screenOptions={{ headerBackTitle: 'Back' }}>
      {/* Home */}
      <Stack.Screen
        name="index"
        options={{ headerShown: false }}
      />

      {/* Page 1 */}
      <Stack.Screen
        name="page1"
        options={{ headerShown: false }}
      />

      {/* Page 2 */}
      <Stack.Screen
        name="page2"
        options={{ headerShown: false }}
      />

      {/* Page 3 */}
      <Stack.Screen
        name="page3"
        options={{ headerShown: false }}
      />
    </Stack>
  )
}
