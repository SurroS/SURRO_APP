import React from 'react';
import { YStack, XStack, Text, Image, View } from 'tamagui';
import { useRouter } from 'expo-router';
import { ScreenHeader } from '@/components/navigation/ScreenHeader';


const WIDTH = 393;
const HEIGHT = 179.5;
const TITLE_TOP_OFFSET = 67;

type Props = {
  title?: string;
};

export default function RectangleCard({ title = 'Profile information' }: Props) {
  const router = useRouter();

  return (
    <YStack width={WIDTH} height={HEIGHT} overflow="hidden" paddingLeft={40}
    paddingTop={45}>
      {/* Background rectangle */}
      <Image
        source={require("@/assets/images/profileBanner.png")} 
        width={WIDTH}
        height={HEIGHT}
        position="absolute"
      />
<View justifyContent='center' >
<ScreenHeader title='Profile Information' onBackPress={()=>router.back()}/>
</View>
    </YStack>
  );
}
