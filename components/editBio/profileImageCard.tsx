import React from 'react';
import { YStack, Button, Image, Text } from 'tamagui';
import { Images } from '../../constants/Images';

const CARD_W = 197;
const CARD_H = 156;

type Props = {
  onChangePicture?: () => void;
  onEditBio?: () => void;
  imageSrc?: any;
};

export default function ProfileImageCard({
  onChangePicture,
  onEditBio,
  imageSrc,
}: Props) {
  return (
    <YStack
      width={CARD_W}
      height={CARD_H}
      alignItems="center"
      justifyContent="center"
      gap="$2"
    >
      {/* Profile Image */}
      <YStack
        width={120}
        height={120}
        alignItems="center"
        justifyContent="center"
        backgroundColor="#F6F4F4"
        borderRadius={12}
        overflow="hidden"
        marginTop={-60}
        zIndex={10}
      >
        <Image
          source={imageSrc || Images.profilePlaceholder}
          width={120}
          height={120}
          borderRadius={12}
          resizeMode="cover"
        />
      </YStack>

      {/* Change Profile Picture Button */}
      <Button
        width={CARD_W + 40}
        onPress={onChangePicture}
        iconAfter={<Image source={Images.camera} width={16} height={16} />}
        color="$text"
      >
        Change profile picture
      </Button>

      {/* Edit Bio Button */}
      <Button
        backgroundColor="#EBF4FE"
        onPress={onEditBio}
        iconAfter={<Image source={Images.pencil} width={16} height={16} />}
        paddingHorizontal={12}
        paddingVertical={8}
      >
        <Text fontSize={14} fontWeight="500" color="$text">
          Edit bio
        </Text>
      </Button>
    </YStack>
  );
}
