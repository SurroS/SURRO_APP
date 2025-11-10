import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { YStack, Text, Button, ScrollView, View } from "tamagui";
import { router } from "expo-router";

import { ScreenHeader } from "@/components/auth";
import colors from "@/hooks/colors";
import DropdownField from "@/components/medical/DropdownField";
import NumberInput from "@/components/medical/NumberInput";
import TextInputField from "@/components/medical/TextInputField";
import MultiSelectField from "@/components/medical/MultiSelectField";
import { Toast } from "toastify-react-native";
import { ToastType } from "toastify-react-native/utils/interfaces";
import KeyboardAvoidingWrapper from "@/components/keyboardAvoidingWrapper";

export default function MedicalDetailsStep2() {
  const [hasAllergies, setHasAllergies] = useState("");
  const [allergies, setAllergies] = useState("");

  const [hasChronicIllness, setHasChronicIllness] = useState("");
  const [chronicIllnesses, setChronicIllnesses] = useState<string[]>([]);
  const [otherChronicIllness, setOtherChronicIllness] = useState("");

  const [takesMedication, setTakesMedication] = useState("");
  const [medications, setMedications] = useState("");

  const [hadSurgery, setHadSurgery] = useState("");
  const [surgeries, setSurgeries] = useState("");

  const [hasDisability, setHasDisability] = useState("");
  const [disabilities, setDisabilities] = useState("");

  const [hadMiscarriage, setHadMiscarriage] = useState("");
  const [numberOfMiscarriages, setNumberOfMiscarriages] = useState(0);

  const handleContinue = () => {
    Toast.show({
      text1: "Profile updated successfully",
      type: "customSuccess" as ToastType,
    });
    router.push("/settings/medical/medicalUpload");
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
          <YStack padding="$4" gap="$5" marginTop="$2">
            {/* Allergies */}
            <DropdownField
              label="Do you have any allergies?"
              value={hasAllergies}
              options={["Yes", "No"]}
              onChange={setHasAllergies}
            />
            {hasAllergies === "Yes" && (
              <TextInputField
                label="Please list your allergies"
                placeholder="E.g., Penicillin, Peanuts"
                value={allergies}
                onChangeText={setAllergies}
              />
            )}

            {/* Chronic Illness */}
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
                    label="Please specify other chronic illness"
                    placeholder="Enter illness name"
                    value={otherChronicIllness}
                    onChangeText={setOtherChronicIllness}
                  />
                )}
              </>
            )}

            {/* Medications */}
            <DropdownField
              label="Are you currently taking any medications?"
              value={takesMedication}
              options={["Yes", "No"]}
              onChange={setTakesMedication}
            />
            {takesMedication === "Yes" && (
              <TextInputField
                label="List medications"
                placeholder="E.g., Paracetamol, Ibuprofen"
                value={medications}
                onChangeText={setMedications}
              />
            )}

            {/* Surgeries */}
            <DropdownField
              label="Have you had any surgeries or hospitalizations?"
              value={hadSurgery}
              options={["Yes", "No"]}
              onChange={setHadSurgery}
            />
            {hadSurgery === "Yes" && (
              <TextInputField
                label="Please describe"
                placeholder="E.g., Appendectomy in 2018"
                value={surgeries}
                onChangeText={setSurgeries}
              />
            )}

            {/* Disabilities */}
            <DropdownField
              label="Do you have any disabilities or physical limitations?"
              value={hasDisability}
              options={["Yes", "No"]}
              onChange={setHasDisability}
            />
            {hasDisability === "Yes" && (
              <TextInputField
                label="Please describe"
                placeholder="E.g., Difficulty walking long distances"
                value={disabilities}
                onChangeText={setDisabilities}
              />
            )}

            {/* Miscarriages */}
            <DropdownField
              label="Have you ever had a miscarriage?"
              value={hadMiscarriage}
              options={["Yes", "No"]}
              onChange={setHadMiscarriage}
            />
            {hadMiscarriage === "Yes" && (
              <NumberInput
                label="How many miscarriages have you had?"
                value={numberOfMiscarriages}
                onChange={setNumberOfMiscarriages}
              />
            )}

            {/* Buttons */}
            <YStack marginTop="$3" gap="$2">
              <Button
                backgroundColor={colors.primary}
                color="#FFF"
                onPress={handleContinue}
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
