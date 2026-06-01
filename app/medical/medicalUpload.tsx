import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, ActivityIndicator, Image, Pressable } from "react-native";
import { YStack, Button, Text, View } from "tamagui";
import { router } from "expo-router";
import { ScreenHeader } from "@/components/auth";
import colors from "@/hooks/colors";
import UploadCard from "@/components/medical/uploadCard";
import { Toast } from "toastify-react-native";
import { ToastType } from "toastify-react-native/utils/interfaces";
import { useProfile } from "@/hooks/useProfile";
import { useProfileStore } from "@/store/profile/surrogate";
import { uploadEndometriumImage as uploadEndometriumImageApi } from "@/services/profileApi";

// Define a proper type for file uploads
type FileObject = {
  uri: string;
  name?: string;
  type?: string;
  mimeType?: string;
};

export default function MedicalUpload() {
  const { surrogateProfile, medicalProfile, updateMedicalProfile, fetchProfile, isLoading } =
    useProfile();
  const medical = surrogateProfile?.medical || medicalProfile;

  const [medicalReport, setMedicalReport] = useState<FileObject | null>(null);
  const [uploading, setUploading] = useState(false);

  // Fetch profile on mount if not loaded; prefill image once data arrives
  useEffect(() => {
    if (!surrogateProfile) {
      fetchProfile();
    }
    if (medical?.medicalReport && !medicalReport) {
      setMedicalReport({ uri: medical.medicalReport });
    }
  }, [surrogateProfile, medical, medicalReport, fetchProfile]);

  // Just store the selected file locally — no upload yet
  const handleFileSelect = (file: FileObject | null) => {
    setMedicalReport(file);
  };

  // Upload to backend, then navigate
  const handleContinue = async () => {
    if (!medicalReport?.uri) {
      router.push("/medical/medicalHistorySummary");
      return;
    }

    if (medical?.medicalReport && medicalReport.uri === medical.medicalReport) {
      router.push("/medical/medicalHistorySummary");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("file", {
        uri: medicalReport.uri,
        type: (medicalReport as any).mimeType || (medicalReport as any).type || "image/jpeg",
        name: (medicalReport as any).name || "endometrium.jpg",
      } as any);

      // Upload the image
      await uploadEndometriumImageApi(formData);

      // Refetch profile to get the updated medicalReport URL from the reliable GET endpoint
      await fetchProfile();
      const updatedMedical = useProfileStore.getState().medicalProfile || useProfileStore.getState().surrogateProfile?.medical;
      const backendUrl = updatedMedical?.medicalReport;

      if (!backendUrl) {
        console.error("[MedicalUpload] No medicalReport after upload. medical:", JSON.stringify(updatedMedical, null, 2));
        throw new Error("Upload failed: no URL returned");
      }

      await updateMedicalProfile({ medicalReport: backendUrl } as any);

      Toast.show({
        text1: "Endometrium image uploaded successfully",
        type: "customSuccess" as ToastType,
      });

      router.push("/medical/medicalHistorySummary");
    } catch (error: any) {
      console.error("[MedicalUpload] Failed to upload endometrium image", error);
      console.error("[MedicalUpload] Full error object:", JSON.stringify(error?.response?.data || error?.details || error, null, 2));
      Toast.show({
        text1: "Upload failed",
        text2: error?.response?.data?.message || error?.message || "Please try again later",
        type: "customError" as ToastType,
      });
    } finally {
      setUploading(false);
    }
  };

  const handleContinueLater = () => {
    console.log("[MedicalUpload] Continue Later pressed");
    router.push("/medical/medicalHistorySummary");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF", paddingTop: 20 }}>
      <View marginLeft={28}>
        <ScreenHeader title="Medical Upload" onBackPress={() => router.back()} />
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <YStack padding="$4" gap="$5">
          <Text textAlign="center" fontSize={16} color="#001" marginBottom="$2">
            Please upload the relevant documents listed
          </Text>

          {medicalReport?.uri && !uploading ? (
            <YStack gap="$2" alignItems="center">
              <Image
                source={{ uri: medicalReport.uri }}
                style={{ width: "100%", maxWidth: 300, aspectRatio: 1, borderRadius: 10 }}
              />
              <Pressable onPress={() => setMedicalReport(null)}>
                <Text style={{ color: colors.primary, textDecorationLine: "underline", fontSize: 13 }}>
                  Change Image
                </Text>
              </Pressable>
            </YStack>
          ) : (
            <UploadCard
              label="1. Endometrium upload"
              file={medicalReport}
              onFileSelect={handleFileSelect}
            />
          )}

          <YStack marginTop="$6" gap="$2">
            <Button
              backgroundColor={colors.primary}
              color="#FFF"
              disabled={isLoading || uploading}
              opacity={isLoading || uploading ? 0.7 : 1}
              onPress={handleContinue}
            >
              {isLoading || uploading ? <ActivityIndicator color="#FFF" /> : "Continue"}
            </Button>

            <Pressable
              onPress={handleContinueLater}
              disabled={isLoading || uploading}
              style={{ alignSelf: "center", paddingVertical: 12 }}
            >
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
