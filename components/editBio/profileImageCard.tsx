import colors from "@/hooks/colors";
import { Camera, Pen } from "@tamagui/lucide-icons";
import React from "react";
import { Pressable } from "react-native";
import { YStack, Button, Image, Text } from "tamagui";

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
          source={imageSrc || require("@/assets/images/avatar.jpg")}
          width={120}
          height={120}
          borderRadius={12}
        />
      </YStack>

      {/* Change Profile Picture Button */}
      <Pressable
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={onChangePicture}
      >
        <Text color="$text" textDecorationLine="underline">
          Change profile picture {""}
          <Camera size={16} color={colors.text} />
        </Text>
      </Pressable>

      {/* Edit Bio Button */}
      <Button
        backgroundColor="#EBF4FE"
        onPress={onEditBio}
        iconAfter={<Pen width={16} color={colors.text} />}
        paddingHorizontal={12}
        paddingVertical={8}
        elevate
      >
        <Text fontSize={14} fontWeight="500" color="$text">
          Edit bio
        </Text>
      </Button>
    </YStack>
  );
}
