import { Stack } from 'expo-router'

export default function HomeLayout() {
  return (
    <Stack>
         <Stack.Screen
         name='index'
      options={{
        headerTitle:"Home",
        headerStyle: { backgroundColor: '#0E0E55' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    />
    </Stack>

    
  )
}
