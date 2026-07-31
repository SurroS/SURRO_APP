import React, { useState } from "react";
import { Pressable, TextInput, View } from "react-native";
import { YStack, Button, ScrollView, XStack, Text } from "tamagui";
import { ScreenHeader } from "@/components/auth";
import { router } from "expo-router";
import { Toast } from "toastify-react-native";
import { ToastType } from "toastify-react-native/utils/interfaces";
import colors from "@/hooks/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAgentProfile } from "@/hooks/profile/useAgentProfile";
import KeyboardAvoidingWrapper from "@/components/keyboardAvoidingWrapper";

const PREDEFINED_CERTIFICATIONS = [
  "Certified Surrogacy Professional",
  "IVF Clinic Liaison",
  "Certified Nurse",
  "Counseling Certification",
  "Legal Coordination Certification",
  "Social Work License",
];

export default function AgentCertificationSection() {
  const { agentProfile, updateAgentProfile } = useAgentProfile();
  const [isSaving, setIsSaving] = useState(false);
  const [selected, setSelected] = useState<string[]>(() => {
    const certs = agentProfile?.certifications || [];
    return certs.map((c: any) => c.name || "");
  });
  const [showOthers, setShowOthers] = useState(false);
  const [customInput, setCustomInput] = useState("");
  const [customCerts, setCustomCerts] = useState<string[]>([]);

  const toggle = (item: string) => {
    setSelected((prev) =>
      prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]
    );
  };

  const addCustom = () => {
    const val = customInput.trim();
    if (!val) return;
    if (selected.includes(val) || customCerts.includes(val)) {
      Toast.show({
        text1: "Already added",
        type: "customError" as ToastType,
      });
      return;
    }
    setCustomCerts((prev) => [...prev, val]);
    setCustomInput("");
  };

  const removeCustom = (item: string) => {
    setCustomCerts((prev) => prev.filter((x) => x !== item));
    setSelected((prev) => prev.filter((x) => x !== item));
  };

  const save = async () => {
    if (isSaving) return;
    setIsSaving(true);

    try {
      const certifications = [...selected, ...customCerts].map((name) => ({
        name,
        valid: "Active",
      }));
      await updateAgentProfile({ certifications });
      setIsSaving(false);
      Toast.show({
        text1: "Certifications updated",
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
    <KeyboardAvoidingWrapper>
    <SafeAreaView style={{ flex: 1, paddingHorizontal: 20, paddingTop: 20, paddingBottom: 5 }} edges={["top", "left", "right"]}>
      <ScreenHeader title="Certifications" onBackPress={() => router.back()} />

      <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled">
        <YStack gap="$4">
          <Text fontWeight="600" fontSize={15} color={colors.text}>
            Select your certifications
          </Text>

          {PREDEFINED_CERTIFICATIONS.map((item) => (
            <Pressable key={item} onPress={() => toggle(item)} style={{ opacity: isSaving ? 0.5 : 1 }}>
              <XStack
                alignItems="center"
                justifyContent="flex-start"
                gap="$3"
                paddingVertical={6}
              >
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderWidth: 1,
                    borderColor: "#E6E6E6",
                    borderRadius: 4,
                    backgroundColor: selected.includes(item)
                      ? colors.primary
                      : "transparent",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {selected.includes(item) && (
                    <Text style={{ color: "white", fontSize: 14 }}>✓</Text>
                  )}
                </View>
                <Text fontSize={15} color={colors.text}>
                  {item}
                </Text>
              </XStack>
            </Pressable>
          ))}

          {/* Others section */}
          <Pressable onPress={() => setShowOthers((p) => !p)}>
            <XStack alignItems="center" gap="$3" paddingVertical={6}>
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderWidth: 1,
                  borderColor: "#E6E6E6",
                  borderRadius: 4,
                  backgroundColor: showOthers ? colors.primary : "transparent",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {showOthers && (
                  <Text style={{ color: "white", fontSize: 14 }}>✓</Text>
                )}
              </View>
              <Text fontSize={15} color={colors.text}>
                Others
              </Text>
            </XStack>
          </Pressable>

          {showOthers && (
            <YStack gap="$2" paddingLeft={32}>
              <XStack gap="$2" alignItems="center">
                <TextInput
                  placeholder="Type certification..."
                  value={customInput}
                  onChangeText={setCustomInput}
                  style={{
                    flex: 1,
                    borderWidth: 1,
                    borderColor: "#E6E6E6",
                    borderRadius: 8,
                    paddingHorizontal: 10,
                    height: 40,
                    color: colors.text,
                  }}
                  placeholderTextColor="#9B9B9B"
                />
                <Pressable
                  onPress={addCustom}
                  style={{
                    backgroundColor: colors.primary,
                    borderRadius: 8,
                    paddingHorizontal: 16,
                    height: 40,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text color="white" fontSize={14} fontWeight="600">Add</Text>
                </Pressable>
              </XStack>

              {customCerts.length > 0 && (
                <XStack flexWrap="wrap" gap="$2">
                  {customCerts.map((cert) => (
                    <XStack
                      key={cert}
                      backgroundColor={colors.primary}
                      borderRadius={20}
                      paddingHorizontal={14}
                      paddingVertical={6}
                      alignItems="center"
                      gap="$2"
                    >
                      <Text color="white" fontSize={13}>{cert}</Text>
                      <Pressable onPress={() => removeCustom(cert)} hitSlop={8}>
                        <Text color="white" fontSize={18} fontWeight="700">×</Text>
                      </Pressable>
                    </XStack>
                  ))}
                </XStack>
              )}
            </YStack>
          )}

          <Button
            backgroundColor="#0A043C"
            color="white"
            onPress={save}
            disabled={isSaving}
          >
            Save
          </Button>
        </YStack>
      </ScrollView>
    </SafeAreaView>
    </KeyboardAvoidingWrapper>
  );
}
