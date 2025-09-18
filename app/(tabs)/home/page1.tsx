import { useRouter } from 'expo-router'
import { Button, Image, Text, YStack } from 'tamagui'

export default function Page1() {
  const router = useRouter()

  return (
    <YStack flex={1} justifyContent="center" alignItems="center" space>
      <Image
        source={require('@/assets/images/page.jpg')}
        style={{ width: 250, height: 250, resizeMode: 'contain' }}
      />
      <Text fontSize="$6" fontWeight="bold">Welcome to Page 1</Text>
      <Text textAlign="center" color="$gray10">
        This is the first walkthrough / feature screen.
      </Text>
      <Button size="$4" onPress={() => router.push('/page2')}>
        Next
      </Button>
    </YStack>
  )
}
