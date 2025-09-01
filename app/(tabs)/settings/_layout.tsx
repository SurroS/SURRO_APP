import { Stack } from 'expo-router'

export default function SettingsLayout() {
  return (
    <Stack>
          <Stack.Screen
          name='index'
      options={{
        headerTitle:"Settings",
        headerStyle: { backgroundColor: '#0E0E55' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    />
    </Stack>
  )
}
