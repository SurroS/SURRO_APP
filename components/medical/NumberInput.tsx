import React from "react";
import { YStack, XStack, Text, View } from "tamagui";

type NumberInputProps = {
  label: string;
  value: number;
  onChange: (value: number) => void;
};

const NumberInput = ({ label, value, onChange }: NumberInputProps) => {
  return (
    <YStack gap="$2">
      {/* Label */}
      <Text fontWeight="700" color="#000" fontSize={15}>
        {label}
      </Text>

      {/* Input Row */}
      <XStack
        borderWidth={1}
        borderColor="#D0D0D0"
        borderRadius="$5"
        alignItems="center"
        justifyContent="space-between"
        paddingHorizontal="$3"
        paddingVertical="$2"
        backgroundColor="#FAFAFA"
      >
        {/* Decrease */}
        <View
          backgroundColor="#F2F2F2"
          borderRadius="$10"
          paddingHorizontal={14}
          paddingVertical={6}
          onPress={() => onChange(Math.max(0, value - 1))}
        >
          <Text fontSize={18} color="#000">
            –
          </Text>
        </View>

        {/* Value */}
        <Text fontSize={16} fontWeight="600" color="#000">
          {value}
        </Text>

        {/* Increase */}
        <View
          backgroundColor="#F2F2F2"
          borderRadius="$10"
          paddingHorizontal={14}
          paddingVertical={6}
          onPress={() => onChange(value + 1)}
        >
          <Text fontSize={18} color="#000">
            +
          </Text>
        </View>
      </XStack>
    </YStack>
  );
};

export default NumberInput;
