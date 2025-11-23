import React, { useState } from "react";
import {
  Pressable,
  Modal,
  FlatList,
  View,
  Text,
  TextInput,
  Image,
  TouchableWithoutFeedback,
} from "react-native";
import { YStack, Label } from "tamagui";
import colors from "@/hooks/colors";
import { Check } from "@tamagui/lucide-icons";

interface DropdownProps {
  label?: string;
  placeholder: string;
  value: any;
  options: any[];
  onSelect: (item: any) => void;
  multiple?: boolean;
  displayKey?: string; // Defaults: item.name || item
}

const Dropdown = ({
  label,
  placeholder,
  value,
  options = [],
  onSelect,
  multiple = false,
  displayKey,
}: DropdownProps) => {
  const [visible, setVisible] = useState(false);
  const [search, setSearch] = useState("");

  const getLabel = (item: any) => {
    if (typeof item === "string") return item;
    if (displayKey && item[displayKey]) return item[displayKey];
    return item.name || item;
  };

  const filteredOptions = options.filter((item) =>
    getLabel(item).toLowerCase().includes(search.toLowerCase())
  );

  const isSelected = (item: any) => {
    if (!multiple) return getLabel(item) === value;
    return Array.isArray(value) && value.includes(getLabel(item));
  };

  const handleSelect = (item: any) => {
    if (!multiple) {
      onSelect(item);
      setVisible(false);
      return;
    }

    // MULTI SELECT
    const label = getLabel(item);

    if (Array.isArray(value) && value.includes(label)) {
      onSelect(value.filter((v: any) => v !== label));
    } else {
      onSelect([...(value || []), label]);
    }
  };

  const renderValue = () => {
    if (multiple) {
      if (!value || value.length === 0) return placeholder;
      return value.join(", ");
    }
    return value || placeholder;
  };

  return (
    <YStack gap="$1">
      {label && (
        <Label fontWeight="600" fontSize={15} color={colors.text}>
          {label}
        </Label>
      )}

      {/* Trigger */}
      <Pressable
        onPress={() => setVisible(true)}
        style={{
          borderWidth: 1,
          borderColor: "#E6E6E6",
          borderRadius: 8,
          paddingHorizontal: 12,
          height: 50,
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            color: value ? colors.text : "#9B9B9B",
            fontSize: 16,
          }}
        >
          {renderValue()}
        </Text>
      </Pressable>

      {/* Modal */}
      <Modal visible={visible} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => setVisible(false)}>
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.3)",
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: 20,
            }}
          >
            <TouchableWithoutFeedback>
              <View
                style={{
                  backgroundColor: "white",
                  borderRadius: 10,
                  width: "100%",
                  maxHeight: "72%",
                  padding: 16,
                }}
              >
                {/* Search Bar */}
                <TextInput
                  placeholder="Search..."
                  placeholderTextColor="#999"
                  value={search}
                  onChangeText={setSearch}
                  style={{
                    borderWidth: 1,
                    borderColor: "#E6E6E6",
                    borderRadius: 8,
                    paddingHorizontal: 10,
                    height: 45,
                    marginBottom: 12,
                    fontSize: 16,
                    color: colors.text,
                  }}
                />

                {/* Options */}
                <FlatList
                  data={filteredOptions}
                  keyExtractor={(item, index) => index.toString()}
                  keyboardShouldPersistTaps="handled"
                  renderItem={({ item }) => {
                    const label = getLabel(item);

                    return (
                      <Pressable
                        onPress={() => handleSelect(item)}
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          paddingVertical: 12,
                          borderBottomWidth: 1,
                          borderBottomColor: "#f0f0f0",
                        }}
                      >
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                          {item.flag && (
                            <Image
                              source={{ uri: item.flag }}
                              style={{
                                width: 24,
                                height: 16,
                                borderRadius: 2,
                                marginRight: 8,
                              }}
                            />
                          )}
                          <Text style={{ fontSize: 16, color: colors.text }}>
                            {label}
                            {item.dialCode ? ` (${item.dialCode})` : ""}
                          </Text>
                        </View>

                        {isSelected(item) && (
                          <Check size={18} color={colors.primary} />
                        )}
                      </Pressable>
                    );
                  }}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </YStack>
  );
};

export default Dropdown;
