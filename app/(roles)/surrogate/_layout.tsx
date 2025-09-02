import { Stack } from 'expo-router'
import colors from '../../../hooks/colors'

export default function SurrogateLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.secondary },
        headerTintColor: colors.white,
        headerTitleStyle: { fontWeight: '600' },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Surrogate Dashboard' }} />
      <Stack.Screen name="profile" options={{ title: 'My Profile' }} />
      <Stack.Screen name="offers" options={{ title: 'Offers' }} />
    </Stack>
  )
}
