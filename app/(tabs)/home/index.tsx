import { useRouter } from 'expo-router'
import { useEffect } from 'react'
import { Spinner, Text, YStack } from 'tamagui'
import { useAuth } from '@/hooks/useAuth'

export default function HomeIndex() {
  const router = useRouter()
  const Role = useAuth().user?.role

  // Redirect immediately to Page1 when home is opened
  useEffect(() => {
    router.replace(`/(roles)/${Role}/index`)
  }, [])

  return (
    <YStack flex={1} justifyContent="center" alignItems="center">
      <Spinner size="large" />
      <Text>Loading Home...</Text>
    </YStack>
  )
}
