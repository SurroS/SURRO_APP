import React, { useState } from "react";
import { TextInput, StyleSheet } from "react-native";
import { Label, View } from "tamagui";
import colors from "@/hooks/colors";

type DateInputProps = {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  width?: number | string;
};

export default function DateInput({
  label,
  placeholder = "DD/MM/YYYY",
  value,
  onChange,
  width = "100%",
}: DateInputProps) {
  const handleTextChange = (text: string) => {
    // Remove anything that is not a number
    let cleaned = text.replace(/[^\d]/g, "");

    // Auto-add slashes
    if (cleaned.length > 2) {
      cleaned = cleaned.slice(0, 2) + "/" + cleaned.slice(2);
    }
    if (cleaned.length > 5) {
      cleaned = cleaned.slice(0, 5) + "/" + cleaned.slice(5);
    }

    // Limit to 10 chars (DD/MM/YYYY)
    if (cleaned.length > 10) cleaned = cleaned.slice(0, 10);

    onChange(cleaned);
  };

  return (
    <View style={{ width }}>
      {label && (
        <Label fontWeight="600" fontSize={13} color={colors.text}>
          {label}
        </Label>
      )}

      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={handleTextChange}
        keyboardType="number-pad"
        placeholderTextColor="#B0B0B0"
        maxLength={10}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    paddingHorizontal: 12,
    fontSize: 16,
    color: "#000",
    borderWidth: 1,
    borderColor: "#E6E6E6",
    borderRadius: 8,
  },
});
