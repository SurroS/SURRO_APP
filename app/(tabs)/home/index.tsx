import { useRouter } from 'expo-router'
import { useEffect } from 'react'
import { Spinner, Text, YStack } from 'tamagui'

export default function HomeIndex() {
  const router = useRouter()

  // Redirect immediately to Page1 when home is opened
  useEffect(() => {
    router.replace('/home/page1')
  }, [])

  return (
    <YStack flex={1} justifyContent="center" alignItems="center">
      <Spinner size="large" />
      <Text>Loading Home...</Text>
    </YStack>
  )
}
