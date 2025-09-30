import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'expo-router'
import { Spinner, Text, YStack } from 'tamagui'

export default function HomeIndex() {
  const router = useRouter()
  const Role = useAuth().user?.role

  // Redirect immediately to Page1 when home is opened
  // useEffect(() => {
  //   router.replace(`/(roles)/surrogate/index`)
  // }, [])

  return (
    <YStack flex={1} justifyContent="center" alignItems="center">
      <Spinner size="large" />
      {/* <Text>Loading Home...</Text> */}
      {
        Role === 'SURROGATE' ? (
          <Text>Surrogate</Text>
        ) : Role === 'INTENDED_PARENT' ? (
          <Text>Intended Parent</Text>
        ) : Role === 'AGENT' ? (
          <Text>Agent</Text>
        ) : null
      }
    </YStack>
  )
}
