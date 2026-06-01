import React, { useState } from "react";
import { Pressable } from "react-native";
import { YStack, Button, ScrollView, XStack, Text, Popover } from "tamagui";
import { ScreenHeader } from "@/components/auth";
import { router } from "expo-router";
import { Toast } from "toastify-react-native";
import colors from "@/hooks/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { ToastType } from "toastify-react-native/utils/interfaces";

const SPECIALIZATIONS = [
  "Surrogacy Coordination",
  "Surrogate care giving",
  "Emotional support",
  "Progress tracking and documentation",
  "IVF Clinic Liaison",
  "Counseling Support",
];

export default function AgentSpecializationSection() {
  const [isSaving, setIsSaving] = useState(false);
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggle = (item: string) => {
    setSpecialties((prev) => (prev.includes(item) ? prev : [...prev, item]));
  };

  const remove = (item: string) => {
    setSpecialties((prev) => prev.filter((x) => x !== item));
  };

  const selectAll = () => setSpecialties([...SPECIALIZATIONS]);
  const deselectAll = () => setSpecialties([]);

  const save = () => {
    if (isSaving) return;
    if (specialties.length === 0) {
      Toast.show({
        text1: "Select at least one specialization",
        type: "customError" as ToastType,
      });
      return;
    }
    setIsSaving(true);
    Toast.show({
      text1: "Specializations updated",
      type: "customSuccess" as ToastType,
    });
    router.back();
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 20 }}>
      <ScreenHeader title="Specializations" onBackPress={() => router.back()} />

      <ScrollView>
        <YStack gap="$4">
          <Text fontWeight="600" fontSize={15} color={colors.text}>
            Your Specialties
          </Text>

          <Popover open={dropdownOpen} onOpenChange={setDropdownOpen}>
            <Popover.Trigger asChild>
              <Pressable
                style={{
                  borderWidth: 1,
                  borderColor: "#E6E6E6",
                  borderRadius: 8,
                  padding: 12,
                }}
              >
                <Text fontSize={15} color={colors.gray}>
                  {specialties.length > 0
                    ? specialties.join(", ")
                    : "Select all that applies"}
                </Text>
              </Pressable>
            </Popover.Trigger>

            <Popover.Content
              style={{
                backgroundColor: "white",
                borderWidth: 1,
                borderColor: "#E6E6E6",
                borderRadius: 8,
                padding: 10,
                maxHeight: 300,
              }}
            >
              <YStack gap="$2">
                {/* Select / Deselect All */}
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

                {/* Custom checkboxes */}
                {SPECIALIZATIONS.map((item) => (
                  <XStack
                    key={item}
                    alignItems="center"
                    justifyContent="flex-start"
                    gap="$3"
                    paddingVertical={6}
                  >
                    <Pressable
                      onPress={() =>
                        specialties.includes(item) ? remove(item) : toggle(item)
                      }
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
              </YStack>
            </Popover.Content>
          </Popover>

          <Button backgroundColor="#0A043C" color="white" onPress={save} disabled={isSaving}>
            Save
          </Button>
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}
