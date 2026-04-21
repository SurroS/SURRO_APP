// components/Button.tsx
import React from "react";
import { Button as TButton, Text } from "tamagui";

interface Props {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary"; // allow theme variants
}

export default function Button({ title, onPress, variant = "primary" }: Props) {
  return (
    <TButton
      onPress={onPress}
      backgroundColor={`$${variant}`}
      borderRadius="$4"
      padding="$3"
      pressStyle={{ opacity: 0.8 }}
    >
      <Text color="$white" fontWeight="600">
        {title}
      </Text>
    </TButton>
  );
}
