import React from 'react'
import { YStack, XStack, Text, Image } from 'tamagui'
import InstagramIcon from '../../assets/images/instagramsvg (1).svg'

const socials = [
  { icon: require('../../assets/images/fb-icon.png'), label: '@mich123', type: 'png' },
  { icon: InstagramIcon, label: '@mich123', type: 'svg' },
]

const SocialsSection = () => {
  return (
    <YStack
      width="100%"
      borderBottomWidth={1}
      borderColor="$secondray"
      paddingBottom={20}
      gap="$3"
    >
      <Text fontSize={16} fontWeight="700" color="$text">
        Socials
      </Text>

      <XStack gap="$4">
        {socials.map((item, idx) => (
          <XStack key={idx} alignItems="center" gap="$2">
            {item.type === 'png' ? (
              <Image
                source={item.icon}
                width={20}
                height={20}
                borderRadius={4}
              />
            ) : (
              <InstagramIcon width={20} height={20} />
            )}
            <Text color="$text">{item.label}</Text>
          </XStack>
        ))}
      </XStack>
    </YStack>
  )
}

export default SocialsSection