import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { YStack, Button, ScrollView } from "tamagui";
import { ScreenHeader } from "@/components/auth";
import Dropdown from "@/components/DropDown";
import NumberInputSelect from "@/components/NumberInputSelect";
import TextInputField from "@/components/TextInputField";
import { router } from "expo-router";
import KeyboardAvoidingWrapper from "@/components/keyboardAvoidingWrapper";
import { Toast } from "toastify-react-native";
import { ToastType } from "toastify-react-native/utils/interfaces";
import { useAgentProfile } from "@/hooks/profile/useAgentProfile";

const YEAR_OPTIONS = [
  { label: "Below 1 year", value: "Below 1 year" },
  { label: "1 - 2 years", value: "1 - 2 years" },
  { label: "2 - 5 years", value: "2 - 5 years" },
  { label: "5 - 10 years", value: "5 - 10 years" },
  { label: "Above 10 years", value: "Above 10 years" },
];

const NEGOTIABLE_OPTIONS = [
  { label: "Yes", value: "Yes" },
  { label: "No", value: "No" },
];

export default function AgentExperienceSection() {
  const { agentProfile, updateAgentProfile } = useAgentProfile();
  const [isSaving, setIsSaving] = useState(false);
  const [years, setYears] = useState("");
  const [completed, setCompleted] = useState(0);
  const [background, setBackground] = useState("");
  const [compensation, setCompensation] = useState("");
  const [negotiable, setNegotiable] = useState("");

  useEffect(() => {
    if (agentProfile) {
      setYears(agentProfile.yearsOfExperience || "");
      setCompleted(agentProfile.completedCases != null ? agentProfile.completedCases : 0);
      setBackground(agentProfile.professionalBackground || "");
      setCompensation(agentProfile.compensation || "");
      setNegotiable(agentProfile.negotiable || "");
    }
  }, [agentProfile]);

  const save = async () => {
    if (isSaving) return;
    setIsSaving(true);

    try {
      const profileData: any = {};
      if (years) profileData.yearsOfExperience = years;
      profileData.completedCases = String(completed);
      if (background) profileData.professionalBackground = background;
      if (compensation) profileData.compensation = compensation;
      if (negotiable) profileData.negotiable = negotiable;
      await updateAgentProfile(profileData);
      Toast.show({
        text1: "Experience updated",
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
    <KeyboardAvoidingWrapper>
      <SafeAreaView style={{ flex: 1, padding: 20 }}>
        <ScreenHeader title="Experience" onBackPress={() => router.back()} />

        <ScrollView>
        <YStack gap="$4">
          <Dropdown
            label="Years of experience"
            placeholder="Select years of experience"
            value={years}
            options={YEAR_OPTIONS}
            onSelect={setYears}
          />

          <NumberInputSelect
            label="Completed cases"
            value={completed}
            onChange={setCompleted}
            min={0}
            max={999}
          />

          <TextInputField
            label="Professional background"
            placeholder="Describe your experience"
            value={background}
            multiline={true}
            onChangeText={setBackground}
          />

          <TextInputField
            label="Compensation (₦)"
            placeholder="e.g. 1000000"
            value={compensation}
            onChangeText={setCompensation}
            keyboardType="numeric"
          />

          <Dropdown
            label="Negotiable"
            placeholder="Is compensation negotiable?"
            value={negotiable}
            options={NEGOTIABLE_OPTIONS}
            onSelect={setNegotiable}
          />

          <Button backgroundColor="#0A043C" color="white" onPress={save} disabled={isSaving}>
            Save
          </Button>
        </YStack>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingWrapper>
  );
}
