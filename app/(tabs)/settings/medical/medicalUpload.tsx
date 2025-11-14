import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { YStack, Button, ScrollView, Text, View } from "tamagui";
import { router } from "expo-router";
import { ScreenHeader } from "@/components/auth";
import UploadCard from "@/components/medical/uploadCard";
import colors from "@/hooks/colors";
import { Toast } from "toastify-react-native";
import { ToastType } from "toastify-react-native/utils/interfaces";

export default function MedicalUpload() {
  const [medicalReport, setMedicalReport] = useState<any>(null);

  const handleSubmit = () => {
    if (medicalReport) {
      Toast.show({
        text1: "File uploaded successfully",
        type: "customSuccess" as ToastType,
      });
      router.push("/settings/medical/summary");
    }
  };

  const handleContinueLater = () => {
    router.push("/settings/medical/summary");
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
              disabled={!medicalReport}
              opacity={!medicalReport ? 0.5 : 1}
              onPress={handleSubmit}
            >
              Submit
            </Button>

            <Button
              backgroundColor="#E9F3FF"
              color={colors.primary}
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
