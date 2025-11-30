// components/personalDetails/SurrogatePersonalFields.tsx
import React from "react";
import { YStack } from "tamagui";
import NumberInput from "@/components/NumberInput";
import NumberInputSelect from "@/components/NumberInputSelect";
import { SurrogateStore } from "@/store/surrogates/types";
import SharedPersonalFields from "./SharedPersonalDetails";

export default function SurrogatePersonalFields({
  height,
  weight,
  children,
  setHeight,
  setWeight,
  setChildren,

  fullName,
  country,
  dob,
  maritalStatus,
  countries,
  setFirstName,
  setCountry,
  setDob,
  setMaritalStatus,
}: any) {
  return (
    <YStack gap="$4" marginTop="$4">
      <SharedPersonalFields
        fullName={fullName}
        country={country}
        dob={dob}
        maritalStatus={maritalStatus}
        countries={countries}
        setFirstName={setFirstName}
        setCountry={setCountry}
        setDob={setDob}
        setMaritalStatus={setMaritalStatus}
      />

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
