import { YStack, Text } from 'tamagui'

export default function ParentScreen() {
  return (
    <YStack flex={1} justify={'center'} items="center" >
      <Text color="$background" fontSize="$6" >Parent</Text>
    </YStack>
  )
}
