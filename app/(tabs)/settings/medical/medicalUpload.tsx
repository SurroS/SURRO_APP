import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ActivityIndicator } from "react-native";
import { YStack, Button, ScrollView, Text, View } from "tamagui";
import { router, useLocalSearchParams } from "expo-router";
import { ScreenHeader } from "@/components/auth";
import UploadCard from "@/components/medical/uploadCard";
import colors from "@/hooks/colors";
import { Toast } from "toastify-react-native";
import { ToastType } from "toastify-react-native/utils/interfaces";
import { useProfile } from "@/hooks/useProfile";
import { uploadEndometriumImage as uploadEndometriumImageApi } from "@/services/profileApi";

export default function MedicalUpload() {
  const params = useLocalSearchParams<Record<string, string>>();
  const { updateMedicalProfile, isLoading } = useProfile();
  const [medicalReport, setMedicalReport] = useState<any>(null);

  const handleSubmit = async () => {
    try {
      let endometriumUploadUrl = "";

      if (medicalReport) {
        Toast.show({
          text1: "Uploading file...",
          type: "customWarning" as ToastType,
          text2: "Please wait",
        });

        const formData = new FormData();
        formData.append("file", {
          uri: medicalReport.uri,
          type: medicalReport.mimeType || medicalReport.type || "image/jpeg",
          name: medicalReport.name || "endometrium.jpg",
        } as any);

        try {
          const uploadResponse = await uploadEndometriumImageApi(formData);
          endometriumUploadUrl = uploadResponse.data?.medicalProfile?.endometriumUploadUrl || 
                                uploadResponse.data?.endometriumUploadUrl || "";
        } catch (uploadError) {
          console.warn("File upload failed, continuing without file URL:", uploadError);
        }
      }

      const medicalData = {
        genotype: params.genotype || "",
        bloodGroup: params.bloodGroup || "",
        pregnancyExperience: params.pregnancyExperience === "true",
        numberofChildren: parseInt(params.numberofChildren || "0", 10),
        ceasareanSection: params.ceasareanSection === "true",
        chronicIllnessDetails: params.chronicIllnessDetails || "None",
        pregnancyComplicationsDetails: params.pregnancyComplicationsDetails || "None",
        ...(endometriumUploadUrl && { endometriumUploadUrl }),
      };

      await updateMedicalProfile(medicalData);

      Toast.show({
        text1: "Medical profile updated successfully",
        type: "customSuccess" as ToastType,
        text2: "Your medical information has been saved",
      });

      router.push("/settings/medical/summary");
    } catch (error: any) {
      console.error("Medical profile submission error:", error);
      Toast.show({
        text1: "Submission Failed",
        type: "customError" as ToastType,
        text2: error?.response?.data?.message || "Failed to update medical profile. Please try again.",
      });
    }
  };

  const handleContinueLater = async () => {
    try {
      const medicalData = {
        genotype: params.genotype || "",
        bloodGroup: params.bloodGroup || "",
        pregnancyExperience: params.pregnancyExperience === "true",
        numberofChildren: parseInt(params.numberofChildren || "0", 10),
        ceasareanSection: params.ceasareanSection === "true",
        chronicIllnessDetails: params.chronicIllnessDetails || "None",
        pregnancyComplicationsDetails: params.pregnancyComplicationsDetails || "None",
      };

      await updateMedicalProfile(medicalData);

      Toast.show({
        text1: "Medical profile updated",
        type: "customSuccess" as ToastType,
        text2: "You can upload documents later",
      });

      router.push("/settings/medical/summary");
    } catch (error: any) {
      console.error("Medical profile submission error:", error);
      Toast.show({
        text1: "Submission Failed",
        type: "customError" as ToastType,
        text2: error?.response?.data?.message || "Failed to update medical profile. Please try again.",
      });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF", paddingTop: 20 }}>
      <View marginLeft={28}>
        <ScreenHeader
          title="Medical upload"
          onBackPress={() => router.back()}
        />
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <YStack padding="$4" gap="$5">
          <Text textAlign="center" fontSize={16} color="#001" marginBottom="$2">
            Please upload the relevant documents listed
          </Text>

          <UploadCard
            label="1. Endometrium upload"
            file={medicalReport}
            onFileSelect={setMedicalReport}
          />

          <YStack marginTop="$6" gap="$2">
            <Button
              backgroundColor={colors.primary}
              color="#FFF"
              disabled={isLoading}
              opacity={isLoading ? 0.7 : 1}
              onPress={handleSubmit}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                "Submit"
              )}
            </Button>

            <Button
              backgroundColor="#E9F3FF"
              color={colors.primary}
              disabled={isLoading}
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
