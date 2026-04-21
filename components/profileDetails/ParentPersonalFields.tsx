// components/personalDetails/ParentPersonalFields.tsx
import React from "react";
import SharedPersonalFields from "./SharedPersonalDetails";

interface ParentPersonalFieldsProps {
  fullName?: string;
  country?: string;
  dob?: string;
  maritalStatus?: string;
  countries?: Array<{ label: string; value: string }>;
  setFirstName?: (value: string) => void;
  setCountry?: (value: string) => void;
  setDob?: (value: string) => void;
  setMaritalStatus?: (value: string) => void;
}

export default function ParentPersonalFields(props: ParentPersonalFieldsProps) {
  // Intended Parents only use shared fields
  return <SharedPersonalFields {...props} />;
}
