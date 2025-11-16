// components/editBio/EditBioModal.tsx
import React, { useState } from "react";
import { YStack, XStack, Text, Button, Input } from "tamagui";
import BottomModal from "../modals/BottomModal"; // use the team lead's BottomModal

interface Props {
  visible: boolean;
  onClose: () => void;
}

const EditBioModal: React.FC<Props> = ({ visible, onClose }) => {
  const [bioFields, setBioFields] = useState([
    { id: "fullName", label: "Full Name", value: "" },
    { id: "bio", label: "Bio", value: "" },
    { id: "experience", label: "Experience", value: "" },
  ]);

  const handleChange = (id: string, value: string) => {
    setBioFields((prev) =>
      prev.map((field) => (field.id === id ? { ...field, value } : field))
    );
  };

  const handleSave = () => {
    // Here you would typically save the data to state management, API, etc.
    console.log("Saving bio fields:", bioFields);
    onClose(); // Close the modal after saving
  };

  return (
    <BottomModal
      visible={visible}
      onClose={onClose}
      title="Edit Bio"
      message="Update your information below"
      buttons={[
        {
          label: "Save",
          color: "#0E0E55",
          onPress: handleSave, // Use the proper save handler
        },
      ]}
    >
      {/* Modal custom content */}
      <YStack gap="$3" marginBottom="$4">
        {bioFields.map((field) => (
          <YStack key={field.id} gap="$1">
            {" "}
            {/* Key is already unique */}
            <Text fontWeight="600">{field.label}</Text>
            <Input
              value={field.value}
              placeholder={`Enter your ${field.label.toLowerCase()}`}
              onChangeText={(text) => handleChange(field.id, text)}
              width="100%"
            />
          </YStack>
        ))}
      </YStack>
    </BottomModal>
  );
};

export default EditBioModal;
