import React, { useState, useEffect, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { YStack, Button, ScrollView, View } from "tamagui";
import { RefreshControl, Pressable, Text } from "react-native";
import { router } from "expo-router";
import { ScreenHeader } from "@/components/auth";
import colors from "@/hooks/colors";
import DropdownField from "@/components/medical/DropdownField";
import NumberInputSelect from "@/components/NumberInputSelect";
import { useProfile } from "@/hooks/useProfile";

export default function MedicalDetailsStep1() {
  const { surrogateProfile, medicalProfile, fetchProfile, isLoading, updateProfile } =
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
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchProfile(true);
    } catch (e) {
      console.error("Refresh failed", e);
    } finally {
      setRefreshing(false);
    }
  }, []);

  /** Fetch profile once */
  useEffect(() => {
    if (!surrogateProfile) {
      fetchProfile().finally(() => setProfileLoaded(true));
    } else {
      setProfileLoaded(true);
    }
  }, [surrogateProfile, fetchProfile]);

  /** Hydrate from backend */
  useEffect(() => {
    if (!surrogateProfile && !medical) return;

    // Check both medical object and root surrogateProfile for genotype/bloodGroup
    const genotypeValue = 
      medical?.genotype || 
      surrogateProfile?.genotype || 
      surrogateProfile?.genotypeValue || 
      "";
    const bloodGroupValue = 
      medical?.bloodGroup || 
      surrogateProfile?.bloodGroup || 
      surrogateProfile?.bloodType || 
      "";

    if (genotypeValue) setGenotype(genotypeValue);
    if (bloodGroupValue) setBloodGroup(bloodGroupValue);
    
    if (surrogateProfile) {
      setPregnancyExperience(
        surrogateProfile.pregnancyExperience ? "Yes" : "No"
      );
      setNumberOfChildren(surrogateProfile.numberofChildren || surrogateProfile.numberOfChildren || 0);
      setCeasareanSection(
        surrogateProfile.ceasareanSection ? "Yes" : "No"
      );
      setNumberOfCs(surrogateProfile.numberOfCs || surrogateProfile.numberOfcs || 0);
    }
  }, [medical, surrogateProfile]);

  /** Form validity — no nonsense allowed */
  const isFormValid =
    genotype &&
    bloodGroup &&
    pregnancyExperience &&
    (pregnancyExperience === "No" ||
      (numberOfChildren >= 0 &&
        ceasareanSection &&
        (ceasareanSection === "No" || numberOfCs > 0)));

  const handleContinue = async () => {
    try {
      await updateProfile({
        numberOfChildren,
        medical: {
          genotype,
          bloodGroup,
          pregnancyExperience: pregnancyExperience === "Yes",
          ceasareanSection: ceasareanSection === "Yes",
          numberOfCs,
        },
      });
    } catch (e) {
      // Silently continue - data will be saved on final step
    }

    router.push({
      pathname: "/medical/medical-two",
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
    router.push("/medical");
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

      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#0E0E55"]}
          />
        }
        contentContainerStyle={{ flexGrow: 1, padding: "$3" }}
      >
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

            <Pressable onPress={handleContinueLater} style={{ alignSelf: "center", paddingVertical: 12 }}>
              <Text style={{ color: colors.primary, textDecorationLine: "underline", fontSize: 14 }}>
                Continue Later
              </Text>
            </Pressable>
          </YStack>
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}
