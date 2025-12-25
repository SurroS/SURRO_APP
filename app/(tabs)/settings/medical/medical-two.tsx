import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native";
import { YStack, Button, View } from "tamagui";
import { router } from "expo-router";
import { ScreenHeader } from "@/components/auth";
import colors from "@/hooks/colors";
import DropdownField from "@/components/medical/DropdownField";
import TextInputField from "@/components/TextInputField";
import MultiSelectField from "@/components/medical/MultiSelectField";
import KeyboardAvoidingWrapper from "@/components/keyboardAvoidingWrapper";
import NumberInputSelect from "@/components/NumberInputSelect";
import { Toast } from "toastify-react-native";
import { ToastType } from "toastify-react-native/utils/interfaces";
import { useProfile } from "@/hooks/useProfile";

export default function MedicalDetailsStep2() {
  const {
    surrogateProfile,
    medicalProfile,
    fetchProfile,
    updateMedicalProfile,
    isLoading,
  } = useProfile();
  const medical = medicalProfile || surrogateProfile?.medical;

  const [hasChronicIllness, setHasChronicIllness] = useState("");
  const [chronicIllnesses, setChronicIllnesses] = useState<string[]>([]);
  const [otherChronicIllness, setOtherChronicIllness] = useState("");

  const [hadMiscarriage, setHadMiscarriage] = useState("");
  const [numberOfMiscarriages, setNumberOfMiscarriages] = useState(0);

  useEffect(() => {
    if (!surrogateProfile) {
      console.log("[MedicalDetailsStep2] Fetching profile from backend...");
      fetchProfile();
    }
  }, []);

  // Prefill from backend
  useEffect(() => {
    if (!medical) return;

    console.log(
      "[MedicalDetailsStep2] Loaded medical profile from backend:",
      medical
    );

    // Chronic illness
    if (
      medical.chronicIllnessDetails &&
      medical.chronicIllnessDetails !== "None"
    ) {
      setHasChronicIllness("Yes");

      const parts = medical.chronicIllnessDetails.split(", ");
      const known = parts.filter((p) => p !== "Other");
      setChronicIllnesses(known);

      const other = parts.find((p) => !known.includes(p));
      if (other) setOtherChronicIllness(other);
    } else {
      setHasChronicIllness("No");
    }

    // Miscarriage
    if (medical.pregnancyComplicationsDetails?.includes("Miscarriage")) {
      setHadMiscarriage("Yes");
      const match = medical.pregnancyComplicationsDetails.match(/(\d+)/);
      if (match) setNumberOfMiscarriages(Number(match[1]));
    } else {
      setHadMiscarriage("No");
    }
  }, [medical]);

  const handleContinue = async () => {
    const chronicIllnessDetails =
      hasChronicIllness === "Yes"
        ? [...chronicIllnesses, otherChronicIllness].filter(Boolean).join(", ")
        : "None";

    const pregnancyComplicationsDetails =
      hadMiscarriage === "Yes"
        ? `Miscarriages: ${numberOfMiscarriages}`
        : "None";

    console.log("[MedicalDetailsStep2] Saving medical details to backend...", {
      chronicIllnessDetails,
      pregnancyComplicationsDetails,
    });

    try {
      await updateMedicalProfile({
        chronicIllnessDetails,
        pregnancyComplicationsDetails,
      });

      console.log("[MedicalDetailsStep2] Medical details saved successfully");

      Toast.show({
        text1: "Medical details saved",
        type: "customSuccess" as ToastType,
      });

      router.push("/settings/medical/medicalUpload");
    } catch (error: any) {
      console.error(
        "[MedicalDetailsStep2] Failed to save medical details",
        error
      );

      Toast.show({
        text1: "Failed to save medical details",
        text2: error?.response?.data?.message || "Please try again later",
        type: "customError" as ToastType,
      });
    }
  };

  const handleContinueLater = () => {
    console.log("[MedicalDetailsStep2] Continue Later pressed");
    router.push("/settings/medical");
  };

  const chronicIllnessOptions = [
    "Diabetes",
    "Hypertension",
    "Asthma",
    "Sickle Cell Disease",
    "HIV/AIDS",
    "Arthritis",
    "Heart Disease",
    "Kidney Disease",
    "Ulcer",
    "Other",
  ];

  const showOtherChronic =
    hasChronicIllness === "Yes" && chronicIllnesses.includes("Other");

  return (
    <KeyboardAvoidingWrapper>
      <SafeAreaView
        style={{ flex: 1, backgroundColor: "#FFF", paddingTop: 20 }}
      >
        <View marginLeft={28}>
          <ScreenHeader
            title="Medical details"
            onBackPress={() => router.back()}
          />
        </View>

        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <YStack padding="$4" gap="$5">
            <DropdownField
              label="Do you have any chronic illnesses?"
              value={hasChronicIllness}
              options={["Yes", "No"]}
              onChange={setHasChronicIllness}
            />

            {hasChronicIllness === "Yes" && (
              <>
                <MultiSelectField
                  label="Select chronic illnesses"
                  options={chronicIllnessOptions}
                  selected={chronicIllnesses}
                  onChange={setChronicIllnesses}
                />

                {showOtherChronic && (
                  <TextInputField
                    label="Please specify other illness"
                    placeholder="Enter illness"
                    value={otherChronicIllness}
                    onChangeText={setOtherChronicIllness}
                  />
                )}
              </>
            )}

            <DropdownField
              label="Have you ever had a miscarriage?"
              value={hadMiscarriage}
              options={["Yes", "No"]}
              onChange={setHadMiscarriage}
            />

            {hadMiscarriage === "Yes" && (
              <NumberInputSelect
                label="How many miscarriages?"
                value={numberOfMiscarriages}
                onChange={setNumberOfMiscarriages}
              />
            )}

            <YStack gap="$2" marginTop="$3">
              <Button
                backgroundColor={colors.primary}
                color="#FFF"
                onPress={handleContinue}
                disabled={isLoading}
                opacity={isLoading ? 0.7 : 1}
              >
                Continue
              </Button>

              <Button
                backgroundColor={colors.gray}
                color="#FFF"
                onPress={handleContinueLater}
              >
                Continue Later
              </Button>
            </YStack>
          </YStack>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingWrapper>
  );
}
