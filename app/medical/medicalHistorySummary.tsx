import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, ActivityIndicator, Image } from "react-native";
import { YStack, Text } from "tamagui";
import { router } from "expo-router";
import { ScreenHeader } from "@/components/auth";
import colors from "@/hooks/colors";
import { useProfile } from "@/hooks/useProfile";

const formatDate = (dateStr?: string | null) => {
  if (!dateStr) return "-";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
};

const formatCurrency = (amount?: number | null) => {
  if (amount == null) return "-";
  return `₦${amount.toLocaleString()}`;
};

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

  const renderYesNo = (value?: boolean | string | null) => {
    if (value === true || value === "Yes") return "Yes";
    if (value === false || value === "No") return "No";
    return "-";
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff", padding: 20 }}>
      <ScreenHeader title="Profile Summary" onBackPress={() => router.back()} />

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <YStack gap="$6">
          {/* Personal Information */}
          <YStack gap="$2">
            <Text fontSize={18} fontWeight="700" color={colors.primary}>
              Personal Information
            </Text>

            {renderField("First Name", profile?.firstName)}
            {renderField("Last Name", profile?.lastName)}
            {renderField("Username", profile?.userName)}
            {renderField("Date of Birth", formatDate(profile?.dateOfBirth))}
            {renderField("Marital Status", profile?.maritalStatus)}
            {renderField("Height (cm)", profile?.height)}
            {renderField("Weight (kg)", profile?.weight)}
            {renderField("Country of Origin", profile?.countryOfOrigin)}
          </YStack>

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

          {/* Surrogacy Experience */}
          <YStack gap="$2">
            <Text fontSize={18} fontWeight="700" color={colors.primary}>
              Surrogacy Experience
            </Text>

            {renderField("Has Been Surrogate", renderYesNo(profile?.hasBeenSurrogate))}
            {renderField("Previous Pregnancy Type", profile?.previousPregnancyType)}
            {renderField("Number of Babies Carried", profile?.numberOfBabiesCarried)}
            {renderField("Experience Level", profile?.experienceLevel)}
            {renderField("Compensation Amount", formatCurrency(profile?.compensationAmount))}
            {renderField("Compensation Negotiable", renderYesNo(profile?.compensationNegotiable))}
            {renderField("Experience Notes", profile?.experienceNotes)}
            {renderField("Enjoyment Notes", profile?.enjoymentNotes)}
            {renderField("Number of Children", profile?.numberOfChildren)}
          </YStack>

          {/* Medical Details */}
          <YStack gap="$2">
            <Text fontSize={18} fontWeight="700" color={colors.primary}>
              Medical Details
            </Text>

            {renderField("Genotype", medical?.genotype)}
            {renderField("Blood Group", medical?.bloodGroup)}
            {renderField("Pregnant", renderYesNo(medical?.pregnant))}
            {renderField("Number of Children", medical?.children)}
            {renderField("Caesarean Section", renderYesNo(medical?.caesarean))}
            {renderField("Number of Cs", medical?.numberOfCs)}
            {renderField("Has Chronic Illness", renderYesNo(medical?.hasChronicIllness))}
            {renderField("Chronic Illnesses", medical?.chronicIllnesses)}
            {renderField("Other Chronic Illness", medical?.otherChronicIllness)}
            {renderField("Has Allergies", renderYesNo(medical?.hasAllergies))}
            {renderField("Allergies", medical?.allergies)}
            {renderField("Takes Medication", renderYesNo(medical?.takesMedication))}
            {renderField("Medications", medical?.medications)}
            {renderField("Had Surgeries", renderYesNo(medical?.hadSurgery))}
            {renderField("Surgeries", medical?.surgeries)}
            {renderField("Has Disability", renderYesNo(medical?.hasDisability))}
            {renderField("Disabilities", medical?.disabilities)}
            {renderField("Had Miscarriage", renderYesNo(medical?.hadMiscarriage))}
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
