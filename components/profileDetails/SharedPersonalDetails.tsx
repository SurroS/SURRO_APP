// components/personalDetails/SharedPersonalFields.tsx
import React from "react";
import { YStack } from "tamagui";
import TextInputField from "@/components/TextInputField";
import Dropdown from "@/components/DropDown";
import NumberInput from "@/components/NumberInput";
import DateInput from "@/components/DateInput";

interface SharedPersonalFieldsProps {
  fullName?: string;
  country?: any;
  dob?: string;
  maritalStatus?: string;
  countries?: Array<{ label: string; value: string }>;
  setFirstName?: (value: string) => void;
  setCountry?: (value: string) => void;
  setDob?: (value: string) => void;
  setMaritalStatus?: (value: string) => void;
}

export default function SharedPersonalFields({
  fullName = "",
  country = "",
  dob = "",
  maritalStatus = "",
  countries = [],
  setFirstName = () => {},
  setCountry = () => {},
  setDob = () => {},
  setMaritalStatus = () => {},
}: SharedPersonalFieldsProps) {
  const countryName = typeof country === "object" && country ? country.name || country.label || "" : country;
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
        value={countryName}
        options={countries}
        onSelect={(item) => setCountry(String(item))}
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
        options={[
          { label: "Single", value: "Single" },
          { label: "Married", value: "Married" },
          { label: "Divorced", value: "Divorced" },
          { label: "Widowed", value: "Widowed" },
        ]}
        onSelect={(item) => setMaritalStatus(String(item))}
      />
    </YStack>
  );
}
