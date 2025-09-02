import { Stack } from 'expo-router'
import colors from '../../../hooks/colors'

export default function ParentLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.white,
        headerTitleStyle: { fontWeight: '600' },
      }}
    >
      <Stack.Screen name="index" options={{headerShown:false,  title: 'Parent Dashboard' }} />
      <Stack.Screen name="profile" options={{ headerShown:false, title: 'Profile' }} />
    </Stack>
  )
}
