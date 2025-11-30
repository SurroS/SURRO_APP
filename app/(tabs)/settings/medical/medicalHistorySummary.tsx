import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, ActivityIndicator } from "react-native";
import { YStack, Text, View } from "tamagui";
import { router } from "expo-router";
import { ScreenHeader } from "@/components/auth";
import colors from "@/hooks/colors";
import { useProfile } from "@/hooks/useProfile";

// Types
interface ContactInfo {
  countryOfResidence?: string | null;
  stateOfOrigin?: string | null;
  lga?: string | null;
  address?: string | null;
  zipCode?: string | null;
  phone1?: string | null;
  phone2?: string | null;
  emergencyContactPhone?: string | null;
  emergencyContactRelation?: string | null;
}

interface MedicalInfo {
  genotype?: string | null;
  bloodGroup?: string | null;
  pregnancyExperience?: boolean | null;
  numberofChildren?: number | null;
  ceasareanSection?: boolean | null;
  chronicIllnessDetails?: string | null;
  pregnancyComplicationsDetails?: string | null;
  allergies?: string | null;
  medications?: string | null;
  surgeries?: string | null;
  disabilities?: string | null;
  numberOfMiscarriages?: number | null;
  endometriumUploadUrl?: string | null;
}

interface SurrogateProfile {
  countryOfResidence?: string | null;
  stateOfOrigin?: string | null;
  lga?: string | null;
  address?: string | null;
  zipCode?: string | null;
  phone1?: string | null;
  phone2?: string | null;
  emergencyContactPhone?: string | null;
  emergencyContactRelation?: string | null;
  medical?: MedicalInfo | null;
}

export default function SummaryScreen() {
  const { surrogateProfile, medicalProfile, fetchProfile, isLoading } = useProfile();
  const [profileLoaded, setProfileLoaded] = useState(false);

  useEffect(() => {
    if (!surrogateProfile) {
      fetchProfile().finally(() => setProfileLoaded(true));
    } else {
      setProfileLoaded(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [surrogateProfile]);

  const profile: SurrogateProfile = surrogateProfile || {};
  const medical: MedicalInfo = profile.medical || medicalProfile || {};

  if (isLoading || !profileLoaded) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  const renderField = (label: string, value: string | number | null | undefined) => (
    <YStack key={label} gap="$1">
      <Text fontWeight="600" fontSize={15} color={colors.text}>
        {label}
      </Text>
      <Text fontSize={14} color="#444">
        {value ?? "-"}
      </Text>
    </YStack>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff", padding: 20 }}>
      <ScreenHeader title="Profile Summary" onBackPress={() => router.back()} />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <YStack gap="$6">

          {/* Contact Information */}
          <YStack gap="$2">
            <Text fontSize={18} fontWeight="700" color={colors.primary}>
              Contact Information
            </Text>
            {renderField("Country of Residence", profile.countryOfResidence)}
            {renderField("State", profile.stateOfOrigin)}
            {renderField("LGA", profile.lga)}
            {renderField("Street Address", profile.address)}
            {renderField("Zip Code", profile.zipCode)}
            {renderField("Phone 1", profile.phone1)}
            {renderField("Phone 2", profile.phone2)}
            {renderField("Emergency Contact", profile.emergencyContactPhone)}
            {renderField("Relationship with Emergency Contact", profile.emergencyContactRelation)}
          </YStack>

          {/* Medical Details */}
          <YStack gap="$2">
            <Text fontSize={18} fontWeight="700" color={colors.primary}>
              Medical Details
            </Text>
            {renderField("Genotype", medical.genotype)}
            {renderField("Blood Group", medical.bloodGroup)}
            {renderField("Ever Pregnant", medical.pregnancyExperience ? "Yes" : "No")}
            {renderField("Number of Children", medical.numberofChildren)}
            {renderField("Caesarean Section", medical.ceasareanSection ? "Yes" : "No")}
            {renderField("Chronic Illnesses", medical.chronicIllnessDetails)}
            {renderField("Pregnancy Complications", medical.pregnancyComplicationsDetails)}
            {renderField("Allergies", medical.allergies)}
            {renderField("Medications", medical.medications)}
            {renderField("Surgeries/Hospitalizations", medical.surgeries)}
            {renderField("Disabilities", medical.disabilities)}
            {renderField("Number of Miscarriages", medical.numberOfMiscarriages)}
            {medical.endometriumUploadUrl && (
              <YStack gap="$1">
                <Text fontWeight="600" fontSize={15} color={colors.text}>
                  Endometrium Upload
                </Text>
                <Text fontSize={14} color="#444">{medical.endometriumUploadUrl}</Text>
              </YStack>
            )}
          </YStack>

        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}
