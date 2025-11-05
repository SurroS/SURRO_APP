// components/editBio/SocialRow.tsx
import React from 'react';
import { XStack, YStack, Text, Button, Input, Image } from 'tamagui'; 

type Props = {
  platform: string;
  value: string;
  onChange: (text: string) => void;
  onRemove: () => void;
};

export default function SocialRow({ platform, value, onChange, onRemove }: Props) {
  const icon =
    platform === 'Instagram'
      ? require("@/assets/images/x_icon.png")
      : platform === 'Facebook'
      ? require("@/assets/images/facebook.png")
      : platform === 'TikTok'
      ? require("@/assets/images/x_icon.png")
      : require("@/assets/images/x_icon.png")

  return (
    <XStack alignItems="center" gap="$3">
      <XStack flex={1} gap="$2" alignItems="center">
        <Image source={icon} width={20} height={20} />
        <Input
          value={value}
          onChangeText={onChange}
          placeholder={`@${platform.toLowerCase()}`}
          height={40}
          borderRadius={8}
        />
      </XStack>

      <Button
        onPress={onRemove}
        width={44}
        height={40}
        borderRadius={8}
        bordered
        backgroundColor="$background"
      >
        <Text>—</Text>
      </Button>
    </XStack>
  );
}
