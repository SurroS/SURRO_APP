import React, { useRef, useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, TouchableOpacity, View, Image, Alert } from "react-native";
import { YStack, Text } from "tamagui";
import { CameraView, useCameraPermissions } from "expo-camera";
import { router, useLocalSearchParams } from "expo-router";
import colors from "@/hooks/colors";
import { ScreenHeader, PrimaryButton } from "@/components/auth";
import { Ionicons } from "@expo/vector-icons";

export default function KYCUploadScreen() {
  const params = useLocalSearchParams<Record<string, string>>();
  const { idType } = params;

  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [capturedFront, setCapturedFront] = useState<string | null>(null);
  const [capturedBack, setCapturedBack] = useState<string | null>(null);
  const [step, setStep] = useState<"front" | "back">("front");

  useEffect(() => {
    if (!permission) requestPermission();
  }, [permission]);

  const handleCapture = async () => {
    if (!cameraRef.current) return;

    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 1 });
      if (step === "front") {
        setCapturedFront(photo.uri);
        if (idType === "passport") {
          // Passport only has one side
          router.push({
            pathname: "/settings/kyc/preview",
            params: { idType, frontUri: photo.uri },
          });
        } else {
          setStep("back");
        }
      } else {
        setCapturedBack(photo.uri);
        router.push({
          pathname: "/settings/kyc/preview",
          params: { idType, frontUri: capturedFront || "", backUri: photo.uri },
        });
      }
    } catch (error) {
      console.error("Camera capture error:", error);
      Alert.alert("Error", "Could not take picture. Try again.");
    }
  };

  if (!permission?.granted) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text color={colors.primary}>Requesting camera permission...</Text>
      </SafeAreaView>
    );
  }

  const readableId =
    idType === "national_id"
      ? "National ID Card"
      : idType === "drivers_license"
      ? "Driver’s License"
      : "Passport";

  return (
    <SafeAreaView style={styles.container}>
      <YStack marginLeft={28}>
        <ScreenHeader title="KYC" onBackPress={() => router.back()} />
      </YStack>

      <YStack flex={1} paddingHorizontal={20} paddingTop={20}>
        <Text style={styles.title}>
          {step === "front"
            ? `Capture the FRONT of your ${readableId}`
            : `Capture the BACK of your ${readableId}`}
        </Text>

        <View style={styles.cameraBox}>
          <CameraView ref={cameraRef} style={styles.camera} />
        </View>

        <PrimaryButton
          title={`Capture ${step === "front" ? "Front" : "Back"}`}
          onPress={handleCapture}
          icon={<Ionicons name="camera" size={20} color="#fff" />}
        />
      </YStack>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.primary,
    textAlign: "center",
    marginBottom: 14,
  },
  cameraBox: {
    width: "100%",
    height: 300,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#eee",
    marginBottom: 20,
  },
  camera: { flex: 1 },
});
