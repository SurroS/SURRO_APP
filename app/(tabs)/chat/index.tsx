import { YStack, Text } from 'tamagui'

export default function ChatScreen() {
  return (
    <YStack flex={1} justify={'center'} items="center" bg="$background">
      <Text fontSize="$6" >Chat</Text>
    </YStack>
  )
}
