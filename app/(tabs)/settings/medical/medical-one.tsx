import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { YStack, Button, ScrollView, View } from "tamagui";
import { router } from "expo-router";
import { ScreenHeader } from "@/components/auth";
import colors from "@/hooks/colors";
import DropdownField from "@/components/medical/DropdownField";
import NumberInputSelect from "@/components/NumberInputSelect";
import { useProfile } from "@/hooks/useProfile";

export default function MedicalDetailsStep1() {
  const { surrogateProfile, medicalProfile, fetchProfile, isLoading } =
    useProfile();

  const [genotype, setGenotype] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [pregnant, setPregnant] = useState("");
  const [children, setChildren] = useState(0);
  const [caesarean, setCaesarean] = useState("");
  const [numberOfCs, setNumberOfCs] = useState(0);
  const [profileLoaded, setProfileLoaded] = useState(false);

  const medical = surrogateProfile?.medicalProfile || medicalProfile;

  useEffect(() => {
    if (!medical && !surrogateProfile) {
      console.log("[MedicalDetailsStep1] Fetching profile from backend...");
      fetchProfile().finally(() => setProfileLoaded(true));
    } else {
      setProfileLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (medical) {
      console.log(
        "[MedicalDetailsStep1] Loaded medical profile from backend:",
        medical
      );
      setGenotype(medical.genotype || "");
      setBloodGroup(medical.bloodGroup || "");
      setPregnant(medical.pregnancyExperience ? "Yes" : "No");
      setChildren(medical.numberofChildren || 0);
      setCaesarean(medical.ceasareanSection ? "Yes" : "No");
      setNumberOfCs(medical.numberOfcs || 0);
    }
  }, [medical]);

  const handleContinue = () => {
    console.log("[MedicalDetailsStep1] Continue pressed with values:", {
      genotype,
      bloodGroup,
      pregnant,
      children,
      caesarean,
      numberOfCs,
    });

    router.push({
      pathname: "/settings/medical/medical-two",
      params: {
        genotype,
        bloodGroup,
        pregnancyExperience: (pregnant === "Yes").toString(),
        numberofChildren: children.toString(),
        ceasareanSection: (caesarean === "Yes").toString(),
        numberOfCs: numberOfCs.toString(),
      },
    });
  };

  const handleContinueLater = () => {
    console.log("[MedicalDetailsStep1] Continue Later pressed");
    router.push("/settings/medical");
  };

  const isFormValid =
    genotype &&
    bloodGroup &&
    pregnant &&
    (pregnant === "No" ||
      (children > 0 && caesarean && (caesarean === "No" || numberOfCs > 0)));

  if (!profileLoaded || isLoading) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Button>Loading...</Button>
      </SafeAreaView>
    );
  }

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
                <NumberInputSelect
                  label="How many children do you have"
                  value={children}
                  onChange={setChildren}
                />

                <DropdownField
                  label="Have you ever had a caesarean section (CS)"
                  value={caesarean}
                  options={["Yes", "No"]}
                  onChange={setCaesarean}
                />

                {caesarean === "Yes" && (
                  <NumberInputSelect
                    label="How many C-sections (CS) have you had?"
                    value={numberOfCs}
                    onChange={setNumberOfCs}
                  />
                )}
              </>
            )}
          </YStack>

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
