import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'expo-router'
import React from 'react'
import { Text, YStack } from 'tamagui'

export default function Home() {
  const router = useRouter()
  const { user } = useAuth()

  // Redirect to the appropriate role dashboard based on user's actual role
  React.useEffect(() => {
    if (user?.role) {
      router.replace(`/(roles)/${user.role}`)
    }
  }, [user?.role])

  return (
    <YStack flex={1} justifyContent="center" alignItems="center">
      <Text>Loading dashboard...</Text>
    </YStack>
  )
}
