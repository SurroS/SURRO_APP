import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, ActivityIndicator } from "react-native";
import { YStack, Button } from "tamagui";
import { ScreenHeader } from "@/components/auth";
import { router } from "expo-router";
import Dropdown from "@/components/DropDown";
import { Toast } from "toastify-react-native";
import { ToastType } from "toastify-react-native/utils/interfaces";
import { useParentProfile } from "@/hooks/profile/useParentProfile";
import KeyboardAvoidingWrapper from "@/components/keyboardAvoidingWrapper";

const WHY_SURROGACY_OPTIONS = [
  "Medical reasons (infertility, health conditions)",
  "Same-sex couple / LGBTQ+ family building",
  "Single parent by choice",
];

const YEARS_TRYING_OPTIONS = [
  "Less than 1 year",
  "1–2 years",
  "3–5 years",
  "5+ years",
];

const SURROGACY_TYPE_OPTIONS = [
  "Gestational surrogacy (embryo transfer)",
  "Traditional surrogacy (surrogate's eggs)",
  "Not sure yet / Open to both",
];

const HEIGHT_OPTIONS = ["4'10\" – 5'4\"", "5'5\" – 5'9\"", "5'10\" – 6'2\"", "No preference"];
const AGE_RANGE_OPTIONS = ["21–25", "26–30", "31–35", "36–40", "No preference"];
const LOCATION_OPTIONS = ["Same country", "Same city/state", "Any location", "No preference"];
const GENOTYPE_OPTIONS = ["AA", "AS", "SS", "AC", "No preference"];
const BLOOD_GROUP_OPTIONS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "No preference"];
const COUNTRY_OPTIONS = ["Nigeria", "Ghana", "Kenya", "South Africa", "United States", "United Kingdom", "Canada", "Other"];

const LANGUAGES_LIST = [
  "English", "Spanish", "French", "Arabic", "Mandarin",
  "Portuguese", "Russian", "German", "Italian", "Japanese",
  "Yoruba", "Hausa", "Igbo", "Other",
];

const isTraditional = (t: string) => t === "Traditional surrogacy (surrogate's eggs)";
const isGestational = (t: string) => t === "Gestational surrogacy (embryo transfer)";

export default function AdditionalInfoScreen() {
  const { parentProfile, updateParentProfile, fetchParentProfile, isLoading } =
    useParentProfile();

  const [whySurrogacy, setWhySurrogacy] = useState("");
  const [yearsTrying, setYearsTrying] = useState("");
  const [languages, setLanguages] = useState<string[]>([]);
  const [surrogacyType, setSurrogacyType] = useState("");
  const [preferredHeight, setPreferredHeight] = useState("");
  const [preferredAgeRange, setPreferredAgeRange] = useState("");
  const [preferredLocation, setPreferredLocation] = useState("");
  const [preferredGenotype, setPreferredGenotype] = useState("");
  const [preferredBloodGroup, setPreferredBloodGroup] = useState("");
  const [preferredCountry, setPreferredCountry] = useState("");

  useEffect(() => {
    if (!parentProfile) {
      fetchParentProfile();
    }
  }, []);

  const firstOf = (arr: any) => Array.isArray(arr) && arr.length > 0 ? arr[0] : "";

  useEffect(() => {
    if (!parentProfile) return;

    setWhySurrogacy(parentProfile.whySurrogacy || "");

    if (parentProfile.yearsOfTrying != null) {
      const val = Number(parentProfile.yearsOfTrying);
      if (val < 1) setYearsTrying("Less than 1 year");
      else if (val <= 2) setYearsTrying("1–2 years");
      else if (val <= 5) setYearsTrying("3–5 years");
      else setYearsTrying("5+ years");
    }

    if (Array.isArray(parentProfile.languagesSpoken)) setLanguages(parentProfile.languagesSpoken);
    if (parentProfile.surrogacyType) setSurrogacyType(parentProfile.surrogacyType);
    if (firstOf(parentProfile.preferredHeights)) setPreferredHeight(firstOf(parentProfile.preferredHeights));
    if (firstOf(parentProfile.preferredAgeRanges)) setPreferredAgeRange(firstOf(parentProfile.preferredAgeRanges));
    if (firstOf(parentProfile.preferredLocations)) setPreferredLocation(firstOf(parentProfile.preferredLocations));
    if (firstOf(parentProfile.preferredGenotypes)) setPreferredGenotype(firstOf(parentProfile.preferredGenotypes));
    if (firstOf(parentProfile.preferredBloodGroups)) setPreferredBloodGroup(firstOf(parentProfile.preferredBloodGroups));
    if (firstOf(parentProfile.preferredCountries)) setPreferredCountry(firstOf(parentProfile.preferredCountries));
  }, [parentProfile]);

  const handleSave = async () => {
    try {
      let yearsNum: number | undefined;
      if (yearsTrying === "Less than 1 year") yearsNum = 0;
      else if (yearsTrying === "1–2 years") yearsNum = 2;
      else if (yearsTrying === "3–5 years") yearsNum = 5;
      else if (yearsTrying === "5+ years") yearsNum = 6;

      const payload: any = {
        whySurrogacy,
        yearsOfTrying: yearsNum,
        languagesSpoken: languages,
        surrogacyType,
        preferredHeights: preferredHeight ? [preferredHeight] : [],
        preferredAgeRanges: preferredAgeRange ? [preferredAgeRange] : [],
        preferredLocations: preferredLocation ? [preferredLocation] : [],
      };

      if (isTraditional(surrogacyType)) {
        payload.preferredGenotypes = preferredGenotype ? [preferredGenotype] : [];
        payload.preferredBloodGroups = preferredBloodGroup ? [preferredBloodGroup] : [];
      }

      if (isGestational(surrogacyType)) {
        payload.preferredCountries = preferredCountry ? [preferredCountry] : [];
      }

      await updateParentProfile(payload);

      Toast.show({
        text1: "Additional information saved",
        type: "customSuccess" as ToastType,
      });

      router.push("/medical/medicalHistorySummary");
    } catch (error: any) {
      Toast.show({
        text1: "Save Failed",
        type: "customError" as ToastType,
        text2:
          error?.response?.data?.message ||
          "Failed to save additional information.",
      });
    }
  };

  const showTraditional = isTraditional(surrogacyType);
  const showGestational = isGestational(surrogacyType);

  const commonRequired = whySurrogacy && yearsTrying && surrogacyType && preferredAgeRange && preferredLocation;
  const traditionalRequired = showTraditional ? preferredHeight && preferredGenotype && preferredBloodGroup : true;
  const gestationalRequired = showGestational ? preferredCountry : true;
  const canSave = commonRequired && traditionalRequired && gestationalRequired;

  return (
    <KeyboardAvoidingWrapper>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff", padding: 20 }}>
        <ScreenHeader
          title="Additional Info & Preferences"
          onBackPress={() => router.back()}
        />

        <ScrollView style={{ flex: 1 }}>
          <YStack gap="$4">
            <Dropdown
              label="Why are you seeking a surrogate?"
              placeholder="Select a reason"
              value={whySurrogacy}
              options={WHY_SURROGACY_OPTIONS}
              onSelect={(val) => setWhySurrogacy(val as string)}
            />

            <Dropdown
              label="How long have you been trying to conceive?"
              placeholder="Select duration"
              value={yearsTrying}
              options={YEARS_TRYING_OPTIONS}
              onSelect={(val) => setYearsTrying(val as string)}
            />

            <Dropdown
              label="What kind of surrogacy are you looking for?"
              placeholder="Select type"
              value={surrogacyType}
              options={SURROGACY_TYPE_OPTIONS}
              onSelect={(val) => setSurrogacyType(val as string)}
            />

            {/* Common preferences — always shown */}
            <Dropdown
              label="Preferred age range"
              placeholder="Select age range"
              value={preferredAgeRange}
              options={AGE_RANGE_OPTIONS}
              onSelect={(val) => setPreferredAgeRange(val as string)}
            />

            <Dropdown
              label="Preferred location"
              placeholder="Select location"
              value={preferredLocation}
              options={LOCATION_OPTIONS}
              onSelect={(val) => setPreferredLocation(val as string)}
            />

            {/* Traditional surrogacy preferences */}
            {showTraditional && (
              <>
                <Dropdown
                  label="Preferred height"
                  placeholder="Select height range"
                  value={preferredHeight}
                  options={HEIGHT_OPTIONS}
                  onSelect={(val) => setPreferredHeight(val as string)}
                />

                <Dropdown
                  label="Preferred genotype"
                  placeholder="Select genotype"
                  value={preferredGenotype}
                  options={GENOTYPE_OPTIONS}
                  onSelect={(val) => setPreferredGenotype(val as string)}
                />

                <Dropdown
                  label="Preferred blood group"
                  placeholder="Select blood group"
                  value={preferredBloodGroup}
                  options={BLOOD_GROUP_OPTIONS}
                  onSelect={(val) => setPreferredBloodGroup(val as string)}
                />
              </>
            )}

            {/* Gestational surrogacy preferences */}
            {showGestational && (
              <Dropdown
                label="Preferred surrogate country"
                placeholder="Select country"
                value={preferredCountry}
                options={COUNTRY_OPTIONS}
                onSelect={(val) => setPreferredCountry(val as string)}
              />
            )}

            <Dropdown
              label="Languages spoken"
              placeholder="Select languages"
              value={languages}
              options={LANGUAGES_LIST}
              onSelect={(vals) => setLanguages(vals as string[])}
              multiple
            />

            <Button
              backgroundColor="#0A043C"
              color="white"
              size="$4"
              marginTop={20}
              disabled={!canSave || isLoading}
              opacity={!canSave || isLoading ? 0.5 : 1}
              onPress={handleSave}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                "Save & Continue"
              )}
            </Button>
          </YStack>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingWrapper>
  );
}
