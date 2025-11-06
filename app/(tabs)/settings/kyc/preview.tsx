import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { YStack, Text } from "tamagui";
import { router, useLocalSearchParams } from "expo-router";
import colors from "@/hooks/colors";

export default function KYCPicturePreview() {
  const { idType } = useLocalSearchParams<{ idType?: string }>();
  const [loading, setLoading] = useState(false);
  const [imageUri, setImageUri] = useState(require("@/assets/images/id_sample.png")); // replace with actual captured URI

  const handleRetake = () => {
    router.back(); // return to camera/upload screen
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // simulate upload
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log("KYC document submitted:", imageUri);
      router.push("/settings/kyc/success");
    } catch (error) {
      console.error("Error uploading ID:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <YStack flex={1} paddingHorizontal={20} paddingTop={20} alignItems="center">
        <Text style={styles.title}>Confirm your ID photo</Text>
        <Text style={styles.subtitle}>
          Make sure your {idType || "ID"} is clearly visible and readable before submitting.
        </Text>

        <Image source={imageUri} style={styles.previewImage} />

        <TouchableOpacity
          onPress={handleRetake}
          style={[styles.actionButton, styles.retakeButton]}
          activeOpacity={0.8}
        >
          <Text style={[styles.actionText, { color: colors.primary }]}>Retake</Text>
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
              Confirm & Submit
            </Text>
          )}
        </TouchableOpacity>
      </YStack>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
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
    marginBottom: 30,
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
