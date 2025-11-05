// components/PlatformInputNative.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

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

export default function PlatformInput({
  onAdd,
  initialPlatform = "Instagram",
}: {
  onAdd?: (platform: string, handle: string) => void;
  initialPlatform?: string;
}) {
  const [selected, setSelected] = useState<Platform>(
    PLATFORMS.find((p) => p.key === initialPlatform) || PLATFORMS[0]
  );
  const [text, setText] = useState("");
  const [list, setList] = useState<{ platform: string; handle: string }[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  const handleAdd = () => {
    if (!text.trim()) return;
    const entry = { platform: selected.key, handle: text.trim() };
    setList((s) => [entry, ...s]); // newest first
    setText("");
    if (onAdd) onAdd(entry.platform, entry.handle);
  };

  const removeItem = (index: number) => {
    setList((s) => s.filter((_, i) => i !== index));
  };

  return (
    <SafeAreaView style={{ width: "100%" }}>
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

      {/* Row: select trigger, input, add button */}
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.selectTrigger}
          onPress={() => setModalVisible(true)}
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

      {/* Modal for platform selection */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Choose platform</Text>
            <FlatList
              data={PLATFORMS}
              keyExtractor={(item) => item.key}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.platformRow}
                  onPress={() => {
                    setSelected(item);
                    setModalVisible(false);
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Ionicons
                      name={item.icon as any}
                      size={22}
                      color={item.color}
                      style={{ marginRight: 12 }}
                    />
                    <Text style={styles.platformLabel}>
                      {item.label ?? item.key}
                    </Text>
                  </View>
                  {selected.key === item.key && (
                    <Ionicons name="checkmark" size={18} color="#0E0E55" />
                  )}
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
            />

            <TouchableOpacity
              style={styles.modalClose}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
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
  selectText: {
    marginLeft: 8,
    color: "#212121",
    fontWeight: "600",
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
  addedLeft: { flexDirection: "row", alignItems: "center", flexWrap:"wrap", width:"70%" },
  addedText: { color: "#111" },
  removeBtn: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  removeText: { color: "#E63946", fontWeight: "700", },

  // modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.32)",
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: "60%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    color: "#0E0E55",
  },
  platformRow: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  platformLabel: { fontSize: 16, color: "#111" },
  modalClose: {
    marginTop: 12,
    alignItems: "center",
    paddingVertical: 12,
  },
  modalCloseText: { color: "#0E0E55", fontWeight: "700" },
});
