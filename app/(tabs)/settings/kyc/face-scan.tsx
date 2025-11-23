import React, { useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import { YStack, Text } from "tamagui";
import { CameraView, useCameraPermissions } from "expo-camera";
import colors from "@/hooks/colors";
import { router, useLocalSearchParams } from "expo-router";
import { ScreenHeader } from "@/components/auth";
import BottomModal from "@/components/modals/BottomModal";
import { Ionicons } from "@expo/vector-icons";
import { useKYC } from "@/hooks/useKYC";
import { compressKYCImage } from "@/utils/imageCompression";
import { Toast } from "toastify-react-native";
import { ToastType } from "toastify-react-native/utils/interfaces";

export default function FaceScanScreen() {
  const params = useLocalSearchParams<Record<string, string>>();
  const { idFrontUri } = params;
  const { submitKYC, isLoading } = useKYC();
  
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();

  const handleOpenCamera = async () => {
    if (!permission?.granted) {
      const perm = await requestPermission();
      if (!perm.granted) {
        alert("Camera permission required.");
        return;
      }
    }
    setIsCameraOpen(true);
  };

  const takePicture = async () => {
    if (!cameraRef.current) return;

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 1,
        base64: false,
      });

      setImageUri(photo.uri);
      setIsCameraOpen(false);
    } catch (error) {
      console.log("Error taking picture:", error);
    }
  };

  const handleContinue = async () => {
    if (!imageUri) {
      Toast.show({
        text1: "Error",
        type: "customError" as ToastType,
        text2: "Please take a selfie first",
      });
      return;
    }

    if (!idFrontUri) {
      Toast.show({
        text1: "Error",
        type: "customError" as ToastType,
        text2: "ID front image is missing. Please start over.",
      });
      router.back();
      return;
    }

    try {
      Toast.show({
        text1: "Processing...",
        type: "customWarning" as ToastType,
        text2: "Compressing and submitting your verification",
      });

      const compressedFaceUri = await compressKYCImage(imageUri);
      const compressedIdFrontUri = await compressKYCImage(idFrontUri);

      const idFront = {
        uri: compressedIdFrontUri,
        type: "image/jpeg",
        name: "idFront.jpg",
      };

      const faceScan = {
        uri: compressedFaceUri,
        type: "image/jpeg",
        name: "faceScan.jpg",
      };

      await submitKYC(idFront, undefined, faceScan);

      setModalVisible(true);

      setTimeout(() => {
        setModalVisible(false);
        router.push("/(tabs)/home");
      }, 2000);
    } catch (error: any) {
      console.error("KYC submission error:", error);
      
      let errorMessage = "Failed to submit verification. Please try again.";
      
      if (error?.response?.status === 413) {
        errorMessage = "File size too large. Please retake photos and try again.";
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      Toast.show({
        text1: "Submission Failed",
        type: "customError" as ToastType,
        text2: errorMessage,
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <YStack marginLeft={28}>
        <ScreenHeader title="KYC" onBackPress={() => router.back()} />
      </YStack>

      {isCameraOpen ? (
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing="front"
          onCameraReady={() => console.log("Camera ready")}
        >
          <TouchableOpacity style={styles.snapButton} onPress={takePicture}>
            <Text style={styles.snapText}>Capture</Text>
          </TouchableOpacity>
        </CameraView>
      ) : (
        <YStack
          flex={1}
          alignItems="center"
          justifyContent="center"
          paddingHorizontal={20}
        >
          <Text style={styles.title}>Face Verification</Text>
          <Text style={styles.subtitle}>Image should be centered</Text>

          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.preview} />
          ) : (
            <YStack
              style={styles.placeholder}
              alignItems="center"
              justifyContent="center"
            >
              <Text style={{ color: "#999" }}>No image captured</Text>
            </YStack>
          )}

          <TouchableOpacity
            style={styles.cameraButton}
            onPress={handleOpenCamera}
          >
            <Ionicons name="camera-outline" size={18} color="#fff" />
            <Text style={styles.cameraText}>
              {" "}
              {imageUri ? "Retake Selfie" : "Take Selfie"}
            </Text>
          </TouchableOpacity>

          {imageUri && (
            <TouchableOpacity
              style={styles.continueButton}
              onPress={handleContinue}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={colors.primary} />
              ) : (
                <Text style={styles.continueText}>Submit</Text>
              )}
            </TouchableOpacity>
          )}
        </YStack>
      )}

      <BottomModal
        visible={isModalVisible}
        title="submitted successfully"
        message="You are all set, taking you back home"
        success={true}
      />
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
  },
  placeholder: {
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "#F0F0F0",
    marginBottom: 40,
  },
  preview: {
    width: 260,
    height: 260,
    borderRadius: 130,
    borderWidth: 3,
    borderColor: colors.primary,
    marginBottom: 40,
  },
  cameraButton: {
    flexDirection: "row",
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 40,
  },
  cameraText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  continueButton: {
    marginTop: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 40,
  },
  continueText: { color: colors.primary, fontWeight: "700", fontSize: 16 },

  // camera view
  camera: {
    flex: 1,
  },
  snapButton: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    backgroundColor: "white",
    padding: 18,
    borderRadius: 50,
  },
  snapText: {
    fontWeight: "700",
    color: "#000",
  },
});
