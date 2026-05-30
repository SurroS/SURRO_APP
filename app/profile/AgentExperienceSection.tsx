import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { YStack, Button, ScrollView } from "tamagui";
import { ScreenHeader } from "@/components/auth";
import TextInputField from "@/components/TextInputField";
import { router } from "expo-router";
import KeyboardAvoidingWrapper from "@/components/keyboardAvoidingWrapper";
import { Toast } from "toastify-react-native";

export default function AgentExperienceSection() {
  const [years, setYears] = useState("");
  const [completed, setCompleted] = useState("");
  const [background, setBackground] = useState("");

  const save = () => {
    if (!years || !background) {
      Toast.show({
        text1: "Please fill required fields",
        type: "error",
      });
      return;
    }

    Toast.show({ text1: "Experience updated", type: "success" });
    router.back();
  };

  return (
    <KeyboardAvoidingWrapper>
      <SafeAreaView style={{ flex: 1, padding: 20 }}>
        <ScreenHeader title="Experience" onBackPress={() => router.back()} />

        <ScrollView>
        <YStack gap="$4">
          <TextInputField
            label="Years of experience"
            placeholder="e.g. 5"
            value={years}
            onChangeText={setYears}
          />

          <TextInputField
            label="Completed cases"
            placeholder="Optional"
            value={completed}
            onChangeText={setCompleted}
          />

          <TextInputField
            label="Professional background"
            placeholder="Describe your experience"
            value={background}
            multiline={true}
            onChangeText={setBackground}
          />

          <Button backgroundColor="#0A043C" color="white" onPress={save}>
            Save
          </Button>
        </YStack>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingWrapper>
  );
}
