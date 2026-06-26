import React, { useState } from "react";
import { Pressable } from "react-native";
import { YStack, Button, ScrollView, XStack, Text } from "tamagui";
import { ScreenHeader } from "@/components/auth";
import { router } from "expo-router";
import { Toast } from "toastify-react-native";
import { ToastType } from "toastify-react-native/utils/interfaces";
import colors from "@/hooks/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAgentProfile } from "@/hooks/profile/useAgentProfile";

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
    return certs.map((c: any) => c.title || "");
  });

  const toggle = (item: string) => {
    setSelected((prev) =>
      prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]
    );
  };

  const save = async () => {
    if (isSaving) return;
    setIsSaving(true);

    try {
      const certifications = selected.map((title) => ({
        title,
      }));
      await updateAgentProfile({ certifications });
      Toast.show({
        text1: "Certifications updated",
        type: "customSuccess" as ToastType,
      });
      router.back();
    } catch {
      Toast.show({
        text1: "Failed to update",
        type: "customError" as ToastType,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 20 }}>
      <ScreenHeader title="Certifications" onBackPress={() => router.back()} />

      <ScrollView>
        <YStack gap="$4">
          <Text fontWeight="600" fontSize={15} color={colors.text}>
            Select your certifications
          </Text>

          {PREDEFINED_CERTIFICATIONS.map((item) => (
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
              </Pressable>
              <Text fontSize={15} color={colors.text}>
                {item}
              </Text>
            </XStack>
          ))}

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
  );
}
