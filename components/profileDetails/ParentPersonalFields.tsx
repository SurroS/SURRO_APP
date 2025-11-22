// components/personalDetails/ParentPersonalFields.tsx
import React from "react";
import SharedPersonalFields from "./SharedPersonalDetails";

export default function ParentPersonalFields(props:any) {
  // Intended Parents only use shared fields
  return <SharedPersonalFields {...props} />;
}
