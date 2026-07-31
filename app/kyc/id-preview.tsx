import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, Image, TouchableOpacity } from "react-native";
import { YStack, Text } from "tamagui";
import { router, useLocalSearchParams } from "expo-router";
import colors from "@/hooks/colors";
import { ScreenHeader } from "@/components/navigation/ScreenHeader";
import { Ionicons } from "@expo/vector-icons";

export default function IDPreviewScreen() {
  const params = useLocalSearchParams<Record<string, string>>();
  const { idType, side, uri, frontUri } = params;
  const currentSide: "front" | "back" = (side as "front" | "back") || "front";
  const isPassport = idType === "passport";

  const readableId =
    idType === "national_id" ? "National ID Card"
    : idType === "drivers_license" ? "Driver's License"
    : "Passport";

  const handleRetake = () => {
    router.back();
  };

  const handleNext = () => {
    if (isPassport || currentSide === "back") {
      const previewParams: Record<string, string> = {
        idType: idType || "",
        frontUri: currentSide === "front" ? (uri || "") : (frontUri || ""),
      };
      if (currentSide === "back") {
        previewParams.backUri = uri || "";
      }
      router.push({
        pathname: "/kyc/preview",
        params: previewParams,
      });
    } else {
      router.push({
        pathname: "/kyc/uploads",
        params: {
          idType: idType || "",
          side: "back",
          frontUri: uri || "",
        },
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <YStack marginLeft={28}>
        <ScreenHeader title="KYC" onBackPress={() => router.back()} />
      </YStack>

      <YStack flex={1} paddingHorizontal={20} paddingTop={20} alignItems="center">
        <Text style={styles.title}>
          {isPassport
            ? "Confirm your passport photo"
            : currentSide === "front"
            ? "Confirm front side photo"
            : "Confirm back side photo"}
        </Text>
        <Text style={styles.subtitle}>
          {isPassport
            ? "Make sure your passport is clearly visible and readable."
            : currentSide === "front"
            ? `Make sure the front of your ${readableId} is clearly visible.`
            : `Make sure the back of your ${readableId} is clearly visible.`}
        </Text>

        <Image source={{ uri }} style={styles.previewImage} />

        {/* Retake button — camera icon under the preview */}
        <TouchableOpacity
          style={styles.retakeButton}
          onPress={handleRetake}
          activeOpacity={0.8}
        >
          <Ionicons name="camera" size={20} color={colors.primary} />
          <Text style={styles.retakeText}>Retake</Text>
        </TouchableOpacity>

        {/* Next button */}
        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNext}
          activeOpacity={0.8}
        >
          <Text style={styles.nextText}>
            {isPassport ? "Next" : currentSide === "front" ? "Next — Snap Back Side" : "Next — Review Both"}
          </Text>
        </TouchableOpacity>
      </YStack>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 20,
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
  },
  previewImage: {
    width: "100%",
    height: 260,
    borderRadius: 12,
    resizeMode: "contain",
    backgroundColor: "#f9f9f9",
  },
  retakeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: "#F2F2F6",
  },
  retakeText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.primary,
  },
  nextButton: {
    width: "100%",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 14,
    backgroundColor: colors.primary,
  },
  nextText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
});
