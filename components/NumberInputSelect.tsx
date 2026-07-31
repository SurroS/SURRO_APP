import React from "react";
import { YStack, XStack, Text, Input, View } from "tamagui";
import colors from "@/hooks/colors";

type NumberInputSelectProps = {
  label?: string;
  value: number | string;
  onChange: (value: number) => void;
  placeholder?: string;
  data?: any[];
  min?: number;
  max?: number;
};

const NumberInputSelect = ({
  label,
  value,
  onChange,
  placeholder,
  data,
  min = 0,
  max = 999,
}: NumberInputSelectProps) => {
  // handle direct typing
  const handleTextChange = (text: string) => {
    const num = parseFloat(text);
    if (!isNaN(num)) {
      if (num >= min && num <= max) onChange(num);
    } else if (text === "") {
      onChange(0);
    }
  };

  return (
    <YStack gap="$2">
      {label && (
        <Text fontWeight="600"fontSize={13} color={colors.text}>
          {label}
        </Text>
      )}

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
          onPress={() => onChange(Math.max(min, Number(value) - 1))}
        >
          <Text fontSize={18} color="#000">
            –
          </Text>
        </View>

        {/* Value input */}
        <Input
          keyboardType="numeric"
          value={String(value || "0")}
          onChangeText={handleTextChange}
          placeholder={placeholder || "Enter value"}
          textAlign="center"
          flex={1}
          backgroundColor="transparent"
          color="#000"
          borderWidth={0}
          fontSize={16}
          fontWeight="600"
        />

        {/* Increase */}
        <View
          backgroundColor="#F2F2F2"
          borderRadius="$10"
          paddingHorizontal={14}
          paddingVertical={6}
          onPress={() => onChange(Math.min(max, Number(value) + 1))}
        >
          <Text fontSize={18} color="#000">
            +
          </Text>
        </View>
      </XStack>
    </YStack>
  );
};

export default NumberInputSelect;
