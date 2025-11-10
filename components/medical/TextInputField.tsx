import React from "react";
import { YStack, Text } from "tamagui";
import { TextInput } from "react-native";

type Props = {
  label: string;
  placeholder?: string;
  value: string;
  onChangeText: (val: string) => void;
};

const TextInputField = ({ label, placeholder, value, onChangeText }: Props) => (
  <YStack gap="$2">
    <Text fontWeight="600" color="black">
      {label}
    </Text>
    <TextInput
      style={{
        borderColor: "#CCC",
        borderWidth: 1,
        borderRadius: 5,
        color: "black",
        padding:5
      }}
      placeholder={placeholder}
      placeholderTextColor={"gray"}
      value={value}
      onChangeText={onChangeText}
    />
  </YStack>
);

export default TextInputField;
