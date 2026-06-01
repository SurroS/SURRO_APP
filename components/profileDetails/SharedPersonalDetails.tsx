// components/personalDetails/SharedPersonalFields.tsx
import React from "react";
import { YStack } from "tamagui";
import TextInputField from "@/components/TextInputField";
import Dropdown from "@/components/DropDown";
import NumberInput from "@/components/NumberInput";
import DateInput from "@/components/DateInput";

interface SharedPersonalFieldsProps {
  fullName?: string;
  lastName?: string;
  country?: any;
  dob?: string;
  maritalStatus?: string;
  countries?: Array<{ label: string; value: string }>;
  setFirstName?: (value: string) => void;
  setLastName?: (value: string) => void;
  setCountry?: (value: string) => void;
  setDob?: (value: string) => void;
  setMaritalStatus?: (value: string) => void;
}

export default function SharedPersonalFields({
  fullName = "",
  lastName = "",
  country = "",
  dob = "",
  maritalStatus = "",
  countries = [],
  setFirstName = () => {},
  setLastName = () => {},
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

      <TextInputField
        label="Last name"
        placeholder="Last name"
        value={lastName}
        onChangeText={setLastName}
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
