// components/personalDetails/SharedPersonalFields.tsx
import React from "react";
import { YStack } from "tamagui";
import TextInputField from "@/components/TextInputField";
import Dropdown from "@/components/DropDown";
import NumberInput from "@/components/NumberInput";
import DateInput from "../DateInput";

export default function SharedPersonalFields({
  fullName, 
  country,
  dob,
  maritalStatus,
  countries,
  setFirstName,
  setCountry,
  setDob,
  setMaritalStatus,
}:any) {
  return (
    <YStack gap="$4">
      <TextInputField
        label="First name"
        placeholder="First name"
        value={fullName}
        onChangeText={setFirstName}
      />
 

      <Dropdown
        label="Country of origin"
        placeholder="Select a country"
        value={country?.name || ""}
        options={countries}
        onSelect={setCountry}
      />

      <DateInput
        label="Date of birth"
        placeholder="DD/MM/YYYY"
        value={dob}
        onChange={setDob}
      />

      <Dropdown
        label="Marital status"
        placeholder="Select"
        value={maritalStatus}
        options={["Single", "Married", "Divorced", "Widowed"]}
        onSelect={setMaritalStatus}
      />
    </YStack>
  );
}
