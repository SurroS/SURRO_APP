import { Stack } from 'expo-router'

export default function ChatLayout() {
  return (
    <Stack>
          <Stack.Screen
          name='index'
      options={{
        headerTitle:"Chat",
        headerStyle: { backgroundColor: '#0E0E55' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    />
    </Stack>

    
  )
}