import React from 'react'
import { XStack, YStack, Image } from 'tamagui'

// Local image imports (adjust extensions if needed)
import gallery1 from '@/assets/images/image2.png'
import gallery2 from '@/assets/images/image2.png'

const galleryImages = [gallery1, gallery2]

const GallerySection = () => {
  return (
    <XStack
      gap="$3"
      flexWrap="wrap"          // Allows wrapping on smaller screens
      justifyContent="space-between"
    >
      {galleryImages.map((img, idx) => (
        <YStack
          key={idx}
          width="48%"           // Two images per row
          borderRadius={12}
          overflow="hidden"
          marginBottom="$3"     // Space between rows
        >
          <Image
  source={img}
  width="90%"
  height={120}
  resizeMode="cover"
  style={{
    borderRadius: 12,
    alignSelf: "center", // center it horizontally
  }}
/>
        </YStack>
      ))}
    </XStack>
  )
}

export default GallerySection
