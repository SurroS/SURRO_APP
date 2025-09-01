import { Stack } from 'expo-router'

export default function ResoucesLayout() {
  return (
    <Stack>
          <Stack.Screen
          name='index'
      options={{
        headerTitle:"Resources",
        headerStyle: { backgroundColor: '#0E0E55' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    />
    </Stack>
  )
}
