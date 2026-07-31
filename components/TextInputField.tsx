import React from "react";
import { YStack, Text } from "tamagui";
import { TextInput } from "react-native";
import  colors from "@/hooks/colors";

type Props = {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (val: string) => void;
  multiline?: boolean;
};

const TextInputField = ({
  label,
  placeholder,
  value,
  onChangeText,
  multiline,
}: Props) => (
  <YStack gap="$2">
    <Text fontWeight="600" fontSize={13} color={colors.text}>
      {label}
    </Text>
    <TextInput
      style={{
        borderColor: "#E6E6E6",
        borderWidth: 1,
        borderRadius: 5,
        color: "#1E1E1E",
        padding: 12,
      }}
      multiline={multiline}
      placeholder={placeholder}
      placeholderTextColor="#999999"
      value={value}
      onChangeText={onChangeText}
    />
  </YStack>
);

export default TextInputField;
