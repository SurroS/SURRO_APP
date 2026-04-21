import React from "react";
import { TextInput, StyleSheet,} from "react-native";
import { Label, View  } from "tamagui";
import colors from "@/hooks/colors";

type NumberInputProps = {
  label?: string;
  placeholder?: string;
  value: string | number;
  onChange: (value: string) => void;
  width?: number | string;
};

export default function NumberInput({
  label,
  placeholder,
  value,
  onChange,
  width = "100%",
}: NumberInputProps) {
  return (
    <View style={{ width:width }}>
      {label && <Label fontWeight="600"fontSize={15} color={colors.text}>{label}</Label>}
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value ? String(value) : ""}
        onChangeText={onChange}
        keyboardType="number-pad"
        placeholderTextColor="#B0B0B0"
      />  
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    marginBottom: 6,
    color: "$color",
    fontWeight: "500",
  },
  input: {
    flex: 1,
    height: 46,
    paddingHorizontal: 12,
    fontSize: 16,
    color: "#000",
    borderWidth: 1,
    borderColor: "#E6E6E6",
    borderRadius: 8,
  },
});
