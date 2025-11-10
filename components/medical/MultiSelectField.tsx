import React from "react";
import { YStack, Text, XStack, Button } from "tamagui";

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
            <Button
              onPress={() => toggleOption(option)}
              backgroundColor={selected.includes(option) ? "#4A90E2" : "#EEE"}
              color={selected.includes(option) ? "#FFF" : "#000"}
              borderRadius="$6"
              size="$3"
              fontSize={13}
            >
              {option}
            </Button>
          </XStack>
        ))}
      </YStack>
    </YStack>
  );
};

export default MultiSelectField;
