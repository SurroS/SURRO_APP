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
  lastName,
  country,
  stateOfOrigin,
  originStatesList,
  dob,
  maritalStatus,
  countries,
  setFirstName,
  setLastName,
  setCountry,
  setStateOfOrigin,
  setDob,
  setMaritalStatus,
}: any) {
  return (
    <YStack gap="$4" marginTop="$4">
      <SharedPersonalFields
        fullName={fullName}
        lastName={lastName}
        country={country}
        stateOfOrigin={stateOfOrigin}
        originStatesList={originStatesList}
        dob={dob}
        maritalStatus={maritalStatus}
        countries={countries}
        setFirstName={setFirstName}
        setLastName={setLastName}
        setCountry={setCountry}
        setStateOfOrigin={setStateOfOrigin}
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
