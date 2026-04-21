import React from "react";
import { YStack, Text } from "tamagui";
import colors from "@/hooks/colors";

type DropdownFieldProps<T extends string> = {
  label: string;
  value: T;
  options: readonly T[];
  onChange: (value: T) => void;
};

const DrawerField = <T extends string>({
  label,
  value,
  options,
  onChange,
}: DropdownFieldProps<T>) => {
  return (
    <YStack
      borderWidth={1}
      borderColor="#E0E0E0"
      borderRadius="$4"
      padding="$3"
      backgroundColor="#FAFAFA"
      gap="$2"
    >
      <Text fontWeight="700" fontSize={15} style={{ color: colors.text }}>
        {label}
      </Text>

      <YStack gap="$2">
        {options.map((opt) => (
          <YStack
            key={opt}
            borderWidth={1}
            borderColor={value === opt ? colors.primary : "#E5E5E5"}
            borderRadius="$3"
            paddingVertical="$2"
            paddingHorizontal="$3"
            backgroundColor={value === opt ? "#E9F3FF" : "#FFF"}
            onPress={() => onChange(opt)}
          >
            <Text
              style={{ color: value === opt ? colors.primary : colors.text }}
              fontWeight={value === opt ? "600" : "400"}
            >
              {opt}
            </Text>
          </YStack>
        ))}
      </YStack>
    </YStack>
  );
};

export default DrawerField;
