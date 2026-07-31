// components/Button.tsx
import React, { useState, useRef } from "react";
import { Button as TButton, Text } from "tamagui";

interface Props {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary";
  disabled?: boolean;
}

export default function Button({ title, onPress, variant = "primary", disabled = false }: Props) {
  const [pressedOnce, setPressedOnce] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handlePress = () => {
    if (pressedOnce) return;
    setPressedOnce(true);
    onPress();
    timerRef.current = setTimeout(() => setPressedOnce(false), 500);
  };

  const isDisabled = disabled || pressedOnce;

  return (
    <TButton
      onPress={handlePress}
      backgroundColor={`$${variant}`}
      borderRadius="$4"
      padding="$3"
      pressStyle={{ opacity: 0.8 }}
      disabled={isDisabled}
      opacity={isDisabled ? 0.6 : 1}
    >
      <Text color="$white" fontWeight="600">
        {title}
      </Text>
    </TButton>
  );
}
