import { YStack, Text } from 'tamagui'

export default function HomeScreen() {
  return (
    <YStack flex={1} justify={'center'} items="center">
      <Text color="$background" fontSize="$6" >Home</Text>
    </YStack>
  )
}
