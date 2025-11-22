// components/personalDetails/SurrogatePersonalFields.tsx
import React from "react";
import { YStack } from "tamagui";
import NumberInput from "@/components/NumberInput";
import NumberInputSelect from "@/components/NumberInputSelect";
import { SurrogateStore } from "@/store/surrogates/types";

export default function SurrogatePersonalFields({
  height,
  weight,
  children,
  setHeight,
  setWeight,
  setChildren,
}:any) {
  return (
    <YStack gap="$4" marginTop="$4">
      <NumberInput
        label="Height (cm)"
        value={height}
        placeholder="Enter height in cm"
        onChange={setHeight}
      />

      <NumberInput
        label="Weight (kg)"
        value={weight}
        placeholder="Enter weight in kg"
        onChange={setWeight}
      />

      <NumberInputSelect
        label="Number of children"
        value={children}
        onChange={setChildren}
      />
    </YStack>
  );
}
