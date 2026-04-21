import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, ActivityIndicator, Image } from "react-native";
import { YStack, Text } from "tamagui";
import { router } from "expo-router";
import { ScreenHeader } from "@/components/auth";
import colors from "@/hooks/colors";
import { useProfile } from "@/hooks/useProfile";

export default function SummaryScreen() {
  const { surrogateProfile, medicalProfile, fetchProfile, isLoading } =
    useProfile();
  const [profileLoaded, setProfileLoaded] = useState(false);

  useEffect(() => {
    if (!surrogateProfile) {
      fetchProfile().finally(() => setProfileLoaded(true));
    } else {
      setProfileLoaded(true);
    }
  }, [surrogateProfile]);

  const profile = surrogateProfile;
  const medical = medicalProfile || profile?.medical;

  if (isLoading || !profileLoaded) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  const renderField = (
    label: string,
    value: string | number | string[] | null | undefined
  ) => {
    let displayValue: string;
    if (Array.isArray(value)) {
      displayValue = value.length > 0 ? value.join(", ") : "-";
    } else if (value === null || value === undefined || value === "") {
      displayValue = "-";
    } else {
      displayValue = String(value);
    }

    return (
      <YStack key={label} gap="$1">
        <Text fontWeight="600" fontSize={15} color={colors.text}>
          {label}
        </Text>
        <Text fontSize={14} color="#444">
          {displayValue}
        </Text>
      </YStack>
    );
  };

  const renderYesNo = (value?: boolean | null) =>
    value === true ? "Yes" : value === false ? "No" : "-";

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

            {renderField("Country of Residence", profile?.countryOfResidence)}
            {renderField("State", profile?.stateOfOrigin)}
            {renderField("LGA", profile?.lga)}
            {renderField("Street Address", profile?.address)}
            {renderField("Zip Code", profile?.zipCode)}
            {renderField("Phone 1", profile?.phone1)}
            {renderField("Phone 2", profile?.phone2)}
            {renderField("Emergency Contact", profile?.emergencyContactPhone)}
            {renderField(
              "Relationship with Emergency Contact",
              profile?.emergencyContactRelation
            )}
          </YStack>

          {/* Medical Details */}
          <YStack gap="$2">
            <Text fontSize={18} fontWeight="700" color={colors.primary}>
              Medical Details
            </Text>

            {renderField("Genotype", medical?.genotype)}
            {renderField("Blood Group", medical?.bloodGroup)}
            {renderField("Ever Pregnant", renderYesNo(medical?.pregnancyExperience))}
            {renderField("Number of Children", medical?.numberOfChildren)}
            {renderField("Caesarean Section", renderYesNo(medical?.ceasareanSection))}
            {renderField("Number of Cs", medical?.numberOfCs)}
            {renderField("Chronic Illnesses", medical?.chronicIllnesses)}
            {renderField(
              "Pregnancy Complications",
              medical?.pregnancyComplicationsDetails
            )}
            {renderField("Has Allergies", renderYesNo(medical?.hasAllergies))}
            {renderField("Allergies", medical?.allergies)}
            {renderField("Has Chronic Illness", renderYesNo(medical?.hasChronicIllness))}
            {renderField("Chronic Illness", medical?.chronicIllnesses)}
            {renderField("Other Chronic Illness", medical?.otherChronicIllness)}
            {renderField("Takes Medication", renderYesNo(medical?.takesMedication))}
            {renderField("Medications", medical?.medications)}
            {renderField("Had Surgeries", renderYesNo(medical?.hadSurgery))}
            {renderField("Surgeries", medical?.surgeries)}
            {renderField("Has Disability", renderYesNo(medical?.hasDisability))}
            {renderField("Disabilities", medical?.disabilities)}
            {renderField("Has Miscarriages", renderYesNo(medical?.hadMiscarriage))}
            {renderField("Number of Miscarriages", medical?.numberOfMiscarriages)}

            {/* Endometrium Upload */}
            {medical?.endometriumUploadUrl && (
              <YStack gap="$1">
                <Text fontWeight="600" fontSize={15} color={colors.text}>
                  Endometrium Upload
                </Text>

                <Image
                  source={{ uri: medical.endometriumUploadUrl }}
                  style={{
                    width: "100%",
                    height: 200,
                    borderRadius: 8,
                    backgroundColor: "#F2F2F2",
                  }}
                  resizeMode="contain"
                />
              </YStack>
            )}
          </YStack>
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}
