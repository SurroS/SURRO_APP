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
import { MedicalProfile } from "@/types/profile";

type YesNo = "" | "Yes" | "No";

export default function MedicalDetailsStep2() {
  const {
    surrogateProfile,
    medicalProfile,
    fetchProfile,
    updateMedicalProfile,
    isLoading,
  } = useProfile();

  const medical: MedicalProfile | undefined =
    medicalProfile || surrogateProfile?.medical;

  const [hasChronicIllness, setHasChronicIllness] = useState<YesNo>("");
  const [chronicIllnesses, setChronicIllnesses] = useState<string[]>([]);
  const [otherChronicIllness, setOtherChronicIllness] = useState("");

  const [hadMiscarriage, setHadMiscarriage] = useState<YesNo>("");
  const [numberOfMiscarriages, setNumberOfMiscarriages] = useState<number>(0);

  useEffect(() => {
    if (!surrogateProfile) {
      fetchProfile();
    }
  }, []);

  /**
   * Prefill strictly from MedicalProfile
   */
  useEffect(() => {
    if (!medical) return;

    // Chronic illness
    setHasChronicIllness(medical.hasChronicIllness ? "Yes" : "No");
    setChronicIllnesses(medical.chronicIllnesses ?? []);
    setOtherChronicIllness(medical.otherChronicIllness ?? "");

    // Miscarriage
    setHadMiscarriage(medical.hadMiscarriage ? "Yes" : "No");
    setNumberOfMiscarriages(medical.numberOfMiscarriages ?? 0);
  }, [medical]);

  const handleContinue = async () => {
    const payload: Partial<MedicalProfile> = {
      hasChronicIllness: hasChronicIllness === "Yes",
      chronicIllnesses:
        hasChronicIllness === "Yes" ? chronicIllnesses : [],
      otherChronicIllness:
        hasChronicIllness === "Yes" ? otherChronicIllness : undefined,

      hadMiscarriage: hadMiscarriage === "Yes",
      numberOfMiscarriages:
        hadMiscarriage === "Yes" ? numberOfMiscarriages : 0,

      pregnancyComplicationsDetails:
        hadMiscarriage === "Yes"
          ? `Miscarriages: ${numberOfMiscarriages}`
          : "None",
    };

    try {
      await updateMedicalProfile(payload);

      Toast.show({
        text1: "Medical details saved",
        type: "customSuccess" as ToastType,
      });

      router.push("/settings/medical/medicalUpload");
    } catch (error: any) {
      Toast.show({
        text1: "Failed to save medical details",
        text2: error?.response?.data?.message || "Please try again later",
        type: "customError" as ToastType,
      });
    }
  };

  const handleContinueLater = () => {
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
  ] as string[];

  const showOtherChronic =
    hasChronicIllness === "Yes" && chronicIllnesses.includes("Other");

  return (
    <KeyboardAvoidingWrapper>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF", paddingTop: 20 }}>
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
