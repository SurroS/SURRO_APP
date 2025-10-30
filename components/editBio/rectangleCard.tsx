import React from 'react';
import { YStack, XStack, Text, Image, Button } from 'tamagui';
import { useRouter } from 'expo-router';
import  Images  from '@/assets/images/avatar.jpg';

const WIDTH = 393;
const HEIGHT = 179.5;
const TITLE_TOP_OFFSET = 67;

type Props = {
  title?: string;
};

export default function RectangleCard({ title = 'Profile information' }: Props) {
  const router = useRouter();

  return (
    <YStack width={WIDTH} height={HEIGHT} overflow="hidden" alignItems="center">
      {/* Background rectangle */}
      <Image
        source={Images}
        resizeMode="cover"
        width={WIDTH}
        height={HEIGHT}
        position="absolute"
      />

      {/* Title centered absolutely */}
      <Text
        position="absolute"
        top={TITLE_TOP_OFFSET}
        textAlign="center"
        fontFamily="Body"
        fontWeight="700"
        fontSize={16}
        lineHeight={24}
        color="#FFFFFF"
      >
        {title}
      </Text>

      {/* Back button */}
<Button
  chromeless
  onPress={() => router.back()}
  position="absolute"
  top={20}
  left={16}
  padding={0}
  zIndex={10}
>
 <Image
  source={Images.chevronLeft}
  width={20}
  height={20}
  resizeMode="contain"
/>
</Button>

    </YStack>
  );
}
