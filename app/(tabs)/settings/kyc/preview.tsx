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
import BottomModal from "@/components/BottomModal";

export default function KYCPicturePreview() {
  const params = useLocalSearchParams<Record<string, string>>();
  const { idType, frontUri, backUri } = params;

  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      setIsModalVisible(true);
      await new Promise((r) => setTimeout(r, 2000));
      console.log("KYC document submitted:", { idType, frontUri, backUri });
      router.push("/settings/kyc/face-scan-rules");
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setIsModalVisible(false);
      setLoading(false);
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
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
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
