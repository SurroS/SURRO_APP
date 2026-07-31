import React, { useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, TouchableOpacity, Image, ActivityIndicator, Dimensions, View } from "react-native";
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

const FACE_OVAL_SIZE = 220;

export default function FaceScanScreen() {
  const params = useLocalSearchParams<Record<string, string>>();
  const { idFrontUri, idType } = params;
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
    }
  };

  const handleContinue = async () => {
    if (!imageUri) return;

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

      await submitKYC(idFront, undefined, faceScan, idType);

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
        <View style={styles.cameraContainer}>
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            facing="front"
          >
            {/* Face oval guide */}
            <View style={styles.faceGuide} pointerEvents="none">
              <View style={styles.oval} />
            </View>
            <Text style={styles.faceGuideText}>Position your face within the oval</Text>
          </CameraView>
          <View style={styles.cameraBottom}>
            <View style={styles.captureRow}>
              <TouchableOpacity
                style={styles.cancelCapture}
                onPress={() => setIsCameraOpen(false)}
              >
                <Ionicons name="close" size={26} color={colors.white} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.snapButton} onPress={takePicture}>
                <View style={styles.snapInner} />
              </TouchableOpacity>
              <View style={{ width: 44 }} />
            </View>
          </View>
        </View>
      ) : (
        <YStack
          flex={1}
          alignItems="center"
          justifyContent="center"
          paddingHorizontal={20}
        >
          <Text style={styles.title}>Face Verification</Text>
          <Text style={styles.subtitle}>
            Take a clear selfie to confirm your identity
          </Text>

          {imageUri ? (
            <Image
              source={{ uri: imageUri }}
              style={styles.previewImage}
            />
          ) : (
            <View style={styles.placeholder}>
              <Ionicons name="person-outline" size={48} color={colors.border} />
              <Text style={styles.placeholderText}>No selfie taken yet</Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.cameraButton}
            onPress={handleOpenCamera}
          >
            <Ionicons name="camera-outline" size={18} color={colors.white} />
            <Text style={styles.cameraText}>
              {imageUri ? " Retake Selfie" : " Take Selfie"}
            </Text>
          </TouchableOpacity>

          {imageUri && (
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleContinue}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={styles.submitText}>Submit Verification</Text>
              )}
            </TouchableOpacity>
          )}
        </YStack>
      )}

      <BottomModal
        visible={isModalVisible}
        title="Submitted Successfully"
        message="You are all set, taking you back home"
        success={true}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },

  // Camera view
  cameraContainer: {
    flex: 1,
    backgroundColor: colors.black,
  },
  camera: {
    flex: 1,
  },
  faceGuide: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  oval: {
    width: FACE_OVAL_SIZE,
    height: FACE_OVAL_SIZE * 1.3,
    borderRadius: FACE_OVAL_SIZE / 2,
    borderWidth: 2.5,
    borderColor: "rgba(255,255,255,0.7)",
  },
  faceGuideText: {
    position: "absolute",
    bottom: 120,
    alignSelf: "center",
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    backgroundColor: "rgba(0,0,0,0.4)",
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 6,
    overflow: "hidden",
  },
  cameraBottom: {
    position: "absolute",
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  captureRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 40,
  },
  cancelCapture: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  snapButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: "rgba(255,255,255,0.8)",
    alignItems: "center",
    justifyContent: "center",
  },
  snapInner: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.white,
  },

  // Ready state
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.primary,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: colors.gray,
    textAlign: "center",
    marginBottom: 32,
  },
  placeholder: {
    width: 200,
    height: 260,
    borderRadius: 100,
    backgroundColor: colors.lightGrayBg,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
  },
  placeholderText: {
    color: colors.placeholderText,
    fontSize: 13,
    marginTop: 8,
  },
  previewImage: {
    width: 200,
    height: 260,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: colors.primary,
    marginBottom: 32,
  },
  cameraButton: {
    flexDirection: "row",
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  cameraText: {
    color: colors.white,
    fontWeight: "700",
    fontSize: 16,
  },
  submitButton: {
    marginTop: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 32,
    width: "100%",
    alignItems: "center",
  },
  submitText: {
    color: colors.primary,
    fontWeight: "700",
    fontSize: 16,
  },
});
