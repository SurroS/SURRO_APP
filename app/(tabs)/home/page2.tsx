import { useRouter } from 'expo-router'
import { Button, Image, Text, YStack } from 'tamagui'

export default function Page2() {
  const router = useRouter()

  return (
    <YStack flex={1} justifyContent="center" alignItems="center" space>
      <Image
        source={require('@/assets/images/page.jpg')}
        style={{ width: 250, height: 250, resizeMode: 'contain' }}
      />
      <Text fontSize="$6" fontWeight="bold">Discover Page 2</Text>
      <Text textAlign="center" color="$gray10">
        Here we explain another feature of the app.
      </Text>
      <Button size="$4" onPress={() => router.push('/page3')}>
        Next
      </Button>
    </YStack>
  )
}
