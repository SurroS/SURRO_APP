import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, TouchableOpacity, Image, Alert } from "react-native";
import { YStack, XStack, Text, ScrollView } from "tamagui";
import { router, useLocalSearchParams } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { CheckCircle } from "@tamagui/lucide-icons";
import colors from "@/hooks/colors";
import { ScreenHeader } from "@/components/auth";

export default function KYCUploadScreen() {
  const { idType } = useLocalSearchParams<{ idType: string }>();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const handleTakePicture = async () => {
    try {
      // ask permission first
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission required",
          "Please allow camera access to take a picture of your ID."
        );
        return;
      }

      // launch camera
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        allowsEditing: true,
      });

      if (!result.canceled && result.assets?.length) {
        const uri = result.assets[0].uri;
        setCapturedImage(uri);

        // navigate to preview
        router.push({
          pathname: "/(tabs)/settings/kyc/preview",
          params: { idType, imageUri: uri },
        });
      }
    } catch (error) {
      console.error("Camera error:", error);
      Alert.alert("Error", "Failed to open camera. Please try again.");
    }
  };

  const readableId =
    idType === "national_id"
      ? "National ID card"
      : idType === "drivers_license"
      ? "Driver’s License"
      : "Passport";

  return (
    <SafeAreaView style={styles.container}>
       <ScreenHeader title="KYC" onBackPress={() => router.back()} />
        <ScrollView>
      <YStack paddingHorizontal={20} paddingTop={20} flex={1}>
        <Text style={styles.title}>Take a picture of your ID</Text>
        <Text style={styles.subtitle}>
          Ensure your {readableId} is clear and all details are visible.
        </Text>

        <YStack
          backgroundColor="#F8F8FA"
          borderRadius={16}
          alignItems="center"
          justifyContent="center"
          marginTop={30}
          paddingVertical={40}
        >
          <Image
            source={
              capturedImage
                ? { uri: capturedImage }
                : require("@/assets/images/id_sample.png")
            }
            style={{ width: 180, height: 120, resizeMode: "contain" }}
          />
        </YStack>

        <YStack gap="$3" marginTop={30}>
          <ChecklistItem text="Your ID has not expired" />
          <ChecklistItem text="It is clear and easy to read" />
          <ChecklistItem text="All your details are in frame" />
        </YStack>

        <TouchableOpacity
          style={styles.button}
          onPress={handleTakePicture}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Take picture</Text>
        </TouchableOpacity>
      </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}

const ChecklistItem = ({ text }: { text: string }) => (
  <XStack alignItems="center" gap="$3">
    <CheckCircle color="#09d814ff" size={20} />
    <Text style={styles.checkText}>{text}</Text>
  </XStack>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.primary,
  },
  subtitle: {
    fontSize: 14,
    color: "#444",
    marginTop: 6,
  },
  button: {
    marginTop: "auto",
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  checkText: { fontSize: 14, color: "#333" },
});
