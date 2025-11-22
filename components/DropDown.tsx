import React, { useState } from "react";
import {
  Pressable,
  Modal,
  FlatList,
  View,
  Text,
  TextInput,
  Image,
} from "react-native";
import { YStack, Label } from "tamagui";
import colors from "@/hooks/colors";

const Dropdown = ({
  label,
  placeholder,
  value,
  options = [],
  onSelect,
}: {
  label?: string;
  placeholder: string;
  value: string;
  options: any[];
  onSelect: (item: any) => void;
}) => {
  const [visible, setVisible] = useState(false);
  const [search, setSearch] = useState("");

  const filteredOptions = options.filter((item) =>
    (item.name || item).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <YStack gap="$1">
      {label && <Label fontWeight="600"fontSize={15} color={colors.text}>{label}</Label>}

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
        <Text style={{ color: value ? colors.text : "#9B9B9B", fontSize: 16 }}>
          {value || placeholder}
        </Text>
      </Pressable>

      <Modal visible={visible} transparent animationType="fade">
        <Pressable
          onPress={() => setVisible(false)}
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.3)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 10,
              width: "85%",
              maxHeight: "70%",
              padding: 16,
            }}
          >
            {/* Search Input */}
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
                marginBottom: 10,
                fontSize: 16,
                color: colors.text,
              }}
            />

            {/* Country List */}
            <FlatList
              data={filteredOptions}
              keyExtractor={(item, index) => index.toString()}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    onSelect(item);
                    setVisible(false);
                  }}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 10,
                    borderBottomWidth: 1,
                    borderBottomColor: "#f0f0f0",
                  }}
                >
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
                    {item.name || item}
                    {item.dialCode ? ` (${item.dialCode})` : ""}
                  </Text>
                </Pressable>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </YStack>
  );
};

export default Dropdown;
