import React from 'react'
import { YStack, Text } from 'tamagui'

export default function ChatScreen() {
  return (
    <YStack flex={1} justifyContent={'center'} alignItems="center" >
      <Text color="$background" fontSize="$6" >Chat</Text>
    </YStack>
  )
}
