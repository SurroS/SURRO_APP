import React from "react";
import { YStack, Text } from "tamagui";
import { TextInput } from "react-native";
import colors from "@/hooks/colors";

type Props = {
  label: string;
  placeholder?: string;
  value: string;
  onChangeText: (val: string) => void;
};

const TextInputField = ({ label, placeholder, value, onChangeText }: Props) => (
  <YStack gap="$2">
    <Text fontWeight="600" color={colors.text}>
      {label}
    </Text>
    <TextInput
      style={{
        borderColor: "#E6E6E6",
        borderWidth: 1,
        borderRadius: 5,
        color:colors.text, 
        padding:15
      }}
      placeholder={placeholder}
      placeholderTextColor={"gray"}
      value={value}
      onChangeText={onChangeText}
    />
  </YStack>
);

export default TextInputField;
