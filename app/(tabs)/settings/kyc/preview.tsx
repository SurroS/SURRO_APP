import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { YStack, Text, ScrollView } from "tamagui";
import { router, useLocalSearchParams } from "expo-router";
import colors from "@/hooks/colors";
import { ScreenHeader } from "@/components/navigation/ScreenHeader";
import BottomModal from "@/components/modals/BottomModal";
import { useKYC } from "@/hooks/useKYC";
import { Toast } from "toastify-react-native";
import { ToastType } from "toastify-react-native/utils/interfaces";

export default function KYCPicturePreview() {
  const params = useLocalSearchParams<Record<string, string>>();
  const { idType, frontUri, backUri } = params;
  const { submitKYC, isLoading } = useKYC();

  const [isModalVisible, setIsModalVisible] = useState(false);

  const getFileName = (uri: string, defaultName: string): string => {
    const parts = uri.split("/");
    const fileName = parts[parts.length - 1];
    return fileName || defaultName;
  };

  const getMimeType = (uri: string): string => {
    if (uri.endsWith(".png")) return "image/png";
    if (uri.endsWith(".jpg") || uri.endsWith(".jpeg")) return "image/jpeg";
    return "image/jpeg";
  };

  const handleSubmit = async () => {
    if (!frontUri) {
      Toast.show({
        text1: "Error",
        type: "customError" as ToastType,
        text2: "Front ID image is required",
      });
      return;
    }

    try {
      const idFront = {
        uri: frontUri,
        type: getMimeType(frontUri),
        name: getFileName(frontUri, "idFront.jpg"),
      };

      const idBack = backUri
        ? {
            uri: backUri,
            type: getMimeType(backUri),
            name: getFileName(backUri, "idBack.jpg"),
          }
        : undefined;

      await submitKYC(idFront, idBack);

      setIsModalVisible(true);

      setTimeout(() => {
        setIsModalVisible(false);
        router.push("/settings/kyc/face-scan-rules");
      }, 2000);
    } catch (error: any) {
      console.error("KYC submission error:", error);
      Toast.show({
        text1: "Submission Failed",
        type: "customError" as ToastType,
        text2: error?.message || "Failed to submit KYC documents. Please try again.",
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <YStack marginLeft={28}>
        <ScreenHeader title="KYC" onBackPress={() => router.back()} />
      </YStack>
      <ScrollView flex={1}>
        <YStack paddingHorizontal={20} paddingTop={20} alignItems="center">
          <Text style={styles.title}>Confirm your ID photos</Text>
          <Text style={styles.subtitle}>
            Make sure your {idType} images are clearly visible and readable.
          </Text>

          <Image source={{ uri: frontUri }} style={styles.previewImage} />
          {backUri && (
            <Image source={{ uri: backUri }} style={styles.previewImage} />
          )}

          <TouchableOpacity
            onPress={() => router.back()}
            style={[styles.actionButton, styles.retakeButton]}
            activeOpacity={0.8}
          >
            <Text style={[styles.actionText, { color: colors.primary }]}>
              Retake
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSubmit}
            style={[styles.actionButton, styles.submitButton]}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={[styles.actionText, { color: "#fff" }]}>
                Confirm & Continue
              </Text>
            )}
          </TouchableOpacity>
        </YStack>

        <BottomModal
          visible={isModalVisible}
          title="Submitted Successfully"
          message="One last step — take a selfie for face verification."
          success
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20, paddingTop: 20 },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.primary,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#444",
    marginTop: 6,
    marginBottom: 20,
    textAlign: "center",
    width: "90%",
  },
  previewImage: {
    width: "100%",
    height: 220,
    borderRadius: 12,
    marginBottom: 20,
    resizeMode: "contain",
    backgroundColor: "#f9f9f9",
  },
  actionButton: {
    width: "100%",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  retakeButton: {
    backgroundColor: "#F2F2F6",
    borderWidth: 1,
    borderColor: colors.primary,
  },
  submitButton: {
    backgroundColor: colors.primary,
  },
  actionText: {
    fontSize: 16,
    fontWeight: "700",
  },
});
