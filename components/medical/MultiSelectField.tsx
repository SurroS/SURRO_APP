import React from "react";
import { Pressable } from "react-native";
import { YStack, Text, XStack } from "tamagui";

type Props = {
  label: string;
  options: string[];
  selected: string[];
  onChange: (values: string[]) => void;
};

const MultiSelectField = ({ label, options, selected, onChange }: Props) => {
  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter((v) => v !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  return (
    <YStack gap="$2">
      <Text fontWeight="600" color="black">{label}</Text>
      <YStack gap="$2">
        {options.map((option) => (
          <XStack key={option} gap="$2" alignItems="center">
            <Pressable
              onPress={() => toggleOption(option)}
              style={({ pressed }) => ({
                backgroundColor: selected.includes(option) ? "#4A90E2" : "#EEE",
                borderRadius: 24,
                paddingHorizontal: 16,
                paddingVertical: 8,
                opacity: pressed ? 0.8 : 1,
              })}
            >
              <Text
                color={selected.includes(option) ? "#FFF" : "#000"}
                fontSize={13}
              >
                {option}
              </Text>
            </Pressable>
          </XStack>
        ))}
      </YStack>
    </YStack>
  );
};

export default MultiSelectField;
