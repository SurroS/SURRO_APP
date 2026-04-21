// components/personalDetails/AgentPersonalFields.tsx
import React from "react";
import SharedPersonalFields from "./SharedPersonalDetails";

interface AgentPersonalFieldsProps {
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

export default function AgentPersonalFields(props: AgentPersonalFieldsProps) {
  // Agents only use shared fields
  return <SharedPersonalFields {...props} />;
}
