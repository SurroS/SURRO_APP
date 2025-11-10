import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { YStack, Text, Button, ScrollView, XStack, View } from "tamagui";
import { router } from "expo-router";
import { ScreenHeader } from "@/components/auth";
import colors from "@/hooks/colors";
import DropdownField from "@/components/medical/DropdownField";
import NumberInput from "@/components/medical/NumberInput";
import { Toast } from "toastify-react-native";
import { ToastType } from "toastify-react-native/utils/interfaces";

export default function MedicalDetailsStep1() {
  const [genotype, setGenotype] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [pregnant, setPregnant] = useState("");
  const [children, setChildren] = useState(0);
  const [caesarean, setCaesarean] = useState("");
  const [numberOfCs, setNumberOfCs] = useState(0);

  const handleContinue = () => {
    Toast.show({
      text1: "Profile updated successfully",
      type: "customSuccess" as ToastType,
    });
    router.push("/settings/medical/medical-two");
  };

  const handleContinueLater = () => {
    router.push("/settings/medical");
  };

  //  Check if form is complete
  const isFormValid =
    genotype &&
    bloodGroup &&
    pregnant &&
    (pregnant === "No" ||
      (children > 0 && caesarean && (caesarean === "No" || numberOfCs > 0)));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF", paddingTop: 20 }}>
      <View marginLeft={28}>
        <ScreenHeader
          title="Medical details"
          onBackPress={() => router.back()}
        />
      </View>
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: "$3" }}>
        <YStack padding="$4" gap="$4">
          {/* Form Fields */}
          <YStack gap="$4" marginTop="$4">
            <DropdownField
              label="Genotype"
              value={genotype}
              options={["AA", "AS", "SS", "AC"]}
              onChange={setGenotype}
            />

            <DropdownField
              label="Blood group"
              value={bloodGroup}
              options={["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]}
              onChange={setBloodGroup}
            />

            <DropdownField
              label="Have you ever been pregnant"
              value={pregnant}
              options={["Yes", "No"]}
              onChange={setPregnant}
            />

            {pregnant === "Yes" && (
              <>
                <NumberInput
                  label="How many children do you have"
                  value={children}
                  onChange={setChildren}
                />

                <DropdownField
                  label="Have you ever had a caesarean session (cs)"
                  value={caesarean}
                  options={["Yes", "No"]}
                  onChange={setCaesarean}
                />

                {caesarean === "Yes" && (
                  <NumberInput
                    label="How many C-sections (cs) have you had?"
                    value={numberOfCs}
                    onChange={setNumberOfCs}
                  />
                )}
              </>
            )}
          </YStack>

          {/* Buttons */}
          <YStack marginTop="$3" gap="$2">
            <Button
              backgroundColor={isFormValid ? colors.primary : "#CCC"}
              color="#FFF"
              onPress={handleContinue}
              disabled={!isFormValid}
              opacity={isFormValid ? 1 : 0.7}
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
  );
}
