import React from 'react'
import { YStack, XStack, Text } from 'tamagui'

const ContactSection = () => {
  return (
    <YStack
      width="100%"
      borderBottomWidth={1}
      borderColor="$secondray"
      paddingBottom={20}
      gap="$3"
    >
      <Text fontSize={16} fontWeight="700" color="$text">
        Contact
      </Text>

      {/* Email and Phone on the same line */}
      <XStack alignItems="center" gap="$4">
        <XStack alignItems="center" gap="$2">
          <Text>✉️</Text>
          <Text color="$text">michelle@gmail.com</Text>
        </XStack>

        <XStack alignItems="center" gap="$2">
          <Text>📞</Text>
          <Text color="$text">2363487892</Text>
        </XStack>
      </XStack>
    </YStack>
  )
}

export default ContactSection