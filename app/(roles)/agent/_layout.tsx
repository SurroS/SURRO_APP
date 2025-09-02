import { Stack } from 'expo-router'
import colors from '../../../hooks/colors'

export default function AgentLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.text },
        headerTintColor: colors.white,
        headerTitleStyle: { fontWeight: '600' },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Agent Dashboard' }} />
      <Stack.Screen name="roster" options={{ title: 'Roster' }} />
      <Stack.Screen name="requests" options={{ title: 'Requests' }} />
    </Stack>
  )
}
