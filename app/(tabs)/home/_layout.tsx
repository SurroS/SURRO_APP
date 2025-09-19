import { Stack } from 'expo-router'

export default function HomeLayout() {
  return (
    <Stack screenOptions={{ headerBackTitle: 'Back' }}>
      {/* Home */}
      <Stack.Screen
        name="index"
        options={{ headerShown: false }}
      />

      {/* Page 1 - No header */}
      <Stack.Screen
        name="page1"
        options={{ headerShown: false }}
      />

      {/* Page 2 */}
      <Stack.Screen
        name="page2"
        options={{
          headerTitle: 'Page Two',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />

      {/* Page 3 */}
      <Stack.Screen
        name="page3"
        options={{
          headerTitle: 'Page Three',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />
    </Stack>
  )
}
