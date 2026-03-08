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

  const medical = surrogateProfile?.medical || medicalProfile;

  const [genotype, setGenotype] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [pregnancyExperience, setPregnancyExperience] = useState<
    "Yes" | "No" | ""
  >("");
  const [numberOfChildren, setNumberOfChildren] = useState(0);
  const [ceasareanSection, setCeasareanSection] = useState<"Yes" | "No" | "">(
    ""
  );
  const [numberOfCs, setNumberOfCs] = useState(0);
  const [profileLoaded, setProfileLoaded] = useState(false);

  /** Fetch profile once */
  useEffect(() => {
    if (!medical && !surrogateProfile) {
      fetchProfile().finally(() => setProfileLoaded(true));
    } else {
      setProfileLoaded(true);
    }
  }, []);

  /** Hydrate from backend */
  useEffect(() => {
    if (!medical) return;

    setGenotype(medical.genotype ?? "");
    setBloodGroup(medical.bloodGroup ?? "");
    setPregnancyExperience(
      medical.pregnancyExperience ? "Yes" : "No"
    );
    setNumberOfChildren(medical.numberOfChildren ?? 0);
    setCeasareanSection(
      medical.ceasareanSection ? "Yes" : "No"
    );
    setNumberOfCs(medical.numberOfCs ?? 0);
  }, [medical]);

  /** Form validity — no nonsense allowed */
  const isFormValid =
    genotype &&
    bloodGroup &&
    pregnancyExperience &&
    (pregnancyExperience === "No" ||
      (numberOfChildren > 0 &&
        ceasareanSection &&
        (ceasareanSection === "No" || numberOfCs > 0)));

  const handleContinue = () => {
    router.push({
      pathname: "/settings/medical/medical-two",
      params: {
        genotype,
        bloodGroup,
        pregnancyExperience:
          pregnancyExperience === "Yes" ? "true" : "false",
        numberOfChildren: numberOfChildren.toString(),
        ceasareanSection:
          ceasareanSection === "Yes" ? "true" : "false",
        numberOfCs: numberOfCs.toString(),
      },
    });
  };

  const handleContinueLater = () => {
    router.push("/settings/medical");
  };

  if (!profileLoaded || isLoading) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Button>Loading…</Button>
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
              label="Have you ever been pregnant?"
              value={pregnancyExperience}
              options={["Yes", "No"]}
              onChange={setPregnancyExperience}
            />

            {pregnancyExperience === "Yes" && (
              <>
                <NumberInputSelect
                  label="How many children do you have?"
                  value={numberOfChildren}
                  onChange={setNumberOfChildren}
                />

                <DropdownField
                  label="Have you ever had a caesarean section (CS)?"
                  value={ceasareanSection}
                  options={["Yes", "No"]}
                  onChange={setCeasareanSection}
                />

                {ceasareanSection === "Yes" && (
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
