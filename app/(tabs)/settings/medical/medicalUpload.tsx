import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, ActivityIndicator, Image } from "react-native";
import { YStack, Button, Text, View } from "tamagui";
import { router, useLocalSearchParams } from "expo-router";
import { ScreenHeader } from "@/components/auth";
import colors from "@/hooks/colors";
import UploadCard from "@/components/medical/uploadCard";
import { Toast } from "toastify-react-native";
import { ToastType } from "toastify-react-native/utils/interfaces";
import { useProfile } from "@/hooks/useProfile";
import { uploadEndometriumImage as uploadEndometriumImageApi } from "@/services/profileApi";

export default function MedicalUpload() {
  const params = useLocalSearchParams<Record<string, string>>();
  const {
    surrogateProfile,
    medicalProfile,
    updateMedicalProfile,
    fetchProfile,
    isLoading,
  } = useProfile();
  const medical = surrogateProfile?.medical || medicalProfile;

  const [medicalReport, setMedicalReport] = useState<any>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!medical && !surrogateProfile) {
      console.log("[MedicalUpload] Fetching profile from backend...");
      fetchProfile();
    }
  }, []);

  useEffect(() => {
    if (medical?.endometriumUploadUrl && !medicalReport) {
      console.log(
        "[MedicalUpload] Loaded endometrium image from backend:",
        medical.endometriumUploadUrl
      );
      setMedicalReport({ uri: medical.endometriumUploadUrl });
    }
  }, [medical]);

  const handleUpload = async (file: any) => {
    setMedicalReport(file);
    try {
      setUploading(true);
      console.log("[MedicalUpload] Uploading file to backend...", file);

      const formData = new FormData();
      formData.append("file", {
        uri: file.uri,
        type: file.mimeType || file.type || "image/jpeg",
        name: file.name || "endometrium.jpg",
      } as any);

      const uploadResponse = await uploadEndometriumImageApi(formData);
      const endometriumUploadUrl =
        uploadResponse.data?.medicalProfile?.endometriumUploadUrl ||
        uploadResponse.data?.endometriumUploadUrl ||
        "";

      console.log(
        "[MedicalUpload] Upload response from backend:",
        uploadResponse.data
      );

      await updateMedicalProfile({ endometriumUploadUrl });

      Toast.show({
        text1: "Endometrium image uploaded successfully",
        type: "customSuccess" as ToastType,
      });
    } catch (error: any) {
      console.error(
        "[MedicalUpload] Failed to upload endometrium image",
        error
      );
      Toast.show({
        text1: "Upload failed",
        text2: error?.response?.data?.message || "Please try again later",
        type: "customError" as ToastType,
      });
    } finally {
      setUploading(false);
    }
  };

  const handleContinueLater = async () => {
    console.log("[MedicalUpload] Continue Later pressed");
    router.push("/settings/medical/medicalHistorySummary");
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

          {medicalReport?.uri && !uploading ? (
            <YStack gap="$2" alignItems="center">
              <Image
                source={{ uri: medicalReport.uri }}
                style={{ width: 200, height: 200, borderRadius: 10 }}
              />
              <Button
                backgroundColor={colors.gray}
                color={colors.primary}
                onPress={() => setMedicalReport(null)}
              >
                Change Image
              </Button>
            </YStack>
          ) : (
            <UploadCard
              label="1. Endometrium upload"
              file={medicalReport}
              onFileSelect={handleUpload}
            />
          )}

          <YStack marginTop="$6" gap="$2">
            <Button
              backgroundColor={colors.primary}
              color="#FFF"
              disabled={isLoading || uploading}
              opacity={isLoading || uploading ? 0.7 : 1}
              onPress={() =>
                router.push("/settings/medical/medicalHistorySummary")
              }
            >
              {isLoading || uploading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                "Continue"
              )}
            </Button>

            <Button
              backgroundColor="#E9F3FF"
              color={colors.primary}
              disabled={isLoading || uploading}
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
