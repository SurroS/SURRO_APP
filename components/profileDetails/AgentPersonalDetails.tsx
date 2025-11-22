// components/personalDetails/AgentPersonalFields.tsx
import React from "react";
import SharedPersonalFields from "./SharedPersonalDetails";

export default function AgentPersonalFields(props:any) {
  // Agents only use shared fields
  return <SharedPersonalFields {...props} />;
}
