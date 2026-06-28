import React, { useState } from "react";
import { Pressable, TextInput } from "react-native";
import { YStack, Button, ScrollView, XStack, Text } from "tamagui";
import { ScreenHeader } from "@/components/auth";
import { router } from "expo-router";
import { Toast } from "toastify-react-native";
import colors from "@/hooks/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { ToastType } from "toastify-react-native/utils/interfaces";
import { useAgentProfile } from "@/hooks/profile/useAgentProfile";

const SPECIALIZATIONS = [
  "Surrogacy Coordination",
  "Surrogate care giving",
  "Emotional support",
  "Progress tracking and documentation",
  "IVF Clinic Liaison",
  "Counseling Support",
];

export default function AgentSpecializationSection() {
  const { agentProfile, updateAgentProfile } = useAgentProfile();
  const [isSaving, setIsSaving] = useState(false);
  const [specialties, setSpecialties] = useState<string[]>(() => {
    return agentProfile?.services || [];
  });

  const toggle = (item: string) => {
    setSpecialties((prev) =>
      prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]
    );
  };

  const selectAll = () => setSpecialties([...SPECIALIZATIONS]);
  const deselectAll = () => setSpecialties([]);

  const save = async () => {
    if (isSaving) return;
    if (specialties.length === 0) {
      Toast.show({
        text1: "Select at least one specialization",
        type: "customError" as ToastType,
      });
      return;
    }
    setIsSaving(true);
    try {
      await updateAgentProfile({ services: specialties });
      setIsSaving(false);
      Toast.show({
        text1: "Specializations updated",
        type: "customSuccess" as ToastType,
      });
      setTimeout(() => router.back(), 500);
    } catch {
      setIsSaving(false);
      Toast.show({
        text1: "Failed to update",
        type: "customError" as ToastType,
      });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 20 }}>
      <ScreenHeader title="Specializations" onBackPress={() => router.back()} />

      <ScrollView>
        <YStack gap="$4">
          <Text fontWeight="600" fontSize={15} color={colors.text}>
            Your Specialties
          </Text>

          <TextInput
            style={{
              borderWidth: 1,
              borderColor: "#E6E6E6",
              borderRadius: 8,
              padding: 12,
              fontSize: 15,
              color: "#333",
            }}
            value={
              specialties.length > 0
                ? specialties.join(", ")
                : "Select all that applies"
            }
            editable={false}
            multiline
          />

          <XStack justifyContent="space-between" paddingVertical={4}>
            <Button
              size="$3"
              backgroundColor="#E6E6E6"
              color={colors.text}
              onPress={selectAll}
            >
              Select All
            </Button>
            <Button
              size="$3"
              backgroundColor="#E6E6E6"
              color={colors.text}
              onPress={deselectAll}
            >
              Deselect All
            </Button>
          </XStack>

          {SPECIALIZATIONS.map((item) => (
            <XStack
              key={item}
              alignItems="center"
              justifyContent="flex-start"
              gap="$3"
              paddingVertical={6}
            >
              <Pressable
                onPress={() => toggle(item)}
                style={{
                  width: 20,
                  height: 20,
                  borderWidth: 1,
                  borderColor: "#E6E6E6",
                  borderRadius: 4,
                  backgroundColor: specialties.includes(item)
                    ? colors.primary
                    : "transparent",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {specialties.includes(item) && (
                  <Text style={{ color: "white", fontSize: 14 }}>✓</Text>
                )}
              </Pressable>
              <Text fontSize={15} color={colors.text}>
                {item}
              </Text>
            </XStack>
          ))}

          <Button backgroundColor="#0A043C" color="white" onPress={save} disabled={isSaving}>
            Save
          </Button>
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}
