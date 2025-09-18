import { Stack } from 'expo-router'

export default function HomeLayout() {
  return (
    <Stack>
      {/* Home (index.tsx) */}
      <Stack.Screen
        name="index"
        options={{
          headerShown: false, // no header on home
        }}
      />

      {/* Page 1 */}
      <Stack.Screen
        name="page1"
        options={{
          headerTitle: "Page One",
          headerTitleStyle: { fontWeight: 'bold' },
          headerBackTitle: "Back",
        }}
      />

      {/* Page 2 */}
      <Stack.Screen
        name="page2"
        options={{
          headerTitle: "Page Two",
          headerTitleStyle: { fontWeight: 'bold' },
          headerBackTitle: "Back",
        }}
      />

      {/* Page 3 */}
      <Stack.Screen
        name="page3"
        options={{
          headerTitle: "Page Three",
          headerTitleStyle: { fontWeight: 'bold' },
          headerBackTitle: "Back",
        }}
      />
    </Stack>
  )
}
