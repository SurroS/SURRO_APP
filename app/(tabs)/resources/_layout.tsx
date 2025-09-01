import { Stack } from 'expo-router'

export default function ResoucesLayout() {
  return (
    <Stack>
          <Stack.Screen
          name='index'
      options={{
        headerTitle:"Resources",
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    />
    </Stack>
  )
}
