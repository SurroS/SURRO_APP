import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { YStack } from "tamagui";

type Platform = {
  key: string;
  icon: string;
  color: string;
  label?: string;
};

const PLATFORMS: Platform[] = [
  {
    key: "Instagram",
    icon: "logo-instagram",
    color: "#E1306C",
    label: "Instagram",
  },
  {
    key: "Facebook",
    icon: "logo-facebook",
    color: "#1877F2",
    label: "Facebook",
  },
  { key: "X", icon: "logo-twitter", color: "#000000", label: "X" },
  { key: "TikTok", icon: "logo-tiktok", color: "#000000", label: "TikTok" },
];

type PlatformInputProps = {
  onAdd?: (platform: string, handle: string) => void;
  initialPlatform?: string;
};

export default function PlatformInput({
  onAdd,
  initialPlatform = "Instagram",
}: PlatformInputProps) {
  const [selected, setSelected] = useState<Platform>(
    PLATFORMS.find((p) => p.key === initialPlatform) || PLATFORMS[0]
  );
  const [text, setText] = useState("");
  const [list, setList] = useState<{ platform: string; handle: string }[]>([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const fadeAnim = new Animated.Value(0);

  const handleAdd = () => {
    if (!text.trim()) return;
    const entry = { platform: selected.key, handle: text.trim() };
    setList((s) => [entry, ...s]);
    setText("");
    if (onAdd) onAdd(entry.platform, entry.handle);
  };

  const removeItem = (index: number) => {
    setList((s) => s.filter((_, i) => i !== index));
  };

  const toggleDropdown = () => {
    if (dropdownVisible) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start(() => setDropdownVisible(false));
    } else {
      setDropdownVisible(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }
  };

  return (
    <YStack>
      {/* Added list preview */}
      {list.length > 0 && (
        <View style={styles.addedContainer}>
          {list.map((item, i) => (
            <View key={`${item.platform}-${i}`} style={styles.addedRow}>
              <View style={styles.addedLeft}>
                <Ionicons
                  name={
                    PLATFORMS.find((p) => p.key === item.platform)?.icon as any
                  }
                  size={18}
                  color={PLATFORMS.find((p) => p.key === item.platform)?.color}
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.addedText}>
                  {item.platform}:{" "}
                  <Text style={{ fontWeight: "700" }}>{item.handle}</Text>
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => removeItem(i)}
                style={styles.removeBtn}
              >
                <Text style={styles.removeText}>delete</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {/* Row: dropdown, text input, add button */}
      <View style={styles.row}>
        <View style={{ position: "relative" }}>
          <TouchableOpacity
            style={styles.selectTrigger}
            onPress={toggleDropdown}
            activeOpacity={0.75}
          >
            <Ionicons
              name={selected.icon as any}
              size={18}
              color={selected.color}
            />
            <Ionicons
              name="chevron-down"
              size={16}
              color="#333"
              style={{ marginLeft: 6 }}
            />
          </TouchableOpacity>

          {dropdownVisible && (
            <Animated.View
              style={[
                styles.inlineDropdownCard,
                { opacity: fadeAnim, transform: [{ scale: fadeAnim }] },
              ]}
            >
              <FlatList
                data={PLATFORMS}
                keyExtractor={(item) => item.key}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.platformRow}
                    onPress={() => {
                      setSelected(item);
                      toggleDropdown();
                    }}
                  >
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Ionicons
                        name={item.icon as any}
                        size={20}
                        color={item.color}
                        style={{ marginRight: 12 }}
                      />
                      <Text style={styles.platformLabel}>
                        {item.label ?? item.key}
                      </Text>
                    </View>
                    {selected.key === item.key && (
                      <Ionicons name="checkmark" size={16} color="#0E0E55" />
                    )}
                  </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
              />
            </Animated.View>
          )}
        </View>

        <TextInput
          style={styles.input}
          placeholder={`Enter ${selected.key} handle or link`}
          value={text}
          onChangeText={setText}
          returnKeyType="done"
          onSubmitEditing={handleAdd}
          editable
        />

        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAdd}
          activeOpacity={0.8}
        >
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
    </YStack>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
  },
  selectTrigger: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E6E6E6",
    backgroundColor: "#F8F8FA",
    justifyContent: "center",
  },
  input: {
    flex: 1,
    height: 44,
    marginLeft: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E6E6E6",
    backgroundColor: "#fff",
  },
  addButton: {
    marginLeft: 8,
    backgroundColor: "#0E0E55",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: "center",
  },
  addButtonText: { color: "#fff", fontWeight: "700" },

  // added list
  addedContainer: {
    marginBottom: 12,
    paddingHorizontal: 12,
  },
  addedRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8F8FA",
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
  },
  addedLeft: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    width: "70%",
  },
  addedText: { color: "#111" },
  removeBtn: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  removeText: { color: "#E63946", fontWeight: "700" },

  // dropdown
  inlineDropdownCard: {
    position: "absolute",
    top: 48,
    left: 0,
    width: 150,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    zIndex: 100,
  },
  platformRow: {
    paddingVertical: 8,
    paddingHorizontal: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  platformLabel: { fontSize: 14, color: "#111" },
});
