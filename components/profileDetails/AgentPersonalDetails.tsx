import React from "react";
import { YStack } from "tamagui";
import TextInputField from "@/components/TextInputField";
import Dropdown from "@/components/DropDown";
import DateInput from "@/components/DateInput";

interface AgentPersonalFieldsProps {
  fullName?: string;
  lastName?: string;
  country?: string;
  stateOfOrigin?: string;
  originStatesList?: string[];
  dob?: string;
  countries?: Array<{ label: string; value: string }>;
  setFirstName?: (value: string) => void;
  setLastName?: (value: string) => void;
  setCountry?: (value: string) => void;
  setStateOfOrigin?: (value: string) => void;
  setDob?: (value: string) => void;
}

export default function AgentPersonalFields({
  fullName = "",
  lastName = "",
  country = "",
  stateOfOrigin = "",
  originStatesList = [],
  dob = "",
  countries = [],
  setFirstName = () => {},
  setLastName = () => {},
  setCountry = () => {},
  setStateOfOrigin = () => {},
  setDob = () => {},
}: AgentPersonalFieldsProps) {
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
        label="Country"
        placeholder="Select a country"
        value={countryName}
        options={countries}
        onSelect={(item) => setCountry(String(item))}
      />

      <Dropdown
        label="State"
        placeholder="Select a state"
        value={stateOfOrigin}
        options={originStatesList}
        onSelect={(item) => setStateOfOrigin(String(item))}
      />

      <DateInput
        label="Date of birth"
        placeholder="DD/MM/YYYY"
        value={dob}
        onChange={setDob}
      />
    </YStack>
  );
}
